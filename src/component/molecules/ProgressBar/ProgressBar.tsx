import { memo } from "react";

import { TEXTS } from "../../../constants";

import { cx } from "../../../Utils";

import styles from "./ProgressBar.module.css";

interface IProgressBarProps {
  label?: string;
  current: number;
  goal: number;
  className?: string;
}

function ProgressBar({
  label = TEXTS.PROFILE_GOAL_LABEL,
  current,
  goal,
  className,
}: IProgressBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  return (
    <div
      className={cx("flex-align", styles.container, className)}
      aria-label={`${label}: ${current} of ${goal}`}
    >
      <span className={styles.label}>{label}</span>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.pct}>
        {current} / {goal}
      </span>
    </div>
  );
}

export default memo(ProgressBar);
