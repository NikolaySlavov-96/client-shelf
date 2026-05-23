/**
 * Decides which parts of a progress-bar's text content should switch to the
 * on-fill (light) colour so they stay legible once the accent fill grows under
 * them. Each key has an exclusive lower bound: the text flips when
 * `pct > threshold`. Tweak these numbers to shift the breakpoints — nothing
 * else needs to change.
 */
export const PROGRESS_CONTRAST_THRESHOLDS = {
    label: 10,
    value: 75,
} as const;

export type ProgressContrastKey = keyof typeof PROGRESS_CONTRAST_THRESHOLDS;

export type ProgressContrast = Record<ProgressContrastKey, boolean>;

export const getProgressContrast = (
    pct: number,
    thresholds: Record<ProgressContrastKey, number> = PROGRESS_CONTRAST_THRESHOLDS,
): ProgressContrast => ({
    label: pct > thresholds.label,
    value: pct > thresholds.value,
});
