import { differenceInCalendarDays, format } from "date-fns";

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy");
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy h:mm a");
}

export function daysAgo(dateString: string): number {
  return differenceInCalendarDays(new Date(), new Date(dateString));
}
