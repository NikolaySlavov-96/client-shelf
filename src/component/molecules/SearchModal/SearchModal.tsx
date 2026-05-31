import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { List } from '~/component/atoms';

import { getSearchCoverGradient, MODAL_NAMES, ROUT_NAMES, TEXTS } from '~/constants';

import { formatAuthors } from '~/Utils';

import { useStoreZ } from '~/hooks';
import { type IProduct, type IProductEmailType, type IProductWithState } from '~/Store/Slicers/ProductSlicer.interface';

import styles from './SearchModal.module.css';

type TSearchScope = 'catalog' | 'shelf' | 'friend';
type TAnyBook = IProduct | IProductWithState | IProductEmailType;

export interface ISearchModalPayload {
    scope?: TSearchScope;
}

function SearchModal() {
    const navigate = useNavigate();
    const {
        modalName,
        isVisible,
        modalPayload,
        closeModal,
        products,
        productCollection,
        productByEmail,
        fetchProducts,
        pageLimit,
    } = useStoreZ();

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const isOpen = isVisible && modalName === MODAL_NAMES.SEARCH;
    const scope: TSearchScope = (modalPayload as ISearchModalPayload | undefined)?.scope ?? 'catalog';

    const source: TAnyBook[] = useMemo(() => {
        switch (scope) {
            case 'shelf':
                return productCollection.rows;
            case 'friend':
                return productByEmail.rows;
            case 'catalog':
            default:
                return products.rows;
        }
    }, [scope, products.rows, productCollection.rows, productByEmail.rows]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, closeModal]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!isOpen || scope !== 'catalog') return;
        fetchProducts({ page: 1, limit: pageLimit, searchContent: debouncedQuery, append: false });
    }, [isOpen, debouncedQuery, scope, fetchProducts, pageLimit]);

    const handleSelect = useCallback(
        (book: TAnyBook) => {
            navigate(`${ROUT_NAMES.PRODUCT}/${book.productId}`);
            closeModal();
        },
        [navigate, closeModal],
    );

    if (!isOpen) return null;

    const trimmed = query.trim().toLowerCase();
    const filtered = !trimmed
        ? source.slice(0, 6)
        : scope === 'catalog'
          ? source
          : source.filter(
                (b) =>
                    b.productTitle.toLowerCase().includes(trimmed) ||
                    b.authors.some((a) => a.name.toLowerCase().includes(trimmed)),
            );

    const sectionLabel = trimmed ? TEXTS.SEARCH_RESULTS_LABEL : TEXTS.SEARCH_SUGGESTED_LABEL;

    return (
        <div
            className={`flex-col ${styles.overlay}`}
            role="dialog"
            aria-modal="true"
            aria-label={TEXTS.COMMON_SEARCH_LABEL}
            onClick={closeModal}
        >
            <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                <div className={`flex-align ${styles.searchRow}`}>
                    <span className={styles.searchIcon} aria-hidden="true">
                        ⌕
                    </span>
                    <input
                        ref={inputRef}
                        className={styles.input}
                        type="text"
                        placeholder={TEXTS.SEARCH_PLACEHOLDER}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label={TEXTS.SEARCH_PLACEHOLDER}
                    />
                    <button className={styles.closeBtn} onClick={closeModal} type="button">
                        {TEXTS.SEARCH_CLOSE}
                    </button>
                </div>

                <div className={styles.results} role="listbox">
                    {filtered.length > 0 ? (
                        <>
                            <div className={styles.sectionLabel}>{sectionLabel}</div>
                            <List
                                data={filtered}
                                keyExtractor={(book) => String(book.productId)}
                                renderItem={({ item: book }) => (
                                    <button
                                        className={`flex-align ${styles.resultItem}`}
                                        role="option"
                                        aria-selected={false}
                                        onClick={() => handleSelect(book)}
                                        type="button"
                                    >
                                        <span
                                            className={styles.bookDot}
                                            style={{ background: getSearchCoverGradient(book.productId) }}
                                            aria-hidden="true"
                                        />
                                        <span className={`flex-col ${styles.bookInfo}`}>
                                            <span className={styles.bookTitle}>{book.productTitle}</span>
                                            <span className={styles.bookAuthor}>
                                                {formatAuthors(book.authors, book.authorsSeparator)}
                                            </span>
                                        </span>
                                        <span className={styles.addLabel}>{TEXTS.SEARCH_ADD}</span>
                                    </button>
                                )}
                            />
                        </>
                    ) : (
                        <p className={styles.empty}>{TEXTS.SEARCH_EMPTY}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(SearchModal);
