import EntityBase from '../common/EntityBase';
import UserRole from './UserRole';

export default class User extends EntityBase {
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
