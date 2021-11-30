import ResponseModelBase from 'asmr/core/common/ResponseModelBase';
import UserWithToken from 'asmr/core/entities/UserWithToken';

type AuthenticationResponseModel = ResponseModelBase<UserWithToken>;

export default AuthenticationResponseModel;
