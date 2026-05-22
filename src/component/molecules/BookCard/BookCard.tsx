import { memo, useCallback, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { cx } from '../../../Utils';

import { BookCover, Button } from '../../atoms';

import { useStatuses } from '../../../hooks';
import { ROUT_NAMES, TEXTS, getStatusLabel } from '../../../constants';

import styles from './BookCard.module.css';

type TBookCardLayout = 'grid' | 'list';

interface IBookCardProps {
  productId: number;
  productTitle: string;
  authorName: string;
  productType: string;
  fileUrl?: string;
  fileSrc?: string;
  statusId?: number;
  layout?: TBookCardLayout;
  isAuthenticated?: boolean;
  onStatusChange?: (productId: number, statusId: number) => void;
  className?: string;
}

function BookCard({
  productId,
  productTitle,
  authorName,
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
    [onStatusChange, productId]
  );

  const cardClass = cx(styles.card, layout === 'list' ? styles['card--list'] : '', className);

  return (
    <article className={cardClass} onClick={handleCardClick} aria-label={productTitle}>
      <BookCover
        productId={productId}
        productTitle={productTitle}
        fileUrl={fileUrl}
        fileSrc={fileSrc}
        variant={layout}
      />

      <div className={cx(styles.meta, layout === 'list' ? 'flex-col' : '')}>
        <p className={styles.meta__author}>{authorName}</p>
        {isAuthenticated ? (
          <div className={styles.meta__actions}>
            {statuses.map((s) => (
              <Button
                key={s.id}
                label={getStatusLabel(s)}
                size="sm"
                variant={statusId === s.id ? 'primary' : 'outline'}
                onClick={(e) => handleStatusClick(e, s.id)}
                aria-label={`${TEXTS.DETAIL_ADD_TO_SHELF}: ${s.stateName}`}
                aria-pressed={statusId === s.id}
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default memo(BookCard);
