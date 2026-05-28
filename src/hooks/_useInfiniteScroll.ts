import { type RefObject, useEffect, useRef } from 'react';

interface IUseInfiniteScrollParams {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}

const useInfiniteScroll = (params: IUseInfiniteScrollParams): RefObject<HTMLDivElement | null> => {
    const { hasMore, isLoading, onLoadMore } = params;

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node || !hasMore || isLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) onLoadMoreRef.current();
        });
        observer.observe(node);

        return () => observer.disconnect();
    }, [hasMore, isLoading]);

    return sentinelRef;
};

export default useInfiniteScroll;
