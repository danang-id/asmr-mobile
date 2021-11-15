import EntityBase from '../common/EntityBase';

export default class RoastedBeanProduction extends EntityBase {
	beanId: string;
	userId: string;
	greenBeanWeight: number;
	roastedBeanWeight: number;
	isCancelled: boolean;
	isFinalized: boolean;
}
