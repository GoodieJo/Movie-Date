import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateICS(
  title: string,
  date: Date,
  time: string,
  location: string,
  description: string
): string {
  const [hours, minutes] = time.replace(" PM", "").replace(" AM", "").split(":");
  let h = parseInt(hours);
  if (time.includes("PM") && h !== 12) h += 12;
  if (time.includes("AM") && h === 12) h = 0;

  const startDate = new Date(date);
  startDate.setHours(h, parseInt(minutes) || 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 3);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Movie Night Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:🎬 ${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getQueryParams(): { recipient: string; sender: string } {
  if (typeof window === "undefined") return { recipient: "You", sender: "Someone Special" };
  const params = new URLSearchParams(window.location.search);
  return {
    recipient: params.get("recipient") || "You",
    sender: params.get("sender") || "Someone Special",
  };
}
