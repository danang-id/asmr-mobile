import EntityBase from '../common/EntityBase';
import Product from './Product';

export default class PackagingResult extends EntityBase {
	product: Product;
	quantity: number;
}
