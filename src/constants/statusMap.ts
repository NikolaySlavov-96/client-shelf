import { type IStatusHistoryEntry } from '~/Store/Slicers/ProductSlicer.interface';

export interface IStatusStyle {
    readonly solidClass: string;
    readonly lightClass: string;
}

/**
 * Presentation only. Maps a status id to the colour it wears in the UI.
 * The label and the set of statuses that actually exist come from the API
 * (`GET /status/all`) — never from here.
 * Key 0 is the explicit default: unknown / future ids fall back to it.
 */
const STATUS_STYLE: Record<number, IStatusStyle> = {
    0: { solidClass: 'badge--solid-default', lightClass: 'badge--light-default' },
    1: { solidClass: 'badge--solid-want',        lightClass: 'badge--light-want' },
    2: { solidClass: 'badge--solid-reading',     lightClass: 'badge--light-reading' },
    3: { solidClass: 'badge--solid-read',        lightClass: 'badge--light-read' },
    4: { solidClass: 'badge--solid-want-listen', lightClass: 'badge--light-want-listen' },
    5: { solidClass: 'badge--solid-listening',   lightClass: 'badge--light-listening' },
    6: { solidClass: 'badge--solid-listened',    lightClass: 'badge--light-listened' },
};

export const getStatusStyle = (id: number): IStatusStyle => STATUS_STYLE[id] ?? STATUS_STYLE[0];

/**
 * The user-facing label for a status: its symbol prefixed to the name when one
 * exists, otherwise just the name. Both come from the API — see useStatuses.
 */
export const getStatusLabel = (status: { stateName: string; symbol?: string }): string =>
    status.symbol ? `${status.symbol} ${status.stateName}` : status.stateName;

export const countForStatus = (history: IStatusHistoryEntry[] | undefined, statusId: number): number =>
    (history ?? []).reduce((total, entry) => (entry.statusId === statusId ? total + 1 : total), 0);

export const statusLabelWithCount = (
    status: { stateName: string; symbol?: string },
    history: IStatusHistoryEntry[] | undefined,
    statusId: number,
): string => {
    const count = countForStatus(history, statusId);
    const label = getStatusLabel(status);
    return count >= 2 ? `${label} ×${count}` : label;
};

export const isSameStatus = (
    currentStatusId: number | null | undefined,
    nextStatusId: number | null | undefined,
): boolean => currentStatusId === nextStatusId;

export interface IStatusInterval {
    setAt: string;
    changedAt: string | null;
}

export const getStatusIntervals = (history: IStatusHistoryEntry[] | undefined, statusId: number): IStatusInterval[] => {
    const sorted = [...(history ?? [])].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const intervals: IStatusInterval[] = [];
    for (let index = 0; index < sorted.length; index++) {
        if (sorted[index].statusId !== statusId) {
            continue;
        }
        intervals.push({ setAt: sorted[index].createdAt, changedAt: sorted[index + 1]?.createdAt ?? null });
    }
    return intervals;
};
