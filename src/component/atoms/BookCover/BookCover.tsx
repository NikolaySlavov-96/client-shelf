import { memo, type ReactNode } from 'react';

import { getCoverGradient } from '~/constants';

import { cx } from '~/Utils';

import styles from './BookCover.module.css';

type TBookCoverVariant = 'grid' | 'list' | 'shelf' | 'detail';

interface IBookCoverProps {
    productId: number;
    productTitle: string;
    fileUrl?: string;
    fileSrc?: string;
    /** Sizing + how the title is shown. `detail` centers the title as a
     * placeholder (only when there is no image); the rest overlay it. */
    variant?: TBookCoverVariant;
    /** Rendered top-right, e.g. a status <Badge />. */
    children?: ReactNode;
    className?: string;
}

function BookCover({
    productId,
    productTitle,
    fileUrl,
    fileSrc,
    variant = 'grid',
    children,
    className,
}: IBookCoverProps) {
    const gradient = getCoverGradient(productId);
    const isDetail = variant === 'detail';

    return (
        <div className={cx(styles.cover, styles[`cover--${variant}`], className)} style={{ background: gradient }}>
            {fileUrl ? <img className={styles.img} src={fileUrl} alt={fileSrc ?? productTitle} /> : null}

            {isDetail ? (
                !fileUrl ? (
                    <span className={styles.placeholder}>{productTitle}</span>
                ) : null
            ) : (
                <div className={styles.overlay}>
                    <span className={styles.title}>{productTitle}</span>
                </div>
            )}

            {children ? <div className={styles.badge}>{children}</div> : null}
        </div>
    );
}

export default memo(BookCover);
