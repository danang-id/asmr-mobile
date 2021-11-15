import EntityBase from '../common/EntityBase';

export default class Product extends EntityBase {
	beanId: string;
	currentInventoryQuantity: number;
	price: number;
	weightPerPackaging: number;
}
