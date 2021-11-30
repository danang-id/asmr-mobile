import EntityBase from 'asmr/core/common/EntityBase';

interface BeanInventory extends EntityBase {
	currentGreenBeanWeight: number;
	currentRoastedBeanWeight: number;
}

export default BeanInventory;
