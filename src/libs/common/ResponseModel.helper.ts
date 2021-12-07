import ErrorInformation from 'asmr/core/common/ErrorInformation';
import ResponseModelBase from 'asmr/core/common/ResponseModelBase';
import ErrorCode from 'asmr/core/enums/ErrorCode';

export function hasError<Response extends ResponseModelBase = never>(
	response: Response | undefined,
	code: ErrorCode,
): boolean {
	return (response?.errors?.findIndex(error => error.code === code) ?? -1) !== -1;
}

export function hasErrors<Response extends ResponseModelBase = never>(
	response: Response | undefined,
	...codes: ErrorCode[]
): boolean {
	for (const code of codes) {
		if (hasError(response, code)) {
			return true;
		}
	}

	return false;
}

export function findErrors<Response extends ResponseModelBase = never>(
	response: Response | undefined,
	...codes: ErrorCode[]
): ErrorInformation[] {
	const errors: ErrorInformation[] = [];
	for (const error of response?.errors ?? []) {
		if (codes.findIndex(code => code === error.code) !== -1) {
			errors.push(error);
		}
	}

	return errors;
}

export function findFirstError<Response extends ResponseModelBase = never>(
	response: Response | undefined,
	code: ErrorCode,
): ErrorInformation | undefined {
	return response?.errors?.find(e => e.code === code);
}
