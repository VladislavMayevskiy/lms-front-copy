import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Text,
  HStack,
  VStack,
  Select,
} from "@chakra-ui/react";
import Modal from "components/ui/modal";
import { TextField } from "components/ui/fields/TextField";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { MainButton } from "components/ui/button";
import { Spinner } from "components/ui/spinner";
import { useTranslationsModal } from "./useTranslationsModal";
import {
  useCourseTranslations,
  useUpdateCourseTranslation,
  useModuleTranslations,
  useUpdateModuleTranslation,
  useSectionTranslations,
  useUpdateSectionTranslation,
  useUnitTranslations,
  useUpdateUnitTranslation,
} from "api/courseProvider/translations/hooks";
import type { TranslationEntityType, ApiTranslationItem } from "api/courseProvider/translations/types";
import { useGetLanguages } from "api/admin/languages/hooks";

// ── Field config per entity ───────────────────────────────────────────────────

type TranslationFieldConfig = {
  key: string;
  label: string;
  multiline?: boolean;
};

type TranslationEntityConfig = {
  title: string;
  fields: TranslationFieldConfig[];
};

const ENTITY_CONFIGS: Record<TranslationEntityType, TranslationEntityConfig> = {
  course: {
    title: "Course Translations",
    fields: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", multiline: true },
      { key: "about", label: "About this course", multiline: true },
      { key: "achievements", label: "What you'll achieve", multiline: true },
    ],
  },
  module: {
    title: "Module Translations",
    fields: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  unit: {
    title: "Unit Translations",
    fields: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  section: {
    title: "Section Translations",
    fields: [
      { key: "title", label: "Title" },
      { key: "content", label: "Content", multiline: true },
    ],
  },
};

// ── Hook selector: picks the right query/mutation pair for the entity type ────
// All four useQuery calls must be called unconditionally (Rules of Hooks).
// They are individually disabled when not active via enabled: Boolean(id).

function useEntityTranslations(entityType: TranslationEntityType | null, entityId: number | null) {
  const courseResult = useCourseTranslations(
    entityType === "course" && entityId ? entityId : 0,
  );
  const moduleResult = useModuleTranslations(
    entityType === "module" && entityId ? entityId : 0,
  );
  const sectionResult = useSectionTranslations(
    entityType === "section" && entityId ? entityId : 0,
  );
  const unitResult = useUnitTranslations(
    entityType === "unit" && entityId ? entityId : 0,
  );

  switch (entityType) {
    case "course":  return courseResult;
    case "module":  return moduleResult;
    case "section": return sectionResult;
    case "unit":    return unitResult;
    default:        return courseResult;
  }
}

// ── Inner editor – rendered with a key to reset when language changes ─────────

type EditorProps = {
  entityType: TranslationEntityType;
  entityId: number;
  language: string;
  existing: ApiTranslationItem | undefined;
  fields: TranslationFieldConfig[];
};

const TranslationEditor = ({ entityType, entityId, language, existing, fields }: EditorProps) => {
  // Initialise from existing data. Component is keyed by language so it
  // fully re-mounts (and resets) when the user switches language tabs.
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach(({ key }) => {
      initial[key] = existing ? (existing[key] ?? "") : "";
    });
    return initial;
  });

  const { mutate: updateCourse, isPending: isPendingCourse } = useUpdateCourseTranslation();
  const { mutate: updateModule, isPending: isPendingModule } = useUpdateModuleTranslation();
  const { mutate: updateSection, isPending: isPendingSection } = useUpdateSectionTranslation();
  const { mutate: updateUnit, isPending: isPendingUnit } = useUpdateUnitTranslation();

  const isPending =
    isPendingCourse || isPendingModule || isPendingSection || isPendingUnit;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const payload = { ...values };

    const onSuccess = () =>
      toast.success("Translation saved successfully");
    const onError = (err: Error) =>
      toast.error(err.message || "Failed to save translation");

    switch (entityType) {
      case "course":
        updateCourse({ courseId: entityId, language, payload }, { onSuccess, onError });
        break;
      case "module":
        updateModule({ moduleId: entityId, language, payload }, { onSuccess, onError });
        break;
      case "section":
        updateSection({ sectionId: entityId, language, payload }, { onSuccess, onError });
        break;
      case "unit":
        updateUnit({ unitId: entityId, language, payload }, { onSuccess, onError });
        break;
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      {fields.map(({ key, label, multiline }) =>
        multiline ? (
          <TextAreatField
            key={key}
            label={label}
            placeholder={`Enter ${label.toLowerCase()}`}
            value={values[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
            fieldContainerClassName="h-24"
          />
        ) : (
          <TextField
            key={key}
            label={label}
            placeholder={`Enter ${label.toLowerCase()}`}
            value={values[key] ?? ""}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ),
      )}
      <MainButton
        isLoading={isPending}
        disabled={isPending}
        onClick={handleSave}
        className="self-center!"
      >
        Save Translation
      </MainButton>
    </VStack>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────

export const TranslationsModal = () => {
  const { isOpen, entityType, entityId, entityLabel, closeModal } = useTranslationsModal();

  // "" means "auto-select first available translation language"
  const [selectedLanguageOverride, setSelectedLanguageOverride] = useState<string>("");

  const { data, isLoading, isError } = useEntityTranslations(entityType, entityId);

  // Resolve language codes → display labels (e.g. "ko" → "Korean")
  const { data: adminLanguagesData } = useGetLanguages();
  const languageLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    (adminLanguagesData?.data ?? []).forEach((lang) => {
      map.set(lang.value, lang.label);
    });
    return map;
  }, [adminLanguagesData]);

  const getLanguageLabel = (code: string) =>
    languageLabelMap.get(code) ?? code.toUpperCase();

  const translations = useMemo<ApiTranslationItem[]>(
    () => data?.data ?? [],
    [data],
  );

  // Prefer explicit user selection, then auto-select the first available translation
  const selectedLanguage = useMemo(
    () => selectedLanguageOverride || translations[0]?.language || "",
    [selectedLanguageOverride, translations],
  );

  if (!entityType || !entityId) return null;

  const config = ENTITY_CONFIGS[entityType];
  const title = entityLabel ? `${config.title}: ${entityLabel}` : config.title;
  const existingTranslation = translations.find((t) => t.language === selectedLanguage);

  const handleClose = () => {
    setSelectedLanguageOverride("");
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <Box px={10} pb={10} pt={4} className="flex flex-col gap-6">

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {isLoading && (
          <Box display="flex" justifyContent="center" py={8}>
            <Spinner isLoading size={60} />
          </Box>
        )}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {!isLoading && isError && (
          <Text color="red.500" textAlign="center" fontFamily="Lato">
            Failed to load translations. Please try again.
          </Text>
        )}

        {/* ── Success ──────────────────────────────────────────────────────── */}
        {!isLoading && !isError && (
          <>
            {translations.length === 0 ? (
              // ── EMPTY STATE ───────────────────────────────────────────────
              // Backend creates translations via its own mechanism.
              // PUT is update-only; there is nothing to show or create here.
              <Text color="gray.500" textAlign="center" fontFamily="Lato" py={4}>
                No translations available yet.
              </Text>
            ) : (
              // ── EDIT EXISTING TRANSLATIONS ────────────────────────────────
              <VStack align="stretch" spacing={6}>
                {/* Language selector */}
                <HStack spacing={3} align="center">
                  <Text
                    fontFamily="Lato"
                    fontWeight="bold"
                    fontSize="14px"
                    whiteSpace="nowrap"
                  >
                    Language:
                  </Text>
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguageOverride(e.target.value)}
                    borderColor="#B4D6DF"
                    borderRadius="10px"
                    bg="#F5F7F9"
                    fontFamily="Lato"
                    fontSize="14px"
                  >
                    {translations.map((t) => (
                      <option key={t.language} value={t.language}>
                        {getLanguageLabel(t.language)}
                      </option>
                    ))}
                  </Select>
                </HStack>

                {/* Editable fields for the selected language.
                    key prop resets the form on language switch. */}
                {selectedLanguage && (
                  <TranslationEditor
                    key={`${entityType}-${entityId}-${selectedLanguage}`}
                    entityType={entityType}
                    entityId={entityId}
                    language={selectedLanguage}
                    existing={existingTranslation}
                    fields={config.fields}
                  />
                )}
              </VStack>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};
