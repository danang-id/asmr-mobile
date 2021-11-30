import {API_BASE_URL} from '@env';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import {Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import ClientPlatform from 'asmr/core/enums/ClientPlatform';
import Logger from 'asmr/libs/common/Logger';

export interface ServiceLogOptions {
	requestHeader?: boolean;
	requestBody?: boolean;
	responseHeader?: boolean;
	responseBody?: boolean;
}

export interface ServiceOptions {
	log: ServiceLogOptions;
}

class ServiceBase {
	private static CSRF_REQUEST_TOKEN_COOKIE_NAME = 'ASMR.CSRF-Request-Token';
	private static CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';
	private static SERVICE_COOKIES_STORAGE_KEY = 'SERVICE_COOKIES';
	private static SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY = 'SERVICE_CSRF_REQUEST_TOKEN';

	protected client: AxiosInstance;
	protected options: ServiceOptions;
	protected setProgress: SetProgressInfo;
	protected tag: string = ServiceBase.name;

	constructor(cancelTokenSource: CancelTokenSource, setProgress: SetProgressInfo, options?: ServiceOptions) {
		this.options = options ?? {
			log: {
				requestHeader: false,
				requestBody: false,
				responseHeader: false,
				responseBody: false,
			},
		};
		this.setProgress = setProgress;
		this.client = axios.create({
			baseURL: API_BASE_URL,
			cancelToken: cancelTokenSource.token,
			headers: {
				Accept: 'application/json',
			},
			params: {
				clientPlatform:
					Platform.OS === 'android'
						? ClientPlatform.Android
						: Platform.OS === 'ios'
						? ClientPlatform.iOS
						: Platform.OS,
				clientVersion: getVersion(),
			},
			validateStatus: status => status >= 200 && status <= 504,
		});
		this.client.interceptors.request.use(this.onRequestFulfilled.bind(this), this.onRequestRejected.bind(this));
		this.client.interceptors.response.use(this.onResponseFulfilled.bind(this), this.onResponseRejected.bind(this));
	}

	protected logRequestResponse(request: AxiosRequestConfig, response: AxiosResponse) {
		const status = response.status.toString(10);
		const method = request.method?.toUpperCase();
		const url = request.url?.endsWith('/') ? request.url.substring(0, request.url.length - 1) : request.url;
		const urlSearchParams = new URLSearchParams(request.params).toString();
		const params = urlSearchParams !== '' ? `?${urlSearchParams}` : '';
		Logger.info(this.tag, `[${status}] ${method} ${url}${params}`);

		if (this.options.log.requestHeader === true) {
			Logger.info(this.tag, request.headers);
		}
		if (this.options.log.requestBody === true && request.data) {
			Logger.info(this.tag, `Request: ${request.data}`);
		}
		if (this.options.log.responseHeader === true) {
			Logger.info(this.tag, response.headers);
		}
		if (this.options.log.responseBody === true && response.data) {
			Logger.info(this.tag, `Response: ${JSON.stringify(response.data)}`);
		}
	}

	protected logError(error: AxiosError) {
		Logger.error(this.tag, error);
	}

	protected async onRequestFulfilled(request: AxiosRequestConfig) {
		const cookieHeader = await EncryptedStorage.getItem(ServiceBase.SERVICE_COOKIES_STORAGE_KEY);
		if (cookieHeader && request.headers) {
			request.headers.Cookie = cookieHeader;
		}

		const csrfRequestToken = await EncryptedStorage.getItem(ServiceBase.SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY);
		if (csrfRequestToken && request.headers) {
			request.headers[ServiceBase.CSRF_TOKEN_HEADER_NAME] = csrfRequestToken;
		}

		this.setProgress(true, 0.25);
		return request;
	}

	protected onRequestRejected(error: AxiosError) {
		this.logError(error);
		return Promise.reject(error);
	}

	protected async onResponseFulfilled(response: AxiosResponse) {
		const setCookieHeaders = response.headers['set-cookie'];
		if (setCookieHeaders) {
			let setCookieHeaderString = '';
			if (Array.isArray(setCookieHeaders)) {
				for (const setCookieHeader of setCookieHeaders) {
					setCookieHeaderString += setCookieHeader;
				}
			} else if (typeof setCookieHeaders === 'string') {
				setCookieHeaderString = setCookieHeaders;
			}
			await EncryptedStorage.setItem(ServiceBase.SERVICE_COOKIES_STORAGE_KEY, setCookieHeaderString);

			const cookies = setCookieHeaderString.split(',');
			for (const cookie of cookies) {
				const cookieBase = cookie.trim().split(';')[0].split('=');
				const cookieName = cookieBase[0];
				if (cookieName === ServiceBase.CSRF_REQUEST_TOKEN_COOKIE_NAME) {
					const cookieValue = cookieBase[1];
					await EncryptedStorage.setItem(ServiceBase.SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY, cookieValue);
				}
			}
		}

		this.logRequestResponse(response.config, response);
		this.setProgress(true, 0.75);
		return response;
	}

	protected onResponseRejected(error: AxiosError) {
		this.logError(error);
		return Promise.reject(error);
	}

	protected prepare() {
		this.setProgress(true, 0);
	}

	protected processData<T>(response: AxiosResponse<T>): T {
		this.setProgress(true, 1);
		return response.data;
	}

	protected finalize() {
		this.setProgress(false, 0);
	}
}

export default ServiceBase;
