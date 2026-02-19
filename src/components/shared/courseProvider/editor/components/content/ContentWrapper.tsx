import type { PropsWithChildren } from "react";
// import { Reorder } from "framer-motion";
// import { ActionMenu } from "components/ui/actionMenu";
// import OptionsIcon from "assets/imgs/options.svg?react";

type Props = {
  onDeleteContent?: () => void;
};

export const ContentWrapper = ({ children }: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col relative gap-10 max-w-[745px]">
      {/* <div className="absolute top-5 right-5">
        <ActionMenu
          hideArrowIcon
          trigger={
            <div className="w-[30px] h-[30px] flex items-center justify-center">
              <OptionsIcon />
            </div>
          }
          items={[
            {
              label: "Delete Section",
              onClick: onDeleteContent,
            },
          ]}
        />
      </div> */}
      {children}
    </div>
  );
};