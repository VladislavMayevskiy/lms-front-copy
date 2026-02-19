import { useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Reorder } from "framer-motion";
import { Section } from "./Section";
import { SectionForm } from "./SectionForm";
import { useSectionsQuery, useReorderSections } from "api/courseProvider/sections/hooks";
import type { SectionType } from "types/models/Section";
import { useSections } from "../../hooks/useSections";

export const Sections = () => {
  const isReorderRef = useRef<boolean>(false);
  const { sections, setSections } = useSections();
  const { unitId } = useParams();
  const unitID = useMemo(() => Number(unitId), [unitId]);
  const { data, isLoading } = useSectionsQuery(unitID);

  const { mutate: reorderSections } = useReorderSections();

  const handleReorder = () => {
    if (isReorderRef.current) {
      const ids = sections.map((section) => section.id);
      reorderSections({ unitId: unitID, ids }, {
        onSuccess: () => {
          isReorderRef.current = false;
        },
      });
    }
  };

  const onReorder = (newOrder: SectionType[]) => {
    isReorderRef.current = true;
    setSections(newOrder);
  };

  useEffect(() => {
    if (data.data.length !== sections.length && !isLoading) {
      setSections(data.data);
    }
  }, [data.data, isLoading]);

  return (
    <div className="flex flex-col col-span-2 gap-5">
      <Reorder.Group
        values={sections}
        onReorder={onReorder}
        className="flex flex-col gap-5"
        as="div"
        axis="y"
        onMouseUp={handleReorder}
        onTouchEnd={handleReorder}
      >
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
          />
        ))}
      </Reorder.Group>
      <SectionForm length={data.data.length} />
    </div>
  );
};