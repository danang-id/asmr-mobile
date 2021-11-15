import {Platform} from 'react-native';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import {API_BASE_URL} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import type {SetProgressInfo} from '../libs/context/ProgressContextInfo';
import {version} from '../../package.json';
import type {ILogger} from '../libs/common/Logger';
import Logger from '../libs/common/Logger';

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
	CSRF_REQUEST_TOKEN_COOKIE_NAME = 'ASMR.CSRF-Request-Token';
	CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token';
	SERVICE_COOKIES_STORAGE_KEY = 'SERVICE_COOKIES';
	SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY = 'SERVICE_CSRF_REQUEST_TOKEN';

	client: AxiosInstance;
	logger: ILogger;
	options: ServiceOptions;
	setProgress: SetProgressInfo;

	constructor(cancelTokenSource: CancelTokenSource, options?: ServiceOptions, setProgress?: SetProgressInfo) {
		this.logger = new Logger(ServiceBase.name);
		this.options = options ?? {
			log: {
				requestHeader: false,
				requestBody: false,
				responseHeader: false,
				responseBody: false,
			},
		};
		this.setProgress = setProgress ?? (() => {});
		this.client = axios.create({
			baseURL: API_BASE_URL,
			cancelToken: cancelTokenSource.token,
			headers: {
				Accept: 'application/json',
			},
			params: {
				clientPlatform: Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : Platform.OS,
				clientVersion: version,
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
		this.logger.info(`[${response.status}] ${request.method.toUpperCase()} ${request.url}`);
		if (this.options.log.requestHeader === true) {
			this.logger.info(request.headers);
		}
		if (this.options.log.requestBody === true && request.data) {
			this.logger.info(`Request: ${request.data}`);
		}
		if (this.options.log.responseHeader === true) {
			this.logger.info(response.headers);
		}
		if (this.options.log.responseBody === true && response.data) {
			this.logger.info(`Response: ${JSON.stringify(response.data)}`);
		}
	}

	_logError(error: AxiosError) {
		this.logger.error(error);
	}

	async _onRequestFulfilled(request: AxiosRequestConfig) {
		this.setProgress(true, 0);

		const cookieHeader = await EncryptedStorage.getItem(this.SERVICE_COOKIES_STORAGE_KEY);
		if (cookieHeader) {
			request.headers.Cookie = cookieHeader;
		}

		const csrfRequestToken = await EncryptedStorage.getItem(this.SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY);
		if (csrfRequestToken) {
			request.headers[this.CSRF_TOKEN_HEADER_NAME] = csrfRequestToken;
		}

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
			await EncryptedStorage.setItem(this.SERVICE_COOKIES_STORAGE_KEY, setCookieHeaderString);

			const cookies = setCookieHeaderString.split(',');
			for (const cookie of cookies) {
				const cookieBase = cookie.trim().split(';')[0].split('=');
				const cookieName = cookieBase[0];
				if (cookieName === this.CSRF_REQUEST_TOKEN_COOKIE_NAME) {
					const cookieValue = cookieBase[1];
					await EncryptedStorage.setItem(this.SERVICE_CSRF_REQUEST_TOKEN_STORAGE_KEY, cookieValue);
				}
			}
		}

		this._logRequest(response.config, response);
		this.setProgress(true, 1);
		return response;
	}

	_onResponseRejected(error: AxiosError) {
		this._logError(error);
		return Promise.reject(error);
	}

	_processData<T>(response: AxiosResponse<T>): T {
		return response.data;
	}

	_finalize() {
		this.setProgress(false, 0);
	}
}
