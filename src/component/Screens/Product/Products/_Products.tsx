import { memo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import FilterPills from '../../../../component/molecules/FilterPills/FilterPills';
import { LayoutIcon, Pagination } from '../../../molecules';

import BookGrid from '../../../../component/organisms/BookGrid/BookGrid';

import { SEARCH_NAME, TEXTS } from '../../../../constants';

import { type TViewType } from '~/Types/Components';
import { useStoreZ } from '../../../../hooks';

import styles from './_Products.module.css';

const ALL_FILTER = 'all';

const normalizeLayout = (raw: string | null, fallback: TViewType): TViewType =>
    raw === 'list' || raw === 'grid' ? raw : fallback;

const normalizePage = (raw: string | null): number => {
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : 1;
};

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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
    } = useStoreZ();

    const layout = normalizeLayout(searchParams.get(SEARCH_NAME.VIEW), viewType);
    const page = normalizePage(searchParams.get(SEARCH_NAME.PAGE));
    const searchContent = searchParams.get(SEARCH_NAME.CONTENT) ?? '';
    const activeFilter = searchParams.get(SEARCH_NAME.STATUS) ?? ALL_FILTER;

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

    const count = Math.ceil(products.count / pageLimit) || 0;

    useEffect(() => {
        if (!searchParams.get(SEARCH_NAME.VIEW)) {
            updateParams((p) => p.set(SEARCH_NAME.VIEW, layout), { replace: true });
        }
    }, []);

    // The status filters are data: the list comes from the API, not the client
    useEffect(() => {
        fetchAllProductStates();
    }, [fetchAllProductStates]);

    const filterOptions = isAuthenticated
        ? [
              { value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL },
              ...productStates.map((s) => ({
                  value: String(s.id),
                  label: s.stateName,
              })),
          ]
        : [{ value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL }];

    const statusId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;

    useEffect(() => {
        fetchProducts({ page, limit: pageLimit, searchContent, statusId });
    }, [fetchProducts, page, pageLimit, searchContent, statusId]);

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

    const handleSearch = useCallback(
        (value: string) => {
            updateParams(
                (p) => {
                    if (value) {
                        p.set(SEARCH_NAME.CONTENT, value);
                    } else {
                        p.delete(SEARCH_NAME.CONTENT);
                    }
                    p.delete(SEARCH_NAME.PAGE);
                },
                { replace: true },
            );
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

    const handleStatusChange = useCallback(
        (productId: number, newStatusId: number) => {
            const activeFilterId = isAuthenticated && activeFilter !== ALL_FILTER ? Number(activeFilter) : null;
            addingProductState(String(productId), String(newStatusId), activeFilterId);
        },
        [addingProductState, isAuthenticated, activeFilter],
    );

    return (
        <section className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.header__title}>{TEXTS.CATALOG_TITLE}</h1>
                <p className={styles.header__sub}>{TEXTS.CATALOG_SUBTITLE}</p>
            </header>

            <div className={`flex-align ${styles.searchRow}`}>
                <div className={styles.searchBox}>
                    <span className={styles.searchBox__icon} aria-hidden="true">
                        ⌕
                    </span>
                    <input
                        className={styles.searchBox__input}
                        type="text"
                        placeholder={TEXTS.CATALOG_SEARCH_PLACEHOLDER}
                        value={searchContent}
                        onChange={(e) => handleSearch(e.target.value)}
                        aria-label={TEXTS.CATALOG_SEARCH_PLACEHOLDER}
                    />
                </div>
                <LayoutIcon typeView={layout} onChange={handleLayoutChange} />
            </div>

            <FilterPills
                options={filterOptions}
                activeValue={activeFilter}
                onSelect={handleFilterChange}
                className={styles.filters}
            />

            {isLoadingProducts ? (
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

            <Pagination count={count} page={page} onSubmit={handlePageChange} />
        </section>
    );
};

export default memo(Products);
