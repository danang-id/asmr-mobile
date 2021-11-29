import EntityBase from '../common/EntityBase';

export default class RoastingSession extends EntityBase {
	beanId: string;
	userId: string;
	greenBeanWeight: number;
	roastedBeanWeight: number;
	cancelledAt: Date | undefined;
	cancellationReason: number;
	finishedAt: Date | undefined;
}
