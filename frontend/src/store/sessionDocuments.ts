import { create } from "zustand";

import type { DocumentRead } from "../api/types";

interface SessionDocumentsState {
  documents: DocumentRead[];
  add: (document: DocumentRead) => void;
  remove: (id: string) => void;
  getById: (id: string) => DocumentRead | undefined;
  clear: () => void;
}

export const useSessionDocumentsStore = create<SessionDocumentsState>((set, get) => ({
  documents: [],
  add: (document) =>
    set((state) => ({
      documents: [document, ...state.documents.filter((item) => item.id !== document.id)],
    })),
  remove: (id) => set((state) => ({ documents: state.documents.filter((item) => item.id !== id) })),
  getById: (id) => get().documents.find((item) => item.id === id),
  clear: () => set({ documents: [] }),
}));
