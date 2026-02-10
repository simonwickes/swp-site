import { formatDistanceToNow, differenceInDays, format } from "date-fns";

/**
 * Format a post date for display.
 * - If the date is within the last 15 days, show relative time (e.g., "3 days ago")
 * - Otherwise, show absolute date (e.g., "February 10, 2026")
 */
export function formatPostDate(date: Date): string {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff <= 15) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "MMMM d, yyyy");
}
