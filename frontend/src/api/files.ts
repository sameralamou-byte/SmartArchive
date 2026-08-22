import { apiClient } from "./client";
import type { DocumentRead } from "./types";

export async function uploadFile(file: File): Promise<DocumentRead> {
  const body = new FormData();
  body.append("file", file);
  const { data } = await apiClient.post<DocumentRead>("/files", body);
  return data;
}

export async function getDownloadUrl(documentId: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(`/files/${documentId}/download-url`);
  return data.url;
}

export async function deleteFile(documentId: string): Promise<void> {
  await apiClient.delete(`/files/${documentId}`);
}
