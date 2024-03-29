import { useEffect, useRef, useMemo } from 'react';
import throttle from 'lodash/throttle';

type Callback = () => void;

export const useThrottle = (callback: Callback): Callback => {
    const ref = useRef<Callback | null>(null);

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const throttleCallback = useMemo<Callback>(() => {
        const func = () => {
            if(ref.current) {
                ref.current();
            }
        };

        return throttle(func, 2000);
    }, []);

    return throttleCallback;
};