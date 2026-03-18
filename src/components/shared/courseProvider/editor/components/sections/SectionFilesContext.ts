import { createContext, useContext } from "react";
import type { SectionFileType } from "types/models/Section";

/**
 * Provides the already-persisted file metadata for a section so that content
 * components can display existing assets directly from their remote URLs —
 * without needing to re-fetch them as File objects via getFileFromUrl/useArrayFiles.
 *
 * ## Why this exists
 *
 * The original approach tried to reconstruct File objects from Azure Blob URLs
 * using fetch() inside useArrayFiles.  This caused two bugs:
 *
 *   1. CORS: Azure Blob Storage does not include Access-Control-Allow-Origin for
 *      the dev origin (localhost:3001), so the fetch fails.
 *   2. On failure, setFiles([]) blanked out the form's files field, making the
 *      section appear empty — both after page reload AND right after saving a
 *      new section (since the fresh Section component mounted and ran the same
 *      failing fetch).
 *
 * ## Usage
 *
 * Section.tsx provides the value:
 *   <SectionPersistedFilesContext.Provider value={section.files}>
 *     <FormProvider>...</FormProvider>
 *   </SectionPersistedFilesContext.Provider>
 *
 * Content components read from it:
 *   const persistedFiles = useSectionPersistedFiles();
 *   // persistedFiles[0].url → safe to use as <img src> without any fetch
 *
 * SectionForm.tsx (new sections) does NOT wrap with this provider.
 * The default value [] means "no persisted files yet", which is correct for
 * sections that haven't been saved yet.
 */
export const SectionPersistedFilesContext = createContext<SectionFileType[]>([]);

export const useSectionPersistedFiles = (): SectionFileType[] =>
  useContext(SectionPersistedFilesContext);
