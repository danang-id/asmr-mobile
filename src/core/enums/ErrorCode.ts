enum ErrorCode {
	GenericServerError = 1000,

	EmailProviderUnavailable = 1100,
	EmailSendingFailure = 1101,

	GenericClientError = 2000,

	EndpointNotFound = 2100,
	RequestMethodNotAllowed = 2101,
	RequestMediaTypeNotSupported = 2102,

	RequiredParameterNotProvided = 2200,
	InvalidModelFormat = 2201,
	ModelValidationFailed = 2202,
	CaptchaResponseTokenNotProvided = 2203,
	CaptchaVerificationFailed = 2204,

	ResourceNotFound = 2300,
	ResourceEmpty = 2301,

	InvalidAntiforgeryToken = 2400,
	NotAuthenticated = 2401,
	NotAuthorized = 2402,
	AuthenticationFailed = 2403,

	EmailAddressWaitingConfirmation = 2500,
	AccountWaitingForApproval = 2501,
	AccountWasNotApproved = 2502,
}

export default ErrorCode;
