import EntityBase from 'asmr/core/common/EntityBase';
import PackagingResult from 'asmr/core/entities/PackagingResult';

interface Packaging extends EntityBase {
	beanId: string;
	userId: string;
	results: PackagingResult[];
}

export default Packaging;
