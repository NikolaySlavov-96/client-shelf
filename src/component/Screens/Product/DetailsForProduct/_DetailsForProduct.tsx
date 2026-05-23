import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge, BookCover, Button, StarRating } from '~/component/atoms';

import { getStatusLabel, ROUT_NAMES, TEXTS } from '~/constants';

import { useStatuses, useStoreZ } from '~/hooks';

import { getProductDetailStats } from './_DetailsForProduct.config';
import styles from './_DetailsForProduct.module.css';

const DetailsForProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shareEmail, setShareEmail] = useState('');

    const { statuses } = useStatuses();

    const {
        isAuthenticated,
        fetchProductById,
        productById,
        isLoadingProduct,
        fetchProductState,
        addingProductState,
        productState,
        productRating,
        fetchProductRating,
        rateProduct,
        email,
    } = useStoreZ();

    const currentStatusId = productState?.stateId ?? 0;

    const handleBack = useCallback(() => navigate(-1), [navigate]);

    const handleStatusChange = useCallback(
        (statusId: number) => {
            if (id) addingProductState(id, String(statusId));
        },
        [id, addingProductState],
    );

    const handleRate = useCallback(
        (rating: number) => {
            if (id) rateProduct(id, rating);
        },
        [id, rateProduct],
    );

    const handleShareSubmit = useCallback(() => {
        const trimmed = shareEmail.trim();
        if (!trimmed) return;
        navigate(`${ROUT_NAMES.REVIEW_PRODUCTS_BY_EMAIL.replace(':email', '')}${encodeURIComponent(trimmed)}`);
    }, [shareEmail, navigate]);

    const hasId = id && id !== '0';
    useEffect(() => {
        if (hasId) {
            fetchProductById(id);
            fetchProductRating(id);
        }
    }, [id, hasId, fetchProductById, fetchProductRating]);

    useEffect(() => {
        if (email && hasId) {
            fetchProductState(id);
        }
    }, [id, hasId, email, fetchProductState]);

    return (
        <main className={styles.wrap}>
            <button className={styles.back} onClick={handleBack} type="button">
                {TEXTS.DETAIL_BACK}
            </button>

            {isLoadingProduct ? (
                <div className={styles.loading}>{TEXTS.COMMON_LOADING}</div>
            ) : (
                <div className={styles.grid}>
                    <BookCover
                        productId={productById?.productId ?? 0}
                        productTitle={productById?.productTitle ?? ''}
                        fileUrl={productById?.fileUrl}
                        fileSrc={productById?.fileSrc}
                        variant="detail"
                    >
                        {currentStatusId ? <Badge statusId={currentStatusId} badgeStyle="solid" /> : null}
                    </BookCover>

                    <div className={styles.info}>
                        <p className={styles.info__genre}>
                            {productById?.authorGenre ?? TEXTS.COMMON_PLACEHOLDER_VALUE}
                        </p>
                        <h1 className={styles.info__title}>{productById?.productTitle}</h1>
                        <p className={styles.info__author}>{productById?.authorName}</p>

                        <div className={styles.stats}>
                            {getProductDetailStats({
                                pages: productById?.pages,
                                publishedYear: productById?.publishedYear,
                                rating: productRating,
                            }).map((stat) => (
                                <div className={`flex-col ${styles.stat}`} key={stat.id}>
                                    <span className={styles.stat__value}>{stat.value}</span>
                                    <span className={styles.stat__label}>{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <p className={styles.desc}>{productById?.description ?? TEXTS.DETAIL_DESC_PLACEHOLDER}</p>

                        {isAuthenticated ? (
                            <>
                                <div className={styles.actions}>
                                    <p className={styles.actions__label}>{TEXTS.DETAIL_YOUR_RATING}</p>
                                    <StarRating
                                        value={productRating.userRating}
                                        interactive
                                        onRate={handleRate}
                                        ariaLabel={TEXTS.DETAIL_YOUR_RATING}
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <p className={styles.actions__label}>{TEXTS.DETAIL_ADD_TO_SHELF}</p>
                                    <div className={styles.actions__btns}>
                                        {statuses.map((s) => (
                                            <Button
                                                key={s.id}
                                                label={getStatusLabel(s)}
                                                variant={currentStatusId === s.id ? 'primary' : 'outline'}
                                                size="md"
                                                onClick={() => handleStatusChange(s.id)}
                                                ariaLabel={`${TEXTS.DETAIL_ADD_TO_SHELF}: ${s.stateName}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.share}>
                                    <p className={styles.share__label}>{TEXTS.DETAIL_SHARE_LABEL}</p>
                                    <div className={styles.share__row}>
                                        <input
                                            className={styles.share__input}
                                            type="email"
                                            placeholder={TEXTS.DETAIL_SHARE_PLACEHOLDER}
                                            value={shareEmail}
                                            onChange={(e) => setShareEmail(e.target.value)}
                                            onKeyDown={(e) => (e.key === 'Enter' ? handleShareSubmit() : undefined)}
                                            aria-label={TEXTS.DETAIL_SHARE_LABEL}
                                        />
                                        <button
                                            className={styles.share__btn}
                                            onClick={handleShareSubmit}
                                            type="button"
                                            disabled={!shareEmail.trim()}
                                        >
                                            {TEXTS.DETAIL_SHARE_BTN}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </main>
    );
};

export default memo(DetailsForProduct);
