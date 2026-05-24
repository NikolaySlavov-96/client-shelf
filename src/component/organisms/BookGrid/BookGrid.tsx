import { memo } from 'react';

import { List } from '~/component/atoms';

import { BookCard } from '~/component/molecules';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { type IProduct } from '~/Store/Slicers/ProductSlicer.interface';
import type { TViewType } from '~/Types/Components';

import styles from './BookGrid.module.css';

interface IBookGridProps {
    books: IProduct[];
    isAuthenticated?: boolean;
    layout?: TViewType;
    onStatusChange?: (productId: number, statusId: number) => void;
    className?: string;
}

const CatalogEmpty = () => <p className={styles.empty}>{TEXTS.CATALOG_EMPTY}</p>;

function BookGrid({ books, isAuthenticated = false, layout = 'grid', onStatusChange, className }: IBookGridProps) {
    return (
        <List
            data={books}
            keyExtractor={(book) => String(book.productId)}
            style={cx(
                styles.container,
                layout === 'list' ? `flex-col ${styles['container--list']}` : styles['container--grid'],
                className,
            )}
            EmptyComponent={CatalogEmpty}
            renderItem={({ item: book }) => (
                <BookCard
                    productId={book.productId}
                    productTitle={book.productTitle}
                    authors={book.authors}
                    authorsSeparator={book.authorsSeparator}
                    productType={book.productType}
                    statusId={book.statusId ?? undefined}
                    fileUrl={book.fileUrl}
                    fileSrc={book.fileSrc}
                    layout={layout}
                    isAuthenticated={isAuthenticated}
                    onStatusChange={onStatusChange}
                />
            )}
        />
    );
}

export default memo(BookGrid);
