import { memo, type ReactNode, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { type IStatusInterval, TEXTS } from '~/constants';

import { cx, formatDateTime } from '~/Utils';

import styles from './StatusHistoryPopover.module.css';

interface IStatusHistoryPopoverProps {
    intervals: IStatusInterval[];
    children: ReactNode;
}

const POPOVER_GAP = 8;
const FLIP_BELOW_THRESHOLD = 220;

interface IPopoverPosition {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}

function StatusHistoryPopover({ intervals, children }: IStatusHistoryPopoverProps) {
    const wrapRef = useRef<HTMLSpanElement>(null);
    const [position, setPosition] = useState<IPopoverPosition | null>(null);

    const open = useCallback(() => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        const placement = rect.top < FLIP_BELOW_THRESHOLD ? 'bottom' : 'top';
        setPosition({
            left: rect.left + rect.width / 2,
            top: placement === 'top' ? rect.top - POPOVER_GAP : rect.bottom + POPOVER_GAP,
            placement,
        });
    }, []);

    const close = useCallback(() => setPosition(null), []);

    if (intervals.length === 0) {
        return children;
    }

    return (
        <span
            ref={wrapRef}
            className={styles.wrap}
            onMouseEnter={open}
            onMouseLeave={close}
            onFocus={open}
            onBlur={close}
        >
            {children}
            {position
                ? createPortal(
                      <span
                          className={cx(styles.popover, 'flex-col')}
                          role="tooltip"
                          style={{
                              left: position.left,
                              top: position.top,
                              transform: position.placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                          }}
                      >
                          <span className={styles.title}>{TEXTS.DETAIL_HISTORY_TITLE}</span>
                          {intervals.map((interval) => (
                              <span className="flex-col" key={interval.setAt}>
                                  <span>
                                      {TEXTS.DETAIL_HISTORY_SET}: {formatDateTime(interval.setAt)}
                                  </span>
                                  <span className={styles.changed}>
                                      {TEXTS.DETAIL_HISTORY_CHANGED}:{' '}
                                      {interval.changedAt
                                          ? formatDateTime(interval.changedAt)
                                          : TEXTS.DETAIL_HISTORY_CURRENT}
                                  </span>
                              </span>
                          ))}
                      </span>,
                      document.body,
                  )
                : null}
        </span>
    );
}

export default memo(StatusHistoryPopover);
