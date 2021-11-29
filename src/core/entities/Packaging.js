import EntityBase from '../common/EntityBase';
import PackagingResult from './PackagingResult';

export default class Packaging extends EntityBase {
	beanId: string;
	userId: string;
	results: PackagingResult[];
}
