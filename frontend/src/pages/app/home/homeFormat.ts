export function formatReceived(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function mimeLabel(mimeType: string): string {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("image/")) return mimeType.replace("image/", "").toUpperCase();
  const parts = mimeType.split("/");
  return parts[parts.length - 1]?.toUpperCase() ?? mimeType;
}
