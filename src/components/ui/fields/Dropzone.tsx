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
} & Omit<ComponentProps<'div'>, 'onChange'> & ( | {
  multiple: true;
  file: File[] | null;
  onChange: (files: File[] | null) => void;
} | {
  multiple?: false;
  onChange: (file: File | null) => void;
  file: File | null;
});

export const Dropzone = ({
  multiple,
  onChange,
  file,
  className,
  handleDeleteFile,
  accept,
  maxFiles,
  maxSize = 10 * 1024 * 1024,
  ...rest
}: Props) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const indexToChangeRef = useRef<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (multiple) {
      if (indexToChangeRef.current || indexToChangeRef.current === 0) {
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
  }, [multiple, onChange, file]);

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
    multiple,
    maxSize,
    maxFiles,
    accept: accept ?? {
      "application/pdf": [],
    }
  });
  const deleteFile = () => {
    if (handleDeleteFile) {
      handleDeleteFile();
    } else {
      setFileUrl(null);
      onChange(null);
    }
  };

  const handleDeleteOne = (index: number) => {
    if (multiple) {
      const files = [...(file || [])];
      files.splice(index, 1);

      onChange(files);
    }
  };

  useEffect(() => {
    if (!multiple && file) {
      setFileUrl(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <>
      {fileUrl && (
        <div
          className={classNames(
            "border! border-middle-blue! rounded-[10px] overflow-hidden relative",
            className,
          )}
        >
          <img
            src={fileUrl}
            alt={Array.isArray(file) ? file[0].name : file?.name}
            className="w-full h-full! object-cover"
          />
          <div className="absolute top-4 right-4 cursor-pointer">
            <ActionMenu
              hideArrowIcon
              trigger={
                <div
                  className={
                    classNames(
                      "w-[30px] h-[30px] border! rounded-xs! bg-white border-border-light-grey!",
                      "flex items-center justify-center"
                    )
                  }
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
      {(Array.isArray(file) && file?.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {file.map((url, index) => (
            <div
              key={`album-img-${index}`}
              className={classNames(
                "border! border-middle-blue! rounded-[10px] overflow-hidden relative max-h-[200px]",
                className,
              )}
            >
              {url.type.match('audio') ? (
                <Audio
                  file={url}
                  onEdit={() => {
                    indexToChangeRef.current = index;
                    inputRef.current?.click();
                  }}
                  onDelete={() => handleDeleteOne(index)}
                />
              ) : url.type.match('video') ? (
                <Video
                  file={url}
                />
              ) : (
                <img
                  src={URL.createObjectURL(url)}
                  alt={url?.name}
                  className="w-full h-full! object-cover"
                />
              )}
              <div
                className={
                  classNames(
                    "absolute top-4 right-4 cursor-pointer",
                    {
                      "hidden": url.type.match('audio'),
                    }
                  )
                }
              >
                <ActionMenu
                  hideArrowIcon
                  trigger={

                    <div
                      className={
                        classNames(
                          "w-[30px] h-[30px] border! rounded-xs! bg-white border-border-light-grey!",
                          "flex items-center justify-center"
                        )
                      }
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
            "hidden": fileUrl,
          },
          className,
        )}
        {...rest}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <div className="flex-col justify-start items-start gap-2 flex">
          <div className="text-primary text-sm font-normal font-[Lato]">Choose a file or drag it here</div>
        </div>
      </div>
    </>
  );
};

function Audio({ file, onEdit, onDelete }: { file: File; onEdit: () => void; onDelete: () => void; }) {
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
        <EditIcon
          onClick={onEdit}
          className="w-7 h-7 cursor-pointer"
        />
        <DeleteIcon
          onClick={onDelete}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

function Video({ file }: { file: File; }) {
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
      <video controls src={audioSource} className="w-full max-h-[200px] object-contain">
        Your browser does not support the video element.
      </video>
    </div>
  );
};