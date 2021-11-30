import EntityBase from 'asmr/core/common/EntityBase';

export function parseEntity<T extends EntityBase>(data: T): T {
	const clone: EntityBase = {...data};
	clone.createdAt = new Date(clone.createdAt);
	if (clone.lastUpdatedAt) {
		clone.lastUpdatedAt = new Date(clone.lastUpdatedAt);
	}
	return clone as T;
}

export type EntitySortingOptions = {
	order?: 'asc' | 'desc';
};

export function createEntitiesSorter<T extends EntityBase>(options?: EntitySortingOptions) {
	return (a: T, b: T) => {
		const isDescending = options?.order === 'desc';
		return (
			new Date(isDescending ? a.createdAt : b.createdAt).getTime() -
			new Date(isDescending ? b.createdAt : a.createdAt).getTime()
		);
	};
}
