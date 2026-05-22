import { memo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import FilterPills from "../../../../component/molecules/FilterPills/FilterPills";
import BookGrid from "../../../../component/organisms/BookGrid/BookGrid";
import { Pagination, LayoutIcon } from "../../../molecules";

import { useStoreZ } from "../../../../hooks";
import { TEXTS, STORAGE_KEYS, SEARCH_NAME } from "../../../../constants";
import { getDataFromStorage } from "../../../../Helpers/_Storage";
import { TViewType } from "~/Types/Components";

import styles from "./_Products.module.css";

// statusId 0 / 'all' is the synthetic "All" filter; the rest come from the API
const ALL_FILTER = "all";
const DEFAULT_VIEW: TViewType = "grid";

// The view falls back to the per-browser preference (and finally the app
// default) only when the URL says nothing — so a shared link always wins.
const getStoredLayout = (): TViewType => {
  const stored = getDataFromStorage(STORAGE_KEYS.VIEW_TYPE);
  return stored === "list" || stored === "grid" ? stored : DEFAULT_VIEW;
};

const normalizeLayout = (raw: string | null): TViewType =>
  raw === "list" || raw === "grid" ? raw : getStoredLayout();

const normalizePage = (raw: string | null): number => {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
};

const _Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const layout = normalizeLayout(searchParams.get(SEARCH_NAME.VIEW));
  const page = normalizePage(searchParams.get(SEARCH_NAME.PAGE));
  const searchContent = searchParams.get(SEARCH_NAME.CONTENT) ?? "";
  const activeFilter = searchParams.get(SEARCH_NAME.STATUS) ?? ALL_FILTER;

  // Merge a mutation into the current params without dropping the others.
  const updateParams = useCallback(
    (
      mutate: (params: URLSearchParams) => void,
      options?: { replace?: boolean },
    ) => {
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
      localStorage.setItem(STORAGE_KEYS.VIEW_TYPE, JSON.stringify(next));
      updateParams((p) => p.set(SEARCH_NAME.VIEW, next));
    },
    [updateParams],
  );

  const {
    products,
    fetchProducts,
    pageLimit,
    isLoadingProducts,
    isAuthenticated,
    addingProductState,
    productStates,
    fetchAllProductStates,
  } = useStoreZ();

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

  // "All" is always present; the rest are whatever the API returns.
  // Guests cannot filter by shelf status, so only "All" is shown for them.
  const filterOptions = isAuthenticated
    ? [
        { value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL },
        ...productStates.map((s) => ({
          value: String(s.id),
          label: s.stateName,
        })),
      ]
    : [{ value: ALL_FILTER, label: TEXTS.CATALOG_FILTER_ALL }];

  const statusId =
    isAuthenticated && activeFilter !== ALL_FILTER
      ? Number(activeFilter)
      : null;

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
      const activeFilterId =
        isAuthenticated && activeFilter !== ALL_FILTER
          ? Number(activeFilter)
          : null;
      addingProductState(
        String(productId),
        String(newStatusId),
        activeFilterId,
      );
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

export default memo(_Products);
