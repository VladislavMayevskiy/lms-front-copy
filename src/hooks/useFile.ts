"use client";

import { useEffect } from "react";
import type { Nullable } from "types/general";
import { getFileFromUrl, getFilesFromUrl } from "utils/getFileFromUrl";

export const useFile = ({
  fileUrl,
  fileName,
  setFile,
}: {
  fileUrl?: Nullable<string>;
  fileName: string;
  setFile: (file: File | null) => void;
}) => {
  useEffect(() => {
    (async () => {
      if (fileUrl) {
        const file = await getFileFromUrl(fileUrl, fileName);
        setFile(file || null);
      }
    })();
  }, [fileUrl]);
};

export const useArrayFiles = ({
  urls,
  setFiles,
}: {
  urls: {
    url: string;
    fileName: string;
  }[];
  setFiles: (files?: File[]) => void;
}) => {
  /**
   * Use the joined URL strings as the effect dependency instead of `urls.length`.
   *
   * Previous behaviour: `[urls.length]`
   *   - Effect only re-ran when the NUMBER of files changed.
   *   - If a file was replaced (same count, different URL) the form kept showing
   *     the stale File object from the old URL.
   *   - More critically, in SectionForm the dep was `urls.length` of the
   *     section's server files (always 0 for a fresh section), so it ran once on
   *     mount and never again — files from a previous type selection were never
   *     evicted by this hook (they were only evicted by the full form reset that
   *     is now performed in handleChangeType).
   *
   * New behaviour: `[urlsKey]`
   *   - Effect re-runs whenever the actual URL content changes.
   *   - A boolean `cancelled` flag prevents a stale async callback from calling
   *     setFiles after the component has unmounted or the URLs have changed.
   */
  const urlsKey = urls.map((u) => u.url).join(",");

  useEffect(() => {
    if (urls.length === 0) return;

    let cancelled = false;

    const timeout = setTimeout(async () => {
      const files = await getFilesFromUrl(urls);
      if (!cancelled) {
        setFiles(files);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsKey]);
};
