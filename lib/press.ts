import press from "@/content/press.json";

export interface PressItem {
  title: string;
  outlet: string;
  url: string;
  description: string;
  /** "YYYY-MM" or "YYYY" */
  date?: string;
  /** Slug of the related post on this site */
  post?: string;
  links?: { label: string; url: string }[];
}

export interface PressGroup {
  label: string;
  heading: string;
  items: PressItem[];
}

export function getPressGroups(): PressGroup[] {
  return press as PressGroup[];
}

/** "2019-04" -> "Apr 2019", "2019" -> "2019" */
export function formatPressDate(date: string): string {
  const [year, month] = date.split("-").map(Number);
  if (!month) return String(year);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
