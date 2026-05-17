import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDurationToSeconds(input: string): number | null {
  const value = input.trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  const parts = value.split(':');
  if (parts.length < 2 || parts.length > 3) return null;
  if (parts.some((part) => !/^\d+$/.test(part))) return null;

  const nums = parts.map((part) => Number.parseInt(part, 10));
  const [hours, minutes, seconds] =
    nums.length === 3 ? nums : [0, nums[0], nums[1]];

  if (minutes > 59 || seconds > 59) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatSeconds(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function secondsToTimeParts(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);

  return {
    hours: Math.floor(safeSeconds / 3600).toString().padStart(2, '0'),
    minutes: Math.floor((safeSeconds % 3600) / 60).toString().padStart(2, '0'),
    seconds: (safeSeconds % 60).toString().padStart(2, '0'),
  };
}

export function timePartsToSeconds(hours: string, minutes: string, seconds: string): number | null {
  const normalizedHours = hours.trim() === '' ? '0' : hours.trim();
  const normalizedMinutes = minutes.trim() === '' ? '0' : minutes.trim();
  const normalizedSeconds = seconds.trim() === '' ? '0' : seconds.trim();

  if (![normalizedHours, normalizedMinutes, normalizedSeconds].every((part) => /^\d+$/.test(part))) {
    return null;
  }

  const parsedHours = Number.parseInt(normalizedHours, 10);
  const parsedMinutes = Number.parseInt(normalizedMinutes, 10);
  const parsedSeconds = Number.parseInt(normalizedSeconds, 10);

  if (parsedMinutes > 59 || parsedSeconds > 59) return null;

  return parsedHours * 3600 + parsedMinutes * 60 + parsedSeconds;
}
