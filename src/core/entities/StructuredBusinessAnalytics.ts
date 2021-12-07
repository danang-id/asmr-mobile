interface StructuredBusinessAnalytics {
	incomingGreenBean: {
		total?: number;
		weightTotal?: number;
		weightAverage?: number;
		lastTime?: Date;
	};
	roasting: {
		total?: number;
		greenBean: {
			weightTotal?: number;
			weightAverage?: number;
		};
		roastedBean: {
			weightTotal?: number;
			weightAverage?: number;
		};
		depreciation: {
			weightTotal?: number;
			weightAverage?: number;
			rate?: number;
			averageRate?: number;
		};
		finished: {
			total?: number;
			totalRate?: number;
		};
		cancelled: {
			total?: number;
			totalRate?: number;
		};
		cancellationReason: {
			notCancelled: {
				total?: number;
				rate?: number;
			};
			wrongRoastingDataSubmitted: {
				total?: number;
				rate?: number;
			};
			roastingTimeout: {
				total?: number;
				rate?: number;
			};
			roastingFailure: {
				total?: number;
				rate?: number;
			};
		};
	};
	packaging: {
		total?: number;
		roastedBeanRemainder: {
			weightAverage?: number;
		};
		absorptionRate?: number;
	};
	productPackaged: {
		total?: number;
		average?: number;
	};
}

export default StructuredBusinessAnalytics;
