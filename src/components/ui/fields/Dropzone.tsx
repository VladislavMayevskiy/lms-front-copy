import { useCallback, useState, useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import classNames from "classnames";
import { ActionMenu } from "components/ui/actionMenu";
import UploadIcon from "assets/imgs/courseProvider/upload.svg?react";
import OptionsIcon from "assets/imgs/options.svg?react";
import EditIcon from "assets/imgs/admin/edit.svg?react";
import DeleteIcon from "assets/imgs/delete.svg?react";

type Props = {
  handleDeleteFile?: () => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  /**
   * URL of an already-persisted (server-side) asset to show as a preview.
   *
   * Used in single-file mode only.  When provided and no local `file` has been
   * selected yet, the Dropzone displays this URL directly in the <img> tag
   * without any client-side fetch — avoiding CORS issues with blob storage URLs.
   *
   * As soon as the user drops / selects a new local file, the local object-URL
   * preview takes over.  If the user explicitly deletes the preview, the
   * persisted URL is cleared from display (the underlying saved asset is not
   * automatically deleted from the backend — that requires an explicit API call).
   */
  previewUrl?: string;
} & Omit<ComponentProps<"div">, "onChange"> &
  (
    | {
        multiple: true;
        file: File[] | null;
        onChange: (files: File[] | null) => void;
      }
    | {
        multiple?: false;
        onChange: (file: File | null) => void;
        file: File | null;
      }
  );

export const Dropzone = ({
  multiple,
  onChange,
  file,
  className,
  handleDeleteFile,
  accept,
  maxFiles,
  maxSize = 10 * 1024 * 1024,
  previewUrl,
  ...rest
}: Props) => {
  /**
   * `fileUrl` drives the image preview panel.
   *
   * Priority:
   *   1. Local file selected by user → URL.createObjectURL(file) — most recent
   *   2. previewUrl prop (remote URL from backend) — no fetch required
   *   3. null — show the upload dropzone
   *
   * `userCleared`: once the user explicitly deletes the current preview, we
   * must NOT restore the persisted previewUrl on subsequent renders even if the
   * prop value hasn't changed.  This flag prevents that re-appearance.
   */
  const [fileUrl, setFileUrl] = useState<string | null>(
    !multiple && !file && previewUrl ? previewUrl : null
  );
  const [userCleared, setUserCleared] = useState(false);
  const indexToChangeRef = useRef<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        if (
          indexToChangeRef.current !== null
        ) {
          const files = [...(file || [])];
          files[indexToChangeRef.current] = acceptedFiles[0];
          indexToChangeRef.current = null;
          onChange(files);
        } else {
          onChange([...(file || []), ...acceptedFiles]);
        }
      } else {
        onChange(acceptedFiles[0]);
      }
    },
    [multiple, onChange, file]
  );

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
    multiple,
    maxSize,
    maxFiles,
    accept: accept ?? {
      "application/pdf": [],
    },
  });

  const deleteFile = () => {
    if (handleDeleteFile) {
      handleDeleteFile();
    } else {
      setUserCleared(true);
      setFileUrl(null);
      onChange(null as never);
    }
  };

  const handleDeleteOne = (index: number) => {
    if (multiple) {
      const files = [...(file || [])];
      files.splice(index, 1);
      onChange(files);
    }
  };

  /**
   * Sync `fileUrl` whenever the local `file` prop or the `previewUrl` changes.
   *
   * - Local file takes highest priority (user just selected something).
   * - previewUrl is used as fallback for already-saved content, unless the user
   *   explicitly cleared the display in this session (userCleared = true).
   */
  useEffect(() => {
    if (multiple) return;

    if (file) {
      // User selected a new local file — reset the cleared flag and show preview
      setUserCleared(false);
      setFileUrl(URL.createObjectURL(file as File));
    } else if (previewUrl && !userCleared) {
      // No local file; show the persisted remote URL directly (no fetch needed)
      setFileUrl(previewUrl);
    } else {
      setFileUrl(null);
    }
  }, [file, previewUrl, multiple, userCleared]);

  return (
    <>
      {fileUrl && (
        <div
          className={classNames(
            "border! border-middle-blue! rounded-[10px] overflow-hidden relative",
            className
          )}
        >
          <img
            src={fileUrl}
            alt={Array.isArray(file) ? file[0]?.name : file?.name ?? "preview"}
            className="w-full h-full! object-cover"
          />
          <div className="absolute top-4 right-4 cursor-pointer">
            <ActionMenu
              hideArrowIcon
              trigger={
                <div
                  className={classNames(
                    "w-[30px] h-[30px] border! rounded-xs! bg-white border-border-light-grey!",
                    "flex items-center justify-center"
                  )}
                >
                  <OptionsIcon />
                </div>
              }
              items={[
                {
                  label: "Change",
                  onClick: () => {
                    inputRef.current?.click();
                  },
                },
                {
                  label: "Delete",
                  onClick: deleteFile,
                },
              ]}
            />
          </div>
        </div>
      )}
      {Array.isArray(file) && file?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {file.map((url, index) => (
            <div
              key={`album-img-${index}`}
              className={classNames(
                "border! border-middle-blue! rounded-[10px] overflow-hidden relative max-h-[200px]",
                className
              )}
            >
              {url.type.match("audio") ? (
                <Audio
                  file={url}
                  onEdit={() => {
                    indexToChangeRef.current = index;
                    inputRef.current?.click();
                  }}
                  onDelete={() => handleDeleteOne(index)}
                />
              ) : url.type.match("video") ? (
                <Video file={url} />
              ) : (
                <img
                  src={URL.createObjectURL(url)}
                  alt={url?.name}
                  className="w-full h-full! object-cover"
                />
              )}
              <div
                className={classNames("absolute top-4 right-4 cursor-pointer", {
                  hidden: url.type.match("audio"),
                })}
              >
                <ActionMenu
                  hideArrowIcon
                  trigger={
                    <div
                      className={classNames(
                        "w-[30px] h-[30px] border! rounded-xs! bg-white border-border-light-grey!",
                        "flex items-center justify-center"
                      )}
                    >
                      <OptionsIcon />
                    </div>
                  }
                  items={[
                    {
                      label: "Change",
                      onClick: () => {
                        indexToChangeRef.current = index;
                        inputRef.current?.click();
                      },
                    },
                    {
                      label: "Delete",
                      onClick: () => handleDeleteOne(index),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        className={classNames(
          "cursor-pointer relative w-full bg-grey flex flex-col justify-center items-center gap-2",
          "px-4 py-3 border! border-middle-blue! rounded-[10px] h-[200px]",
          {
            hidden: fileUrl,
          },
          className
        )}
        {...rest}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <div className="flex-col justify-start items-start gap-2 flex">
          <div className="text-primary text-sm font-normal font-[Lato]">
            Choose a file or drag it here
          </div>
        </div>
      </div>
    </>
  );
};

function Audio({
  file,
  onEdit,
  onDelete,
}: {
  file: File;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = () => {
      if (audioRef.current) {
        audioRef.current.src = reader.result as string;
        audioRef.current.load();
      }
    };

    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="flex gap-4 items-center m-2">
      <audio controls ref={audioRef} className="w-full h-[45px]">
        Your browser does not support the audio element.
      </audio>
      <div className="flex gap-2 items-center">
        <EditIcon onClick={onEdit} className="w-7 h-7 cursor-pointer" />
        <DeleteIcon onClick={onDelete} className="cursor-pointer" />
      </div>
    </div>
  );
}

function Video({ file }: { file: File }) {
  const [audioSource, setAudioSource] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = () => {
      setAudioSource(reader.result as string);
    };

    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="flex gap-4 items-center m-2">
      <video
        controls
        src={audioSource}
        className="w-full max-h-[200px] object-contain"
      >
        Your browser does not support the video element.
      </video>
    </div>
  );
}
