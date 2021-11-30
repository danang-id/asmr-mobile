import ErrorCode from 'asmr/core/enums/ErrorCode';

interface ErrorInformation {
	code: ErrorCode;
	reason: string;
	supportId?: string;
}

export default ErrorInformation;
