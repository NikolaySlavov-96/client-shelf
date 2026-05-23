import { memo } from 'react';

import { TEXTS } from '~/constants';

import { getProgressContrast } from '~/Helpers';
import { cx } from '~/Utils';

import styles from './ProgressBar.module.css';

interface IProgressBarProps {
    label?: string;
    current: number;
    goal: number;
    className?: string;
}

function ProgressBar({ label = TEXTS.PROFILE_GOAL_LABEL, current, goal, className }: IProgressBarProps) {
    const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
    const contrast = getProgressContrast(pct);

    return (
        <div
            className={cx('flex-align', styles.container, className)}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-label={`${label}: ${current} of ${goal}`}
        >
            <div className={styles.fill} style={{ width: `${pct}%` }} aria-hidden="true" />
            <span className={cx(styles.label, contrast.label && styles.onFill)}>{label}</span>
            <span className={cx(styles.pct, contrast.value && styles.onFill)}>
                {current} / {goal}
            </span>
        </div>
    );
}

export default memo(ProgressBar);
