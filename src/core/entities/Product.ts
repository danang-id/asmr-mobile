import EntityBase from 'asmr/core/common/EntityBase';

interface Product extends EntityBase {
	beanId: string;
	currentInventoryQuantity: number;
	price: number;
	weightPerPackaging: number;
}
export default Product;
