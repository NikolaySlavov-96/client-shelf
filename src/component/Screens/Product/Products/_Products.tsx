import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { BrowseModeToggle, FilterPills, LayoutIcon, Pagination } from '~/component/molecules';

import { BookGrid } from '~/component/organisms';

import { ROUT_NAMES, SEARCH_NAME, TEXTS } from '~/constants';

import { useInfiniteScroll, useStoreZ } from '~/hooks';
import { EBrowseMode, type TViewType } from '~/Types/Components';

import styles from './_Products.module.css';

const ALL_FILTER = 'all';

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
    const { pathname } = useLocation();
    const {
        products,
        fetchProducts,
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

    const [infinitePage, setInfinitePage] = useState(1);
    const lastQueryKeyRef = useRef<string | null>(null);

    const layout = normalizeLayout(searchParams.get(SEARCH_NAME.VIEW), viewType);
    const urlPage = normalizePage(searchParams.get(SEARCH_NAME.PAGE));
    const searchContent = searchParams.get(SEARCH_NAME.CONTENT) ?? '';
    const activeFilter = searchParams.get(SEARCH_NAME.STATUS) ?? ALL_FILTER;

    // Infinite scroll is the home default; other routes (e.g. /book) stay paginated.
    const isHome = pathname === ROUT_NAMES.HOME;
    const mode = isHome ? normalizeMode(searchParams.get(SEARCH_NAME.MODE), browseMode) : EBrowseMode.PAGED;
    const isInfinite = mode === EBrowseMode.INFINITE;

    const statusId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;
    const queryKey = `${searchContent}|${statusId}|${isInfinite}`;

    const page = isInfinite ? infinitePage : urlPage;
    const pageCount = Math.ceil(products.count / pageLimit) || 0;
    const hasMore = isInfinite && products.rows.length < products.count;

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

    const handleLoadMore = useCallback(() => setInfinitePage((prev) => prev + 1), []);

    const handleStatusChange = useCallback(
        (productId: number, newStatusId: number) => {
            const activeFilterId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;
            addingProductState(String(productId), String(newStatusId), activeFilterId);
        },
        [addingProductState, isAuthenticated, activeFilter],
    );

    const sentinelRef = useInfiniteScroll({ hasMore, isLoading: isLoadingProducts, onLoadMore: handleLoadMore });

    useEffect(() => {
        const needsView = !searchParams.get(SEARCH_NAME.VIEW);
        const needsMode =
            isHome &&
            !searchParams.get(SEARCH_NAME.MODE) &&
            (mode === EBrowseMode.INFINITE || mode === EBrowseMode.PAGED);
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

    // The status filters are data: the list comes from the API, not the client
    useEffect(() => {
        fetchAllProductStates();
    }, [fetchAllProductStates]);

    // A changed query (search, status or mode) restarts the infinite list at page 1 before any
    // fetch fires, so a freshly chosen filter never appends onto the previous result set.
    useEffect(() => {
        const queryChanged = lastQueryKeyRef.current !== queryKey;
        lastQueryKeyRef.current = queryKey;

        if (isInfinite && queryChanged && infinitePage !== 1) {
            setInfinitePage(1);
            return;
        }

        const append = isInfinite && page > 1;
        fetchProducts({ page, limit: pageLimit, searchContent, statusId, append });
    }, [fetchProducts, queryKey, isInfinite, page, infinitePage, pageLimit, searchContent, statusId]);

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
                    {isHome ? <BrowseModeToggle mode={mode} onChange={handleModeChange} /> : null}
                    <LayoutIcon typeView={layout} onChange={handleLayoutChange} />
                </div>
            </div>

            {showGridLoader ? (
                <div className={styles.loading} aria-live="polite">
                    {TEXTS.COMMON_LOADING}
                </div>
            ) : (
                <BookGrid
                    books={products.rows}
                    isAuthenticated={isAuthenticated}
                    layout={layout}
                    onStatusChange={handleStatusChange}
                />
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
