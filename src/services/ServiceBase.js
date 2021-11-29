import {Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {API_BASE_URL} from '@env';
import Logger from '../libs/common/Logger';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';

export interface ServiceLogOptions {
	requestHeader?: boolean;
	requestBody?: boolean;
	responseHeader?: boolean;
	responseBody?: boolean;
}

export interface ServiceOptions {
	log: ServiceLogOptions;
}

export default class ServiceBase {
	static CSRF_REQUEST_TOKEN_COOKIE_NAME = 'ASMR.CSRF-Request-Token';
	static CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';
	static SERVICE_COOKIES_STORAGE_KEY = 'SERVICE_COOKIES';
	static SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY = 'SERVICE_CSRF_REQUEST_TOKEN';

	client: AxiosInstance;
	options: ServiceOptions;
	setProgress: SetProgressInfo;
	tag: string = ServiceBase.name;

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
				clientPlatform: Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : Platform.OS,
				clientVersion: getVersion(),
			},
			validateStatus: status => status >= 200 && status <= 504,
		});

		this.client.interceptors.request.use(this._onRequestFulfilled.bind(this), this._onRequestRejected.bind(this));

		this.client.interceptors.response.use(
			this._onResponseFulfilled.bind(this),
			this._onResponseRejected.bind(this),
		);
	}

	_logRequest(request: AxiosRequestConfig, response: AxiosResponse) {
		const status = response.status.toString(10);
		const method = request.method.toUpperCase();
		const url = request.url.endsWith('/') ? request.url.substring(0, request.url.length - 1) : request.url;
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

	_logError(error: AxiosError) {
		Logger.error(this.tag, error);
	}

	async _onRequestFulfilled(request: AxiosRequestConfig) {
		const cookieHeader = await EncryptedStorage.getItem(ServiceBase.SERVICE_COOKIES_STORAGE_KEY);
		if (cookieHeader) {
			request.headers.Cookie = cookieHeader;
		}

		const csrfRequestToken = await EncryptedStorage.getItem(ServiceBase.SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY);
		if (csrfRequestToken) {
			request.headers[ServiceBase.CSRF_TOKEN_HEADER_NAME] = csrfRequestToken;
		}

		this.setProgress(true, 0.25);
		return request;
	}

	_onRequestRejected(error: AxiosError) {
		this._logError(error);
		return Promise.reject(error);
	}

	async _onResponseFulfilled(response: AxiosResponse) {
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

		this._logRequest(response.config, response);
		this.setProgress(true, 0.75);
		return response;
	}

	_onResponseRejected(error: AxiosError) {
		this._logError(error);
		return Promise.reject(error);
	}

	_start() {
		this.setProgress(true, 0);
	}

	_processData<T>(response: AxiosResponse<T>): T {
		this.setProgress(true, 1);
		return response.data;
	}

	_finalize() {
		this.setProgress(false, 0);
	}
}
