import { memo, useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Pagination } from '~/component/molecules';

import { ShelfGrid } from '~/component/organisms';

import { SEARCH_NAME, TEXTS } from '~/constants';

import { useStoreZ } from '~/hooks';

import styles from './_SearchByEmail.module.css';

const SearchByEmail = () => {
    const { email } = useParams<{ email: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Page lives in the URL so a shared search link reopens the same page.
    const pageParam = Number(searchParams.get(SEARCH_NAME.PAGE));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const setPage = useCallback(
        (next: number) => {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (next <= 1) {
                    params.delete(SEARCH_NAME.PAGE);
                } else {
                    params.set(SEARCH_NAME.PAGE, String(next));
                }
                return params;
            });
        },
        [setSearchParams],
    );

    const { isLoadingProductByEmails, pageLimit, productByEmail, fetchProductsForEmail } = useStoreZ();

    useEffect(() => {
        setSearchParams(
            (prev) => {
                const params = new URLSearchParams(prev);
                params.delete(SEARCH_NAME.PAGE);
                return params;
            },
            { replace: true },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    useEffect(() => {
        if (email) {
            fetchProductsForEmail({ searchContent: email, limit: pageLimit, page });
        }
    }, [fetchProductsForEmail, email, pageLimit, page]);

    const displayEmail = decodeURIComponent(email ?? '');
    const pageCount = Math.ceil(productByEmail.count / pageLimit) || 0;

    return (
        <main className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.header__title}>{TEXTS.SEARCH_EMAIL_TITLE}</h1>
                <p className={styles.header__email}>{displayEmail}</p>
            </header>

            {isLoadingProductByEmails ? (
                <div className={styles.loading}>{TEXTS.COMMON_LOADING}</div>
            ) : (
                <>
                    <ShelfGrid books={productByEmail.rows} />
                    <Pagination count={pageCount} page={page} onSubmit={setPage} />
                </>
            )}
        </main>
    );
};

export default memo(SearchByEmail);
