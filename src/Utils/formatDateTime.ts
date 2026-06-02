/** Formats an ISO timestamp as a readable date + time, falling back to the raw value if unparsable. */
export const formatDateTime = (iso: string): string => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};
