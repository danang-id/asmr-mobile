import Role from '../../core/enums/Role';

export function getRoleString(role: number): string {
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
