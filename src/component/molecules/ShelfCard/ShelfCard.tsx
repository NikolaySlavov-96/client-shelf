import { memo, useCallback } from 'react';

import { Badge, BookCover } from '~/component/atoms';

import { TEXTS } from '~/constants';

import { cx } from '~/Utils';

import { Toast, ToastWithButton } from '~/Toasts';
import { ESwalIcon } from '~/Types/Swal';

import styles from './ShelfCard.module.css';

interface IShelfCardProps {
    productId: number;
    productTitle: string;
    authorName: string;
    statusId: number;
    fileUrl?: string;
    fileSrc?: string;
    onRemove?: (productId: number) => void;
    className?: string;
}

function ShelfCard({
    productId,
    productTitle,
    authorName,
    statusId,
    fileUrl,
    fileSrc,
    onRemove,
    className,
}: IShelfCardProps) {
    const handleRemove = useCallback(async () => {
        if (!onRemove) return;
        const result = await ToastWithButton({
            title: TEXTS.PROFILE_REMOVE_CONFIRM_TITLE,
            subContent: TEXTS.PROFILE_REMOVE_CONFIRM_TEXT,
            typeIcon: ESwalIcon.WARNING,
            isConfirmButton: true,
            isCancelButton: true,
            confirmButtonTitle: TEXTS.PROFILE_REMOVE_CONFIRM_BTN,
            cancelButtonTitle: TEXTS.PROFILE_REMOVE_CANCEL_BTN,
            isOutsidePress: false,
        });
        if (result.isConfirmed) {
            onRemove(productId);
            Toast({ title: TEXTS.TOAST_REMOVE_SUCCESS, typeIcon: ESwalIcon.SUCCESS });
        }
    }, [onRemove, productId]);

    return (
        <article className={cx(styles.card, className)}>
            <BookCover
                productId={productId}
                productTitle={productTitle}
                fileUrl={fileUrl}
                fileSrc={fileSrc}
                variant="shelf"
            />

            <div className={styles.body}>
                <p className={styles.author}>{authorName}</p>
                <div className={`flex-between ${styles.footer}`}>
                    <Badge statusId={statusId} badgeStyle="light" />
                    {onRemove ? (
                        <button
                            className={styles['remove-btn']}
                            type="button"
                            onClick={handleRemove}
                            aria-label={`${TEXTS.PROFILE_REMOVE}: ${productTitle}`}
                        >
                            {TEXTS.PROFILE_REMOVE}
                        </button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export default memo(ShelfCard);
