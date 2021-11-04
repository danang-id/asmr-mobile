import User from './User';

export default class UserWithToken extends User {
	token: string | undefined;
}
