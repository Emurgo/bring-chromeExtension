import { useState, useCallback, useEffect } from 'react';

interface SearchParamsResult {
    getParam: (key: string) => string | null;
    setParam: (key: string, value: string) => void;
    deleteParam: (key: string) => void;
    getAllParams: () => URLSearchParams;
}

export function useSearchParams(): SearchParamsResult {
    const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));

    useEffect(() => {
        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const getParam = useCallback((key: string): string | null => {
        return searchParams.get(key);
    }, [searchParams]);

    const setParam = useCallback((key: string, value: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, value);
        setSearchParams(newSearchParams);
        window.history.pushState(null, '', `?${newSearchParams.toString()}`);
    }, [searchParams]);

    const deleteParam = useCallback((key: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(key);
        setSearchParams(newSearchParams);
        window.history.pushState(null, '', `?${newSearchParams.toString()}`);
    }, [searchParams]);

    const getAllParams = useCallback((): URLSearchParams => {
        return new URLSearchParams(searchParams);
    }, [searchParams]);

    return { getParam, setParam, deleteParam, getAllParams };
}