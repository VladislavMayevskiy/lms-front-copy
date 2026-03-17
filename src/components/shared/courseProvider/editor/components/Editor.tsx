import classNames from "classnames";
import { EditorHeader } from "./EditorHeader";
import { SidePanel } from "./SidePanel";
import { Sections } from "./sections";
import { QuizModal } from "./modals/quiz";
import { ConfirmQuizDeleteModal } from "./modals/ConfirmQuizDelete";
import { TranslationsModal } from "components/shared/courseProvider/translations/TranslationsModal";

type Props = {
  unitId: number;
};

export const Editor = ({ unitId }: Props) => {
  return (
    <div className="flex flex-col gap-10">
      <EditorHeader />
      <div
        className={
          classNames(
            "grid grid-cols-3 mx-auto",
            "bg-white/40 py-9 px-[42px] gap-8 rounded-[20px]",
            "min-w-[1000px]"
          )
        }
      >
        <Sections />
        <SidePanel />
      </div>
      <QuizModal
        unitId={unitId}
      />
      <ConfirmQuizDeleteModal
        unitId={unitId}
      />
      <TranslationsModal />
    </div>
  );
};