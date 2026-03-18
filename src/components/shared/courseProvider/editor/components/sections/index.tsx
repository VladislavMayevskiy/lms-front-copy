import { useMemo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Reorder } from "framer-motion";
import { Button } from "@chakra-ui/react";
import { Section } from "./Section";
import { SectionForm } from "./SectionForm";
import { AddContentModal } from "../modals/AddContent";
import { useSectionsQuery, useReorderSections } from "api/courseProvider/sections/hooks";
import type { SectionType, SectionTypes } from "types/models/Section";
import { useSections } from "../../hooks/useSections";
import { SectionTypesByName } from "constants/section";
import PlusIcon from "assets/imgs/plus.svg?react";

/**
 * A pending section is one that the user has started but has not yet been
 * persisted to the backend.  Each entry gets a stable `clientTempId` generated
 * on creation so that React always uses a unique key — never an array index.
 *
 * Using a unique key per pending section means React creates a FRESH component
 * instance (including a fresh useForm) for every new section, which fully
 * prevents form-state sharing between sections.
 */
type PendingSection = {
  clientTempId: string;
  type: number;
};

const generateClientTempId = (): string =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

export const Sections = () => {
  const isReorderRef = useRef<boolean>(false);
  const { sections, setSections } = useSections();
  const { unitId } = useParams();
  const unitID = useMemo(() => Number(unitId), [unitId]);
  const { data, isLoading } = useSectionsQuery(unitID);

  const [pendingSections, setPendingSections] = useState<PendingSection[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { mutate: reorderSections } = useReorderSections();

  const handleReorder = () => {
    if (isReorderRef.current) {
      const ids = sections.map((section) => section.id);
      reorderSections(
        { unitId: unitID, ids },
        {
          onSuccess: () => {
            isReorderRef.current = false;
          },
        }
      );
    }
  };

  const onReorder = (newOrder: SectionType[]) => {
    isReorderRef.current = true;
    setSections(newOrder);
  };

  /**
   * Reconciliation fix: use an ID-fingerprint comparison instead of a
   * length-only check.
   *
   * Previous code (`data.data.length !== sections.length`) only synced the
   * Zustand store when sections were added or deleted.  Edits (same count,
   * different content) were never reflected in the store.
   *
   * The ID-fingerprint approach:
   *  - Correctly updates after add / delete / reorder (IDs or order change).
   *  - Avoids an infinite render loop: `data.data` is a new array reference on
   *    every render (produced by mapFromSections), so a naive "always update"
   *    would call setSections → Zustand re-render → effect fires again → loop.
   *    Comparing by joined ID string breaks the cycle.
   *  - Respects the reorder flag so in-flight drag operations are not clobbered
   *    by a concurrent refetch.
   */
  useEffect(() => {
    if (isLoading || isReorderRef.current) return;

    const incomingIds = data.data.map((s) => s.id).join(",");
    const currentIds = sections.map((s) => s.id).join(",");

    if (incomingIds !== currentIds) {
      console.debug("[Sections] Syncing sections from API:", {
        incoming: incomingIds,
        current: currentIds,
      });
      setSections(data.data);
    }
  }, [data.data, isLoading, sections, setSections]);

  /**
   * Add a new pending section.  The user already chose the type from the
   * AddContentModal, so we immediately render a fresh SectionForm for it.
   */
  const addPendingSection = (type: SectionTypes) => {
    const clientTempId = generateClientTempId();
    console.debug("[Sections] Adding pending section:", { clientTempId, type });
    setPendingSections((prev) => [
      ...prev,
      { clientTempId, type: SectionTypesByName[type] },
    ]);
    setIsAddModalOpen(false);
  };

  const removePendingSection = (clientTempId: string) => {
    console.debug("[Sections] Removing pending section:", clientTempId);
    setPendingSections((prev) =>
      prev.filter((s) => s.clientTempId !== clientTempId)
    );
  };

  return (
    <div className="flex flex-col col-span-2 gap-5">
      {/* ── Persisted sections (draggable) ── */}
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

      {/*
       * ── Pending (unsaved) sections ──
       *
       * Each SectionForm is keyed by its stable clientTempId — NOT by array
       * index.  This guarantees a fresh React component instance (and therefore
       * a fresh useForm) for every new section the user creates, preventing any
       * form-state leakage between sections.
       */}
      {pendingSections.map((pending, index) => (
        <SectionForm
          key={pending.clientTempId}
          clientTempId={pending.clientTempId}
          initialType={pending.type}
          position={data.data.length + index}
          onSaved={() => removePendingSection(pending.clientTempId)}
          onDelete={() => removePendingSection(pending.clientTempId)}
        />
      ))}

      {/* ── Add section button ── */}
      <div className="flex items-center justify-center gap-5">
        <Button
          borderRadius={"10px"}
          bgColor={"#F27D3B"}
          _hover={{ bgColor: "#F27D3B", opacity: 0.8 }}
          textColor={"white"}
          height={"44px"}
          leftIcon={<PlusIcon />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add section
        </Button>
      </div>

      {/*
       * Single AddContentModal for the global "Add section" action.
       * Each SectionForm manages its own separate modal for "Change Content".
       */}
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelect={addPendingSection}
      />
    </div>
  );
};
