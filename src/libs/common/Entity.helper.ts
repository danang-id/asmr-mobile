import EntityBase from 'asmr/core/common/EntityBase';

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
