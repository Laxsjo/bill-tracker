/**
 * Converts a date oject into a 'yyyy-mm-dd' date string.
 *
 * > **Note:** This doesn't respect the current timezone, and only uses the date
 * > in the zero UTC offset.
 *
 * @param date The date to format
 * @returns The formatted string
 */
export function toDateString(date: Date): string {
	return date.toISOString().split('T')[0];
}
