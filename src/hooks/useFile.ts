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
  }[],
  setFiles: (files?: File[]) => void;
}) => {
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const files = await getFilesFromUrl(urls);

      setFiles(files);
    }, 500);

    return () => clearTimeout(timeout);
  }, [urls.length]);
};
