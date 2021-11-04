export type ProgressInfo = {
	loading: boolean,
	percentage: number,
};
export type SetProgressInfo = (loading: boolean, percentage?: number) => void;

export type ProgressContextInfo = [ProgressInfo, SetProgressInfo];
