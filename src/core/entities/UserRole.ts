import EntityBase from 'asmr/core/common/EntityBase';
import Role from 'asmr/core/enums/Role';

interface UserRole extends EntityBase {
	role: Role;
}

export default UserRole;
