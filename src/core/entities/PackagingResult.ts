import EntityBase from 'asmr/core/common/EntityBase';
import Product from 'asmr/core/entities/Product';

interface PackagingResult extends EntityBase {
	product: Product;
	quantity: number;
}

export default PackagingResult;
