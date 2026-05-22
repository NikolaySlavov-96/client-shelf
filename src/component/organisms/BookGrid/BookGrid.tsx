import { memo } from 'react';

import BookCard from '../../molecules/BookCard/BookCard';

import { cx } from '../../../Utils';

import { TEXTS } from '../../../constants';
import { IProduct } from '../../../Store/Slicers/ProductSlicer.interface';

import type { TViewType } from '../../../Types/Components';

import styles from './BookGrid.module.css';

interface IBookGridProps {
  books: IProduct[];
  isAuthenticated?: boolean;
  layout?: TViewType;
  onStatusChange?: (productId: number, statusId: number) => void;
  className?: string;
}

function BookGrid({ books, isAuthenticated = false, layout = 'grid', onStatusChange, className }: IBookGridProps) {
  if (books.length === 0) {
    return <p className={styles.empty}>{TEXTS.CATALOG_EMPTY}</p>;
  }

  return (
    <div
      className={cx(styles.container, layout === 'list' ? `flex-col ${styles['container--list']}` : styles['container--grid'], className)}
    >
      {books.map((book) => (
        <BookCard
          key={book.productId}
          productId={book.productId}
          productTitle={book.productTitle}
          authorName={book.authorName}
          productType={book.productType}
          statusId={book.statusId ?? undefined}
          fileUrl={book.fileUrl}
          fileSrc={book.fileSrc}
          layout={layout}
          isAuthenticated={isAuthenticated}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default memo(BookGrid);
