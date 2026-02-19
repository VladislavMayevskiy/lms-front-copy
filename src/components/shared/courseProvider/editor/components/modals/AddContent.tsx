import { useState } from "react";
import classNames from "classnames";
import { useFormContext } from "react-hook-form";
import Modal from "components/ui/modal";
import { SectionTypesByName } from "constants/section";
import { content } from "../../constants/content";
import { useAddContentModal } from "../../hooks/useAddContentModal";
import type { ContentType } from "../../types/content";
import type { SectionSchema } from "../../validation/section.schema";

export const AddContentModal = () => {
  const [selectedContent, setContent] = useState<ContentType | null>(null);
  const { isOpen, onClose } = useAddContentModal();
  const { setValue } = useFormContext<SectionSchema>();

  const handleClose = () => {
    setContent(null);
    onClose();
  };

  const handlePick = (item: ContentType) => {
    setContent(item);

    setValue("type", SectionTypesByName[item.type], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4 px-[22px] py-[17px]">
        <h2 className="font-[Lato] text-[28px]! font-semibold!">Add Content</h2>

        <div className="flex flex-col gap-4 py-4 border-b! border-light-blue!">
          <span className="font-[Lato] text-lg font-normal">
            {selectedContent?.title}
          </span>

          <div className="grid grid-cols-4 gap-3">
            {content.map((item) => (
              <div
                key={`content-${item.type}`}
                className={classNames(
                  "flex flex-col items-center justify-center gap-3 w-[133px]",
                  "border! border-middle-blue! bg-extralight-blue rounded-md! p-5",
                  "cursor-pointer",
                  {
                    "border-primary!": selectedContent?.type === item.type,
                  }
                )}
                onClick={() => handlePick(item)}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-white">
                  {item.icon}
                </div>
                <span className="font-[Lato] text-base font-normal text-center min-h-[40px] leading-5 flex items-center">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
