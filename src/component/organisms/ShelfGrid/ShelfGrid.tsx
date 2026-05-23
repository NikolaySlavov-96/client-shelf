import { memo } from 'react';

import ShelfCard from '~/component/molecules/ShelfCard/ShelfCard';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { type IProductEmailType, type IProductWithState } from '~/Store/Slicers/ProductSlicer.interface';

import styles from './ShelfGrid.module.css';

type TShelfBook = IProductWithState | IProductEmailType;

function getStatusId(book: TShelfBook): number {
    if ('productStateId' in book) return book.productStateId;
    if ('stateId' in book) return book.stateId;
    return 0;
}

interface IShelfGridProps {
    books: TShelfBook[];
    onRemove?: (productId: number) => void;
    onStatusChange?: (productId: number, statusId: number) => void;
    className?: string;
}

function ShelfGrid({ books, onRemove, onStatusChange, className }: IShelfGridProps) {
    if (books.length === 0) {
        return <p className={styles.empty}>{TEXTS.PROFILE_EMPTY_SHELF}</p>;
    }

    return (
        <div className={cx(styles.container, className)}>
            {books.map((book) => (
                <ShelfCard
                    key={book.productId}
                    productId={book.productId}
                    productTitle={book.productTitle}
                    authorName={book.authorName}
                    statusId={getStatusId(book)}
                    fileUrl={book.fileUrl}
                    fileSrc={book.fileSrc}
                    onRemove={onRemove}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}

export default memo(ShelfGrid);
