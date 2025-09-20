import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return "";
  }

  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function formatDate(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", options ?? { dateStyle: "medium" }).format(
    date,
  );
}

export function formatDateTime(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  return formatDate(
    value,
    options ?? {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
