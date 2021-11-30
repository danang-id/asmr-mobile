import EntityBase from 'asmr/core/common/EntityBase';
import BeanInventory from 'asmr/core/entities/BeanInventory';

interface Bean extends EntityBase {
	name: string;
	description: string;
	image: string;
	inventory: BeanInventory;
}

export default Bean;
