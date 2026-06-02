import { memo, type ReactNode, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { getStatusLabel, getStatusTimeline, TEXTS } from '~/constants';

import { cx, formatDateTime } from '~/Utils';

import { useStoreZ } from '~/hooks';
import { type IStatusHistoryEntry } from '~/Store/Slicers/ProductSlicer.interface';

import styles from './StatusHistoryPopover.module.css';

interface IStatusHistoryPopoverProps {
    history?: IStatusHistoryEntry[];
    children: ReactNode;
}

const FLIP_BELOW_THRESHOLD = 220;

interface IPopoverPosition {
    left: number;
    top: number;
    placement: 'top' | 'bottom';
}

function StatusHistoryPopover({ history, children }: IStatusHistoryPopoverProps) {
    const productStates = useStoreZ((s) => s.productStates);
    const wrapRef = useRef<HTMLSpanElement>(null);
    const [position, setPosition] = useState<IPopoverPosition | null>(null);

    const open = useCallback(() => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        const placement = rect.top < FLIP_BELOW_THRESHOLD ? 'bottom' : 'top';
        setPosition({
            left: rect.left + rect.width / 2,
            top: placement === 'top' ? rect.top - 8 : rect.bottom + 8,
            placement,
        });
    }, []);

    const close = useCallback(() => setPosition(null), []);

    const timeline = getStatusTimeline(history);
    if (timeline.length === 0) {
        return children;
    }

    const labelFor = (statusId: number) => {
        const state = productStates.find((s) => s.id === statusId);
        return state ? getStatusLabel(state) : `#${statusId}`;
    };

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
                          {timeline.map((entry) => (
                              <span className="flex-col" key={entry.setAt}>
                                  <span className={styles.status}>{labelFor(entry.statusId)}</span>
                                  <span>
                                      {TEXTS.DETAIL_HISTORY_SET}: {formatDateTime(entry.setAt)}
                                  </span>
                                  <span className={styles.changed}>
                                      {TEXTS.DETAIL_HISTORY_CHANGED}:{' '}
                                      {entry.changedAt ? formatDateTime(entry.changedAt) : TEXTS.DETAIL_HISTORY_CURRENT}
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
