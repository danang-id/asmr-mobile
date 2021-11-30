import Role from 'asmr/core/enums/Role';

export function getRoleString(role: Role): string {
	switch (role) {
		case Role.Administrator:
			return 'Administrator';
		case Role.Server:
			return 'Server';
		case Role.Roaster:
			return 'Roaster';
		default:
			return 'Unknown';
	}
}
