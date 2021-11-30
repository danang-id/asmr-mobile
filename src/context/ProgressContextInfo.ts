export type ProgressInfo = {
	loading: boolean;
	percentage: number;
};

export type SetProgressInfo = (loading: boolean, percentage?: number) => void;

interface ProgressContextInfo {
	progress: ProgressInfo;
	setProgress: SetProgressInfo;
}

export default ProgressContextInfo;
