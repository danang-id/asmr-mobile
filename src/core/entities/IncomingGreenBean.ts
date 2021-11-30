import EntityBase from 'asmr/core/common/EntityBase';

interface IncomingGreenBean extends EntityBase {
	beanId: string;
	userId: string;
	weightAdded: number;
}

export default IncomingGreenBean;
