import BusinessAnalytic from 'asmr/core/entities/BusinessAnalytic';
import StructuredBusinessAnalytics from 'asmr/core/entities/StructuredBusinessAnalytics';
import BusinessAnalyticKey from 'asmr/core/enums/BusinessAnalyticKey';
import BusinessAnalyticReference from 'asmr/core/enums/BusinessAnalyticReference';

export function createStructuredBusinessAnalytics(analytics: BusinessAnalytic[]): StructuredBusinessAnalytics {
	function getAnalytic(key: BusinessAnalyticKey, altRefValue = '') {
		return analytics.find(
			analytic =>
				analytic.key === key &&
				analytic.alternateReference ===
					(!altRefValue
						? BusinessAnalyticReference.NoReference
						: BusinessAnalyticReference.RoastingCancellationReason) &&
				analytic.alternateReferenceValue === altRefValue,
		);
	}

	const incomingTotal = getAnalytic(BusinessAnalyticKey.IncomingGreenBeanTotal);
	const incomingWeightTotal = getAnalytic(BusinessAnalyticKey.IncomingGreenBeanWeightTotal);
	const incomingWeightAverage = getAnalytic(BusinessAnalyticKey.IncomingGreenBeanWeightAverage);
	const incomingLastTime = getAnalytic(BusinessAnalyticKey.IncomingGreenBeanLastTime);

	const roastingTotal = getAnalytic(BusinessAnalyticKey.RoastingTotal);
	const roastingGreenBeanWeightTotal = getAnalytic(BusinessAnalyticKey.RoastingGreenBeanWeightTotal);
	const roastingGreenBeanWeightAverage = getAnalytic(BusinessAnalyticKey.RoastingGreenBeanWeightAverage);
	const roastingRoastedBeanWeightTotal = getAnalytic(BusinessAnalyticKey.RoastingRoastedBeanWeightTotal);
	const roastingRoastedBeanWeightAverage = getAnalytic(BusinessAnalyticKey.RoastingRoastedBeanWeightAverage);
	const roastingDepreciationWeightTotal = getAnalytic(BusinessAnalyticKey.RoastingDepreciationWeightTotal);
	const roastingDepreciationWeightAverage = getAnalytic(BusinessAnalyticKey.RoastingDepreciationWeightAverage);
	const roastingDepreciationRate = getAnalytic(BusinessAnalyticKey.RoastingDepreciationRate);
	const roastingDepreciationAverageRate = getAnalytic(BusinessAnalyticKey.RoastingDepreciationAverageRate);
	const roastingFinishedTotal = getAnalytic(BusinessAnalyticKey.RoastingFinishedTotal);
	const roastingFinishedTotalRate = getAnalytic(BusinessAnalyticKey.RoastingFinishedTotalRate);
	const roastingCancelledTotal = getAnalytic(BusinessAnalyticKey.RoastingCancelledTotal);
	const roastingCancelledTotalRate = getAnalytic(BusinessAnalyticKey.RoastingCancelledTotalRate);
	const roastingCancellationReason0Total = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonTotal, '0');
	const roastingCancellationReason0Rate = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonRate, '0');
	const roastingCancellationReason1Total = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonTotal, '1');
	const roastingCancellationReason1Rate = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonRate, '1');
	const roastingCancellationReason2Total = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonTotal, '2');
	const roastingCancellationReason2Rate = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonRate, '2');
	const roastingCancellationReason3Total = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonTotal, '3');
	const roastingCancellationReason3Rate = getAnalytic(BusinessAnalyticKey.RoastingCancellationReasonRate, '3');

	const packagingTotal = getAnalytic(BusinessAnalyticKey.PackagingTotal);
	const packagingRoastedBeanRemainderWeightAverage = getAnalytic(
		BusinessAnalyticKey.PackagingRoastedBeanRemainderWeightAverage,
	);
	const packagingAbsorptionRate = getAnalytic(BusinessAnalyticKey.PackagingAbsorptionRate);

	const productPackagedTotal = getAnalytic(BusinessAnalyticKey.ProductPackagedTotal);
	const productPackagedAverage = getAnalytic(BusinessAnalyticKey.ProductPackagedAverage);

	return {
		incomingGreenBean: {
			total: incomingTotal?.intValue,
			weightTotal: incomingWeightTotal?.decimalValue,
			weightAverage: incomingWeightAverage?.decimalValue,
			lastTime: incomingLastTime?.dateTimeValue ? new Date(incomingLastTime.dateTimeValue) : undefined,
		},
		roasting: {
			total: roastingTotal?.intValue,
			greenBean: {
				weightTotal: roastingGreenBeanWeightTotal?.decimalValue,
				weightAverage: roastingGreenBeanWeightAverage?.decimalValue,
			},
			roastedBean: {
				weightTotal: roastingRoastedBeanWeightTotal?.decimalValue,
				weightAverage: roastingRoastedBeanWeightAverage?.decimalValue,
			},
			depreciation: {
				weightTotal: roastingDepreciationWeightTotal?.decimalValue,
				weightAverage: roastingDepreciationWeightAverage?.decimalValue,
				rate: roastingDepreciationRate?.decimalValue,
				averageRate: roastingDepreciationAverageRate?.decimalValue,
			},
			finished: {
				total: roastingFinishedTotal?.intValue,
				totalRate: roastingFinishedTotalRate?.decimalValue,
			},
			cancelled: {
				total: roastingCancelledTotal?.intValue,
				totalRate: roastingCancelledTotalRate?.decimalValue,
			},
			cancellationReason: {
				notCancelled: {
					total: roastingCancellationReason0Total?.intValue,
					rate: roastingCancellationReason0Rate?.decimalValue,
				},
				wrongRoastingDataSubmitted: {
					total: roastingCancellationReason1Total?.intValue,
					rate: roastingCancellationReason1Rate?.decimalValue,
				},
				roastingTimeout: {
					total: roastingCancellationReason2Total?.intValue,
					rate: roastingCancellationReason2Rate?.decimalValue,
				},
				roastingFailure: {
					total: roastingCancellationReason3Total?.intValue,
					rate: roastingCancellationReason3Rate?.decimalValue,
				},
			},
		},
		packaging: {
			total: packagingTotal?.intValue,
			roastedBeanRemainder: {
				weightAverage: packagingRoastedBeanRemainderWeightAverage?.decimalValue,
			},
			absorptionRate: packagingAbsorptionRate?.decimalValue,
		},
		productPackaged: {
			total: productPackagedTotal?.intValue,
			average: productPackagedAverage?.decimalValue,
		},
	};
}
