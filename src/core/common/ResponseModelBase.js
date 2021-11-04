import ErrorInformation from './ErrorInformation';

export default class ResponseModelBase<T = any> {
	isSuccess: boolean;
	message: string | undefined;
	errors: ErrorInformation[] | undefined;
	data: T | undefined;
}
