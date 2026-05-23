import { memo } from 'react';

import { List } from '~/component/atoms';
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

const ShelfEmpty = () => <p className={styles.empty}>{TEXTS.PROFILE_EMPTY_SHELF}</p>;

function ShelfGrid({ books, onRemove, onStatusChange, className }: IShelfGridProps) {
    return (
        <List
            data={books}
            keyExtractor={(book) => String(book.productId)}
            style={cx(styles.container, className)}
            EmptyComponent={ShelfEmpty}
            renderItem={({ item: book }) => (
                <ShelfCard
                    productId={book.productId}
                    productTitle={book.productTitle}
                    authorName={book.authorName}
                    statusId={getStatusId(book)}
                    fileUrl={book.fileUrl}
                    fileSrc={book.fileSrc}
                    onRemove={onRemove}
                    onStatusChange={onStatusChange}
                />
            )}
        />
    );
}

export default memo(ShelfGrid);
