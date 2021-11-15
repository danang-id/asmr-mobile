import EntityBase from '../common/EntityBase';
import BeanInventory from './BeanInventory';
import IncomingGreenBean from './IncomingGreenBean';
import RoastedBeanProduction from './RoastedBeanProduction';

export default class Bean extends EntityBase {
	name: string;
	description: string;
	image: string;
	inventory: BeanInventory;
	incomingGreenBeans: IncomingGreenBean[];
	roastedBeanProductions: RoastedBeanProduction[];
	products;
}
