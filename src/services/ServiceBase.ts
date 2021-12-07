import {API_BASE_URL} from '@env';
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import {Platform} from 'react-native';
import {getApplicationName, getVersion} from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SetProgressInfo} from 'asmr/context/ProgressContextInfo';
import ErrorInformation from 'asmr/core/common/ErrorInformation';
import ResponseModelBase from 'asmr/core/common/ResponseModelBase';
import ClientPlatform from 'asmr/core/enums/ClientPlatform';
import ErrorCode from 'asmr/core/enums/ErrorCode';
import Logger from 'asmr/libs/common/Logger';

export interface ServiceLogOptions {
	requestHeader?: boolean;
	requestBody?: boolean;
	responseHeader?: boolean;
	responseBody?: boolean;
}

export interface ServiceOptions {
	log?: ServiceLogOptions;
	requesterTag?: string;
}

export interface ServiceParameters {
	cancelTokenSource: CancelTokenSource;
	setProgress: SetProgressInfo;
	options?: ServiceOptions;
}

export class ServiceError<TData extends ResponseModelBase = never> extends Error {
	public readonly response: TData | undefined;

	constructor(message?: string, response?: TData) {
		super(message);
		this.response = response;
	}

	public hasError(code: ErrorCode): boolean {
		return (this.response?.errors?.findIndex(error => error.code === code) ?? -1) !== -1;
	}

	public hasErrors(...codes: ErrorCode[]): boolean {
		for (const code of codes) {
			if (this.hasError(code)) {
				return true;
			}
		}

		return false;
	}

	public findErrors(...codes: ErrorCode[]): ErrorInformation[] {
		const errors: ErrorInformation[] = [];
		for (const error of this.response?.errors ?? []) {
			if (codes.findIndex(code => code === error.code) !== -1) {
				errors.push(error);
			}
		}

		return errors;
	}

	public findFirstError(code: ErrorCode): ErrorInformation | undefined {
		return this.response?.errors?.find(e => e.code === code);
	}
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

	constructor({cancelTokenSource, setProgress, options}: ServiceParameters) {
		this.options = options ?? {
			log: {
				requestHeader: false,
				requestBody: false,
				responseHeader: false,
				responseBody: false,
			},
			requesterTag: getApplicationName(),
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

	protected logRequestResponse<TData extends ResponseModelBase = never>(
		request: AxiosRequestConfig,
		response: AxiosResponse<TData>,
	) {
		const status = response.status.toString(10);
		const method = request.method?.toUpperCase();
		const url = request.url?.endsWith('/') ? request.url.substring(0, request.url.length - 1) : request.url;
		const urlSearchParams = new URLSearchParams(request.params);
		urlSearchParams.delete('clientPlatform');
		urlSearchParams.delete('clientVersion');
		const params = urlSearchParams.toString() !== '' ? `?${urlSearchParams.toString()}` : '';
		const requestedFrom = this.options?.requesterTag ? `${this.options.requesterTag} → ` : '';
		let message = `[${status}] ${method} ${url}${params}`;
		if (!response?.data?.isSuccess && response?.data?.errors) {
			for (const error of response.data.errors ?? []) {
				message += `\n\t• [${error.code} ${ErrorCode[error.code]}] ${error.reason}`;
			}
		}
		Logger.info(`${requestedFrom}${this.tag}`, message);

		if (this.options?.log?.requestHeader === true) {
			Logger.info(this.tag, request.headers);
		}
		if (this.options?.log?.requestBody === true && request.data) {
			Logger.info(this.tag, `Request: ${request.data}`);
		}
		if (this.options?.log?.responseHeader === true) {
			Logger.info(this.tag, response.headers);
		}
		if (this.options?.log?.responseBody === true && response.data) {
			Logger.info(this.tag, `Response: ${JSON.stringify(response.data)}`);
		}
	}

	protected logError<TData extends ResponseModelBase = never>(error: AxiosError<TData>) {
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

	protected onRequestRejected<TData extends ResponseModelBase = never>(error: AxiosError<TData>) {
		this.logError<TData>(error);
		return Promise.reject(new ServiceError(error.message));
	}

	protected async onResponseFulfilled<TData extends ResponseModelBase = never>(response: AxiosResponse<TData>) {
		const setCookieHeaders = response.headers['set-cookie'];
		if (setCookieHeaders) {
			let setCookieHeaderString = '';
			if (Array.isArray(setCookieHeaders)) {
				for (const setCookieHeader of setCookieHeaders) {
					setCookieHeaderString += setCookieHeader;
				}
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

		this.logRequestResponse<TData>(response.config, response);
		this.setProgress(true, 0.75);
		return response;
	}

	protected onResponseRejected<TData extends ResponseModelBase = never>(error: AxiosError<TData>) {
		this.logError<TData>(error);
		this.setProgress(true, 0.75);
		return Promise.reject(new ServiceError(error.message, error.response?.data));
	}

	protected prepare() {
		this.setProgress(true, 0);
	}

	protected extract<TData extends ResponseModelBase = never>({data: result}: AxiosResponse<TData>): TData {
		this.setProgress(true, 1);
		if (!result.isSuccess) {
			if (result.errors && Array.isArray(result.errors)) {
				result.errors = result.errors.reverse();
			}

			throw new ServiceError(result.message, result);
		}

		return result;
	}

	protected finalize() {
		this.setProgress(false, 0);
	}
}

export default ServiceBase;
