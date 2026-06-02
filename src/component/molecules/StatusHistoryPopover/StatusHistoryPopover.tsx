import { memo, type ReactNode } from 'react';

import { type IStatusInterval, TEXTS } from '~/constants';

import { formatDateTime } from '~/Utils';

import styles from './StatusHistoryPopover.module.css';

interface IStatusHistoryPopoverProps {
    intervals: IStatusInterval[];
    children: ReactNode;
}

function StatusHistoryPopover({ intervals, children }: IStatusHistoryPopoverProps) {
    if (intervals.length === 0) {
        return children;
    }

    return (
        <span className={styles.wrap}>
            {children}
            <span className={styles.popover} role="tooltip">
                <span className={styles.title}>{TEXTS.DETAIL_HISTORY_TITLE}</span>
                {intervals.map((interval) => (
                    <span className={styles.row} key={interval.setAt}>
                        <span>
                            {TEXTS.DETAIL_HISTORY_SET}: {formatDateTime(interval.setAt)}
                        </span>
                        <span className={styles.changed}>
                            {TEXTS.DETAIL_HISTORY_CHANGED}:{' '}
                            {interval.changedAt ? formatDateTime(interval.changedAt) : TEXTS.DETAIL_HISTORY_CURRENT}
                        </span>
                    </span>
                ))}
            </span>
        </span>
    );
}

export default memo(StatusHistoryPopover);
