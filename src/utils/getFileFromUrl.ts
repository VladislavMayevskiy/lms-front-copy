export const getFileFromUrl = async (
  url: string,
  fileName: string,
): Promise<File | undefined> => {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();

    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    return;
  }
};

export const getFilesFromUrl = async (urls: {
  url: string,
  fileName: string,
}[]): Promise<File[] | undefined> => {
  try {
    // const response = await fetch(url);
    const requests = urls.map(({ url }) => fetch(url));
    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (!response.ok) throw new Error("Network response was not ok");
    }

    const blobs = await Promise.all(responses.map((response) => response.blob()));
    const files = blobs.map((blob, index) => {
      return new File([blob], urls[index].fileName, { type: blob.type });
    });

    return files;
  } catch (error) {
    return;
  }
};