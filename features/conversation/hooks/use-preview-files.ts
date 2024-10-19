import { create } from "zustand";

interface PreviewFilesStore {
  previewFiles: File[];
  filesUrls: string[];
  uploadedFiles: string[];
  addFilesUrls: (urls: string[]) => void;
  removeFilesUrls: (url: string) => void;
  addUploadedFile: (url: string) => void;
  removePreviewFile: (url: string) => void;
  addPreviewFile: (file: File) => void;
  clearPreviewFiles: () => void;
  clearFilesUrls: () => void;
}

export const usePreviewFiles = create<PreviewFilesStore>(set => ({
  previewFiles: [],
  filesUrls: [],
  uploadedFiles: [],
  addFilesUrls: urls =>
    set(state => ({ filesUrls: [...state.filesUrls, ...urls] })),
  removeFilesUrls: url =>
    set(state => ({
      filesUrls: state.filesUrls.filter(existingUrl => existingUrl !== url),
    })),
  addUploadedFile: url =>
    set(state => ({ uploadedFiles: [...state.uploadedFiles, url] })),
  removePreviewFile: url =>
    set(state => ({
      previewFiles: state.previewFiles.filter(file => file.name !== url),
    })),
  addPreviewFile: file =>
    set(state => ({ previewFiles: [...state.previewFiles, file] })),
  clearPreviewFiles: () => set({ previewFiles: [] }),
  clearFilesUrls: () => set({ filesUrls: [] }),
}));
