import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterEvents({
  events,
  search,
  status,
}: {
  events: any[];
  search: string;
  status: string;
}) {
  return events.filter((ev) => {
    const matchesText =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' ? true : ev.priority === status;
    return matchesText && matchesStatus;
  });
}
