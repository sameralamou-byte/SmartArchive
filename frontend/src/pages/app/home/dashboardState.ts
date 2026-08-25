import type { DocumentRead } from "../../../api/types";

/** Dashboard derives UI state only from data that actually exists in the client session. */
export interface DashboardViewState {
  documents: DocumentRead[];
  primaryDocument: DocumentRead | null;
  attentionDocuments: DocumentRead[];
  connectedDocuments: DocumentRead[];
  threadActiveIndex: number;
}

/**
 * Progress along the frozen HSA-08 storyline based on real availability only.
 * 0 = no document yet
 * 1 = document exists, understanding not connected (current production ceiling)
 */
export function threadActiveIndex(documentCount: number): number {
  if (documentCount <= 0) return 0;
  return 1;
}

export function buildDashboardViewState(documents: DocumentRead[]): DashboardViewState {
  const primaryDocument = documents[0] ?? null;
  const secondaryDocuments = primaryDocument ? documents.slice(1) : [];
  const attentionDocuments = secondaryDocuments.length > 1 ? secondaryDocuments.slice(0, 3) : [];
  const connectedDocuments = secondaryDocuments.slice(0, 3);

  return {
    documents,
    primaryDocument,
    attentionDocuments,
    connectedDocuments,
    threadActiveIndex: threadActiveIndex(documents.length),
  };
}
