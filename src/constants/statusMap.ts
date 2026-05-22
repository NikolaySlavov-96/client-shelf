export enum EStatusId {
  READ = 1,
  READING = 2,
  WANT = 3,
  LISTENING = 4,
  LISTENED = 5,
}

export interface IStatusStyle {
  readonly solidClass: string;
  readonly lightClass: string;
}

/**
 * Presentation only. Maps a status id to the colour it wears in the UI.
 * The label and the set of statuses that actually exist come from the API
 * (`GET /status/all`) — never from here. An id we don't have a colour for
 * falls back to a neutral style so unknown / newly-added statuses still render.
 */
const STATUS_STYLE: Record<number, IStatusStyle> = {
  [EStatusId.READ]: { solidClass: 'badge--solid-read', lightClass: 'badge--light-read' },
  [EStatusId.READING]: { solidClass: 'badge--solid-reading', lightClass: 'badge--light-reading' },
  [EStatusId.WANT]: { solidClass: 'badge--solid-want', lightClass: 'badge--light-want' },
  [EStatusId.LISTENING]: { solidClass: 'badge--solid-listening', lightClass: 'badge--light-listening' },
  [EStatusId.LISTENED]: { solidClass: 'badge--solid-listened', lightClass: 'badge--light-listened' },
};

const NEUTRAL_STYLE: IStatusStyle = {
  solidClass: 'badge--solid-neutral',
  lightClass: 'badge--light-neutral',
};

export const getStatusStyle = (id: number): IStatusStyle => STATUS_STYLE[id] ?? NEUTRAL_STYLE;

/**
 * The user-facing label for a status: its symbol prefixed to the name when one
 * exists, otherwise just the name. Both come from the API — see useStatuses.
 */
export const getStatusLabel = (status: { stateName: string; symbol?: string }): string =>
  status.symbol ? `${status.symbol} ${status.stateName}` : status.stateName;
