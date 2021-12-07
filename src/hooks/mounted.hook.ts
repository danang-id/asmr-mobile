import {useEffect, useRef} from 'react';
import useLogger from 'asmr/hooks/logger.hook';

// eslint-disable-next-line @typescript-eslint/ban-types
function useMounted(tag?: Function | string | undefined) {
	if (tag) {
		tag = typeof tag === 'string' ? tag : tag.name;
	}

	const logger = useLogger('MountedHook');
	const mountedRef = useRef<boolean>(true);

	useEffect(() => {
		if (tag) {
			logger.info('Mounted:', tag);
		}

		return () => {
			mountedRef.current = false;

			if (tag) {
				logger.info('Unmounted:', tag);
			}
		};
	}, []);

	return mountedRef.current;
}

export default useMounted;
