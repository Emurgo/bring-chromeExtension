import { useCallback, useEffect, useRef } from 'react';

type UseTimeoutProps = {
    callback: () => void;
    delay: number;
};

/**
 * Custom hook that executes a callback after a specified delay
 * @param callback Function to be executed after the delay
 * @param delay Time in milliseconds to wait before executing the callback
 * @returns Object containing start and clear functions to control the timeout
 */
const useTimeout = ({ callback, delay }: UseTimeoutProps) => {
    // Use ref to store the callback to prevent unnecessary re-renders
    const callbackRef = useRef(callback);
    // Store timeout ID to clear it when needed
    const timeoutRef = useRef<NodeJS.Timeout>();

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Start the timeout
    const start = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callbackRef.current();
        }, delay);
    }, [delay]);

    // Clear the timeout
    const clear = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return { start, clear };
};

export default useTimeout;