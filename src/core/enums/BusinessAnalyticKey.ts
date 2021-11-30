enum BusinessAnalyticKey {
	// How many times green bean restocked
	// Ref.: Bean, User
	IncomingGreenBeanTotal,

	// Total weight of incoming green bean
	// Ref.: Bean, User
	IncomingGreenBeanWeightTotal,

	// Average weight of green bean everytime it restocked
	// => IncomingBeanWeightTotal / IncomingBeanTotal
	// Ref.: Bean, User
	IncomingGreenBeanWeightAverage,

	// The last time green bean was restocked
	// Ref.: Bean, User
	IncomingGreenBeanLastTime,

	// How many times roasting have been done
	// Ref.: Bean, User
	RoastingTotal,

	// Total weight of green bean used
	// Ref.: Bean, User
	RoastingGreenBeanWeightTotal,

	// Average weight of green bean used everytime it roasting
	// => RoastingGreenBeanWeightTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingGreenBeanWeightAverage,

	// Total weight of roasted bean produced
	// Ref.: Bean, User
	RoastingRoastedBeanWeightTotal,

	// Average weight of roasted bean produced everytime it roasting
	// => RoastingRoastedBeanWeightTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingRoastedBeanWeightAverage,

	// Total bean weight loss by roasting process
	// => RoastingGreenBeanWeightTotal - RoastingRoastedBeanWeightTotal
	// Ref.: Bean, User
	RoastingDepreciationWeightTotal,

	// Average bean weight loss by roasting process everytime it roasting
	// => RoastingDepreciationWeightTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingDepreciationWeightAverage,

	// Rate of total bean weight loss by roasting process
	// => (RoastingGreenBeanWeightTotal - RoastingRoastedBeanWeightTotal) / RoastingGreenBeanWeightTotal
	// Ref.: Bean, User
	RoastingDepreciationRate,

	// Rate of average bean weight loss by roasting process everytime it roasting
	// => RoastingDepreciationRateTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingDepreciationAverageRate,

	// Total roasting session finished
	// Ref.: Bean, User
	RoastingFinishedTotal,

	// Rate of total roasting session finished
	// => RoastingFinishedTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingFinishedTotalRate,

	// Total roasting session cancelled
	// Ref.: Bean, User
	RoastingCancelledTotal,

	// Rate of total roasting session cancelled
	// => RoastingCancelledTotal / RoastingTotal
	// Ref.: Bean, User
	RoastingCancelledTotalRate,

	// Total a specific reason was being used for cancelling roasting
	// Ref.: Bean, User
	// Alt. Ref.: RoastingCancellationReason
	RoastingCancellationReasonTotal,

	// Rate of total a specific reason was being used for cancelling roasting
	// => RoastingCancellationReasonTotal / RoastingCancelledTotal
	// Ref.: Bean, User
	// Alt. Ref.: RoastingCancellationReason
	RoastingCancellationReasonRate,

	// Total packaging done
	// Ref.: Bean, User
	PackagingTotal,

	// Average roasted bean remainder every packaging
	// => PackagingRoastedBeanRemainderTotal / PackagingTotal
	// Ref.: Bean, User
	PackagingRoastedBeanRemainderWeightAverage,

	// Average rate of absorption every packaging
	// => Custom logic shall be implemented
	// Ref.: Bean, User
	PackagingAbsorptionRate,

	// Total product packaged
	// Ref.: Bean, User
	ProductPackagedTotal,

	// Average product packaged every packaging
	// => ProductPackagedTotal / PackagingTotal
	// Ref.: Bean, User
	ProductPackagedAverage,
}

export default BusinessAnalyticKey;
