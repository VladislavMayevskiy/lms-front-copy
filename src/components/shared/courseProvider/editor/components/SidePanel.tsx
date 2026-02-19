import { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { Dropzone } from "components/ui/fields/Dropzone";
import { MainButton } from "components/ui/button";
// import CalendarIcon from "assets/imgs/courseProvider/calendar.svg?react";
import QuizIcon from "assets/imgs/courseProvider/quiz.svg?react";
import { useUnitQuery} from "api/courseProvider/units/hooks";
// import { useAddUnitImage } from "api/courseProvider/units/hooks";
import { useUnit } from "../hooks/useUnit";
// import { useFile } from "hooks/useFile";
import { useQuizModal } from "../hooks/useQuizModal";
import { useUnitQuiz } from "api/courseProvider/units/hooks";

export const SidePanel = () => {
  const { unitId } = useParams();
  const unitID = useMemo(() => Number(unitId), [unitId]);

  const { data } = useUnitQuery(unitID);
  const { data: quizResponse } = useUnitQuiz(unitID);

  const setUnit = useUnit((store) => store.setUnit);
  const openQuizModal = useQuizModal((store) => store.openModal);
  // const [img, setImg] = useState<File | null>(null);
  // const { mutate: addUnitImage } = useAddUnitImage();

  // const handleAddImage = (image: File | null) => {
  //   const formData = new FormData();

  //   if (image) {
  //     formData.append('image', image);
  //     addUnitImage({
  //       unitId: unitID,
  //       image: formData,
  //     });
  //   }
  // };
  // const fileName = (data?.image || '').split('/').pop() || '';

  // useFile({
  //   fileUrl: data?.image,
  //   fileName,
  //   setFile: setImg,
  // });

  useEffect(() => {
    if (data.id) {
      setUnit(data);
    }
  }, [data]);

  const hasQuiz = (quizResponse?.data?.length ?? 0) > 0;
  return (
    <div className="flex flex-col gap-5">
      {/* <div className="flex flex-col gap-5 border! border-dusty-blue! rounded-[10px] px-8 py-10 bg-white">
        <span className="font-normal text-[20px] font-[Lato]">Side panel image</span>
        <Dropzone
          file={img}
          onChange={handleAddImage}
          accept={{ "image/*": [] }}
          className="max-w-[236px]"
        />
      </div> */}
      {/* <MainButton className="border! border-orange! bg-white! flex items-center gap-3 py-3.5! h-auto!">
        <CalendarIcon />
        <span className="text-orange! text-base font-[Lato] font-semibold">Include Calendar</span>
      </MainButton> */}
      <MainButton
        className="border! border-primary! bg-white! flex items-center gap-3 py-3.5! h-auto!"
        onClick={openQuizModal}
      >
        <QuizIcon />
        <span className="text-primary! text-base font-[Lato] font-semibold">{hasQuiz ? "Edit Quiz" : "Include Quiz"}</span>
      </MainButton>
    </div>
  );
};