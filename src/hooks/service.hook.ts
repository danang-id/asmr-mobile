import useProgress from 'asmr/hooks/progress.hook';
import createServices from 'asmr/services';

// eslint-disable-next-line @typescript-eslint/ban-types
function useServices(tag: Function | string) {
	const {setProgress} = useProgress();

	return createServices(setProgress, typeof tag === 'string' ? tag : tag.name);
}

export default useServices;
