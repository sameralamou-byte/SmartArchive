import type { DocumentRead } from "../../../api/types";

export type MimeFilter = "all" | "pdf" | "image" | "other";
export type DocumentsSort = "newest" | "oldest" | "name";

function matchesMimeFilter(mimeType: string, filter: MimeFilter): boolean {
  if (filter === "all") return true;
  if (filter === "pdf") return mimeType === "application/pdf";
  if (filter === "image") return mimeType.startsWith("image/");
  return mimeType !== "application/pdf" && !mimeType.startsWith("image/");
}

function matchesQuery(document: DocumentRead, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    document.title.toLowerCase().includes(normalized) ||
    document.original_filename.toLowerCase().includes(normalized)
  );
}

export function filterDocuments(
  documents: DocumentRead[],
  query: string,
  mimeFilter: MimeFilter,
): DocumentRead[] {
  return documents.filter(
    (document) => matchesQuery(document, query) && matchesMimeFilter(document.mime_type, mimeFilter),
  );
}

export function sortDocuments(documents: DocumentRead[], sort: DocumentsSort): DocumentRead[] {
  const copy = [...documents];
  if (sort === "newest") {
    return copy.sort(
      (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
  }
  if (sort === "oldest") {
    return copy.sort(
      (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
    );
  }
  return copy.sort((left, right) => left.title.localeCompare(right.title));
}

export function buildDocumentsView(
  documents: DocumentRead[],
  query: string,
  mimeFilter: MimeFilter,
  sort: DocumentsSort,
): DocumentRead[] {
  return sortDocuments(filterDocuments(documents, query, mimeFilter), sort);
}
