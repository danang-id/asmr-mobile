import EntityBase from '../../core/common/EntityBase';

function parseEntity<T: EntityBase>(data: T): T {
	const clone: EntityBase = {...data};
	clone.createdAt = new Date(Date.parse(clone.createdAt));
	if (clone.lastUpdatedAt) {
		clone.lastUpdatedAt = new Date(Date.parse(clone.lastUpdatedAt));
	}
	return clone;
}

export default parseEntity;
