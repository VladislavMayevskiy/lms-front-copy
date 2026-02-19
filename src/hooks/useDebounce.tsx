import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (callback: () => void, wait: number) => {
	const ref = useRef<() => void>(callback);

	useEffect(() => {
		ref.current = callback;
	}, [callback]);

	return useMemo(() => {
		const func = () => {
			ref.current?.();
		};

		return debounce(func, wait);
	}, []);
};
