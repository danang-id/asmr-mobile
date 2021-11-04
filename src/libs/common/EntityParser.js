import EntityBase from '../../core/common/EntityBase';

function parseEntity<T: EntityBase>(data: T): T {
	const clone: EntityBase = {...data};
	clone.createdAt = new Date(clone.createdAt);
	if (clone.lastUpdatedAt) {
		clone.lastUpdatedAt = new Date(clone.lastUpdatedAt);
	}
	return clone;
}

export default parseEntity;
