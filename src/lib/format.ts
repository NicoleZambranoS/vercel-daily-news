export function formatDate(date: string): string {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
