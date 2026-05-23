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
