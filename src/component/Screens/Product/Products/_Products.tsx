import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { BrowseModeToggle, FilterPills, LayoutIcon, Pagination } from '~/component/molecules';

import { BookGrid } from '~/component/organisms';

import { SEARCH_NAME, TEXTS } from '~/constants';

import { useInfiniteScroll, useStoreZ } from '~/hooks';
import { EBrowseMode, type TViewType } from '~/Types/Components';

import styles from './_Products.module.css';

const ALL_FILTER = 'all';
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar']);

const normalizeLayout = (raw: string | null, fallback: TViewType): TViewType =>
    raw === 'list' || raw === 'grid' ? raw : fallback;

const normalizeMode = (raw: string | null, fallback: EBrowseMode): EBrowseMode =>
    raw === EBrowseMode.INFINITE || raw === EBrowseMode.PAGED ? (raw as EBrowseMode) : fallback;

const normalizePage = (raw: string | null): number => {
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : 1;
};

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        products,
        fetchProducts,
        fetchProductsThrough,
        pageLimit,
        isLoadingProducts,
        isAuthenticated,
        addingProductState,
        productStates,
        fetchAllProductStates,
        viewType,
        setViewType,
        browseMode,
        setBrowseMode,
    } = useStoreZ();

    const lastQueryKeyRef = useRef<string | null>(null);
    const loadedThroughRef = useRef(0);
    const pendingScrollPageRef = useRef<number | null>(null);
    const wasLoadingRef = useRef(false);
    const gridRef = useRef<HTMLDivElement | null>(null);

    // A deep jump (switching from pagination or opening a shared deep link) scrolls programmatically to
    // the target page, which can drag the sentinel into view and auto-fetch the next page before the
    // reader has scrolled at all. Disarm the loader for that navigation and re-arm on the first genuine
    // scroll input, so paging resumes only when the reader actually moves.
    const [loaderArmed, setLoaderArmed] = useState(true);

    const layout = normalizeLayout(searchParams.get(SEARCH_NAME.VIEW), viewType);
    const urlPage = normalizePage(searchParams.get(SEARCH_NAME.PAGE));
    const searchContent = searchParams.get(SEARCH_NAME.CONTENT) ?? '';
    const activeFilter = searchParams.get(SEARCH_NAME.STATUS) ?? ALL_FILTER;

    const mode = normalizeMode(searchParams.get(SEARCH_NAME.MODE), browseMode);
    const isInfinite = mode === EBrowseMode.INFINITE;

    const statusId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;
    const queryKey = `${searchContent}|${statusId}|${isInfinite}`;

    const pageCount = Math.ceil(products.count / pageLimit) || 0;
    const hasMore = isInfinite && pageCount > 0 && loadedThroughRef.current < pageCount;

    const isInitialLoad = isLoadingProducts && products.rows.length === 0;
    const showGridLoader = isInfinite ? isInitialLoad : isLoadingProducts;
    const isLoadingMore = isInfinite && isLoadingProducts && products.rows.length > 0;

    const updateParams = useCallback(
        (mutate: (params: URLSearchParams) => void, options?: { replace?: boolean }) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                mutate(next);
                return next;
            }, options);
        },
        [setSearchParams],
    );

    const handleLayoutChange = useCallback(
        (next: TViewType) => {
            setViewType(next);
            updateParams((p) => p.set(SEARCH_NAME.VIEW, next));
        },
        [updateParams, setViewType],
    );

    const handleModeChange = useCallback(
        (next: EBrowseMode) => {
            setBrowseMode(next);
            updateParams((p) => p.set(SEARCH_NAME.MODE, next));
        },
        [updateParams, setBrowseMode],
    );

    const handleFilterChange = useCallback(
        (value: string) => {
            updateParams((p) => {
                if (value === ALL_FILTER) {
                    p.delete(SEARCH_NAME.STATUS);
                } else {
                    p.set(SEARCH_NAME.STATUS, value);
                }
                p.delete(SEARCH_NAME.PAGE); // a new filter resets to the first page
            });
        },
        [updateParams],
    );

    const handlePageChange = useCallback(
        (next: number) => {
            updateParams((p) => {
                if (next <= 1) {
                    p.delete(SEARCH_NAME.PAGE);
                } else {
                    p.set(SEARCH_NAME.PAGE, String(next));
                }
            });
        },
        [updateParams],
    );

    const handleLoadMore = useCallback(() => {
        updateParams((p) => p.set(SEARCH_NAME.PAGE, String(urlPage + 1)), { replace: true });
    }, [updateParams, urlPage]);

    const handleStatusChange = useCallback(
        (productId: number, newStatusId: number) => {
            const activeFilterId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;
            addingProductState(String(productId), String(newStatusId), activeFilterId);
        },
        [addingProductState, isAuthenticated, activeFilter],
    );

    const sentinelRef = useInfiniteScroll({
        hasMore: hasMore && loaderArmed,
        isLoading: isLoadingProducts,
        onLoadMore: handleLoadMore,
    });

    useEffect(() => {
        if (loaderArmed) return;
        const arm = () => setLoaderArmed(true);
        const armOnKey = (e: KeyboardEvent) => {
            if (SCROLL_KEYS.has(e.key)) arm();
        };
        window.addEventListener('wheel', arm, { passive: true, once: true });
        window.addEventListener('touchmove', arm, { passive: true, once: true });
        window.addEventListener('keydown', armOnKey);
        return () => {
            window.removeEventListener('wheel', arm);
            window.removeEventListener('touchmove', arm);
            window.removeEventListener('keydown', armOnKey);
        };
    }, [loaderArmed]);

    useEffect(() => {
        const needsView = !searchParams.get(SEARCH_NAME.VIEW);
        const needsMode =
            !searchParams.get(SEARCH_NAME.MODE) && (mode === EBrowseMode.INFINITE || mode === EBrowseMode.PAGED);
        if (needsView || needsMode) {
            updateParams(
                (p) => {
                    if (needsView) p.set(SEARCH_NAME.VIEW, layout);
                    if (needsMode) p.set(SEARCH_NAME.MODE, mode);
                },
                { replace: true },
            );
        }
    }, []);

    useEffect(() => {
        fetchAllProductStates();
    }, [fetchAllProductStates]);

    useEffect(() => {
        const queryChanged = lastQueryKeyRef.current !== queryKey;
        lastQueryKeyRef.current = queryKey;

        if (!isInfinite) {
            fetchProducts({ page: urlPage, limit: pageLimit, searchContent, statusId, append: false });
            return;
        }
        loadedThroughRef.current = urlPage;
        if (queryChanged) {
            const willJump = urlPage > 1;
            pendingScrollPageRef.current = willJump ? urlPage : null;
            setLoaderArmed(!willJump);
            fetchProductsThrough({ throughPage: urlPage, limit: pageLimit, searchContent, statusId });
        } else if (urlPage > loadedThroughRef.current && (pageCount === 0 || urlPage <= pageCount)) {
            fetchProducts({ page: urlPage, limit: pageLimit, searchContent, statusId, append: true });
        }
    }, [
        fetchProducts,
        fetchProductsThrough,
        queryKey,
        isInfinite,
        urlPage,
        pageLimit,
        searchContent,
        statusId,
        pageCount,
    ]);

    useEffect(() => {
        const justFinishedLoading = wasLoadingRef.current && !isLoadingProducts;
        wasLoadingRef.current = isLoadingProducts;

        const targetPage = pendingScrollPageRef.current;
        if (!isInfinite || !targetPage || !justFinishedLoading || products.rows.length === 0) return;

        pendingScrollPageRef.current = null;
        const grid = gridRef.current?.firstElementChild;
        const index = Math.min((targetPage - 1) * pageLimit, products.rows.length - 1);
        const target = grid?.children?.[index] as HTMLElement | undefined;
        if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }, [isInfinite, isLoadingProducts, products.rows.length, pageLimit]);

    const filterOptions = isAuthenticated
        ? [
              { value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL },
              ...productStates.map((s) => ({
                  value: String(s.id),
                  label: s.stateName,
              })),
          ]
        : [{ value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL }];

    return (
        <section className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.header__title}>{TEXTS.CATALOG_TITLE}</h1>
                <p className={styles.header__sub}>{TEXTS.CATALOG_SUBTITLE}</p>
            </header>

            <div className={`flex-between ${styles.toolbar}`}>
                <FilterPills
                    options={filterOptions}
                    activeValue={activeFilter}
                    onSelect={handleFilterChange}
                    className={styles.filters}
                />
                <div className="flex-align gap-3 flex-shrink-0">
                    <BrowseModeToggle mode={mode} onChange={handleModeChange} />
                    <LayoutIcon typeView={layout} onChange={handleLayoutChange} />
                </div>
            </div>

            {showGridLoader ? (
                <div className={styles.loading} aria-live="polite">
                    {TEXTS.COMMON_LOADING}
                </div>
            ) : (
                <div ref={gridRef}>
                    <BookGrid
                        books={products.rows}
                        isAuthenticated={isAuthenticated}
                        layout={layout}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            )}

            {isInfinite ? (
                <div className={styles.infinite}>
                    <div ref={sentinelRef} aria-hidden="true" />
                    {isLoadingMore ? (
                        <div className={styles.loading} aria-live="polite">
                            {TEXTS.COMMON_LOADING}
                        </div>
                    ) : null}
                </div>
            ) : (
                <Pagination count={pageCount} page={urlPage} onSubmit={handlePageChange} />
            )}
        </section>
    );
};

export default memo(Products);
