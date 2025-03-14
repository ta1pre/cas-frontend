export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short", // 曜日を表示
    hour: "numeric",
    minute: "numeric",
  });
}

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString("ja-JP");
}
