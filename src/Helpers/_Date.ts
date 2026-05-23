/**
 * @param date {Date} in format '2024-12-03T18:02:43.487Z'
 * @returns 'HH:mm'
 */
export const convertDateTime = (date: string) => {
    const currentDate = new Date(date);

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const isSingleDigitHour = hours.toString().length === 1;
    const hasSingleDigit = minutes.toString().length === 1;

    return `${isSingleDigitHour ? `0${hours}` : hours}:${hasSingleDigit ? `0${minutes}` : minutes}`;
};
