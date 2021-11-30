import User from 'asmr/core/entities/User';

interface UserWithToken extends User {
	token?: string;
}

export default UserWithToken;
