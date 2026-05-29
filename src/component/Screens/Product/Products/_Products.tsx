import { memo, useCallback, useEffect, useRef } from 'react';
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

    const pageCount = Math.ceil(products.count / pageLimit) || 0;
    // Stop at the last real page. Counting loaded pages against the authoritative total is dedupe-proof
    // (rows.length drifts below count when a row is deduped) and never walks onto an empty page past the end.
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

    // The URL page is the source of truth in both modes. Paginated mode fetches that page directly.
    // Infinite mode treats the page as a depth marker: a fresh query (search/status/mode change, or a
    // shared link) loads every page up to it so the list matches the URL, while scrolling further
    // appends the next page and bumps the URL so the position can be shared and restored.
    useEffect(() => {
        const queryChanged = lastQueryKeyRef.current !== queryKey;
        lastQueryKeyRef.current = queryKey;

        if (!isInfinite) {
            fetchProducts({ page: urlPage, limit: pageLimit, searchContent, statusId, append: false });
            return;
        }

        if (queryChanged) {
            loadedThroughRef.current = urlPage;
            pendingScrollPageRef.current = urlPage > 1 ? urlPage : null;
            // The prefix can span more rows than one request may return, so let the store stitch it
            // together from cap-respecting chunks instead of asking for pageLimit * urlPage at once.
            fetchProductsThrough({ throughPage: urlPage, limit: pageLimit, searchContent, statusId });
        } else if (urlPage > loadedThroughRef.current && (pageCount === 0 || urlPage <= pageCount)) {
            loadedThroughRef.current = urlPage;
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

    // Once a deep infinite load resolves, jump to the first item of the requested page so switching
    // from pagination — or opening a shared link — lands the reader where that page begins.
    useEffect(() => {
        // Fire only on the loading -> idle transition, i.e. once the 1..targetPage deep fetch has
        // actually resolved. Switching from pagination keeps the previous page's rows mounted while
        // that fetch is in flight, and the store flips isLoadingProducts only on the next render — so
        // without this guard the effect runs in the same commit as the dispatch, reads the stale
        // (still-false) loading flag, consumes the pending page and scrolls into the carried-over rows,
        // leaving nothing to restore when the real rows arrive. The deep fetch always toggles loading,
        // so keying off the transition is reliable even when the API caps the page size.
        const justFinishedLoading = wasLoadingRef.current && !isLoadingProducts;
        wasLoadingRef.current = isLoadingProducts;

        const targetPage = pendingScrollPageRef.current;
        if (!isInfinite || !targetPage || !justFinishedLoading || products.rows.length === 0) return;

        pendingScrollPageRef.current = null;
        const grid = gridRef.current?.firstElementChild;
        const index = Math.min((targetPage - 1) * pageLimit, products.rows.length - 1);
        const target = grid?.children?.[index] as HTMLElement | undefined;
        // Defer one frame so the just-committed rows are laid out. No cleanup-bound cancel here:
        // book cards have a fixed cover height, so a single jump lands accurately, and a React-cleanup
        // cancel would abort this in StrictMode's setup -> cleanup -> setup cycle and never restore.
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
                    {isHome ? <BrowseModeToggle mode={mode} onChange={handleModeChange} /> : null}
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
