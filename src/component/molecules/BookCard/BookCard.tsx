import { memo, type MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { BookCover, Button, List } from '~/component/atoms';

import { getStatusLabel, ROUT_NAMES, TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { useStatuses } from '~/hooks';
import { type IAuthor } from '~/Store/Slicers/ProductSlicer.interface';
import type { TViewType } from '~/Types/Components';

import styles from './BookCard.module.css';

interface IBookCardProps {
    productId: number;
    productTitle: string;
    authors: IAuthor[];
    productType: string;
    fileUrl?: string;
    fileSrc?: string;
    statusId?: number;
    layout?: TViewType;
    isAuthenticated?: boolean;
    onStatusChange?: (productId: number, statusId: number) => void;
    className?: string;
}

function BookCard({
    productId,
    productTitle,
    authors,
    fileUrl,
    fileSrc,
    statusId,
    layout = 'grid',
    isAuthenticated = false,
    onStatusChange,
    className,
}: IBookCardProps) {
    const navigate = useNavigate();
    const { statuses } = useStatuses();

    const handleCardClick = useCallback(() => {
        navigate(`${ROUT_NAMES.PRODUCT}/${productId}`);
    }, [navigate, productId]);

    const handleStatusClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>, sid: number) => {
            e.stopPropagation();
            onStatusChange?.(productId, sid);
        },
        [onStatusChange, productId],
    );

    const isList = layout === 'list';
    const cardClass = cx(styles.card, isList ? styles['card--list'] : '', className);

    return (
        <article className={cardClass} onClick={handleCardClick} aria-label={productTitle}>
            <BookCover
                productId={productId}
                productTitle={productTitle}
                fileUrl={fileUrl}
                fileSrc={fileSrc}
                variant={layout}
            />

            <div className={cx(styles.meta, isList ? 'flex-col' : '')}>
                {isList ? <p className={styles.meta__title}>{productTitle}</p> : null}
                <p className={styles.meta__author}>{authors.map((a) => a.name).join(', ')}</p>
                {isAuthenticated ? (
                    <List
                        data={statuses}
                        keyExtractor={(s) => String(s.id)}
                        style={styles.meta__actions}
                        renderItem={({ item: s }) => (
                            <Button
                                label={getStatusLabel(s)}
                                size="sm"
                                variant={statusId === s.id ? 'primary' : 'outline'}
                                onClick={(e) => handleStatusClick(e, s.id)}
                                aria-label={`${TEXTS.DETAIL_ADD_TO_SHELF}: ${s.stateName}`}
                                aria-pressed={statusId === s.id}
                            />
                        )}
                    />
                ) : null}
            </div>
        </article>
    );
}

export default memo(BookCard);
