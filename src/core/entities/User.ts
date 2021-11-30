import EntityBase from 'asmr/core/common/EntityBase';
import UserRole from 'asmr/core/entities/UserRole';

interface User extends EntityBase {
	firstName: string;
	lastName: string;
	emailAddress: string;
	username: string;
	image: string;
	isEmailConfirmed: boolean;
	isApproved: boolean;
	isWaitingForApproval: boolean;
	roles: UserRole[];
}

export default User;
