import EntityBase from 'asmr/core/common/EntityBase';
import BusinessAnalyticKey from 'asmr/core/enums/BusinessAnalyticKey';
import BusinessAnalyticReference from 'asmr/core/enums/BusinessAnalyticReference';

interface BusinessAnalytic extends EntityBase {
	key: BusinessAnalyticKey;
	reference: BusinessAnalyticReference;
	referenceValue: string;
	alternateReference: BusinessAnalyticReference;
	alternateReferenceValue: string;
	decimalValue: number;
	intValue: number;
	stringValue: string;
	dateTimeValue?: Date;
}

export default BusinessAnalytic;
