import { Box, Heading, Image, Text, Link } from "@chakra-ui/react";
import type { UiUnitSection } from "types/models/Section";
import { useTranslation } from "react-i18next";

function SectionShell({
  children,
  withBorder = true,
}: {
  children: React.ReactNode;
  withBorder?: boolean;
}) {
  return (
    <Box
      mb="12px"
      pb="10px"
      {...(withBorder
        ? { borderBottom: "1px solid #B4D6DF" }
        : { borderBottom: "none" })}
    >
      {children}
    </Box>
  );
}

export default function SectionRenderer({ section }: { section: UiUnitSection }) {
  const { t } = useTranslation();

  switch (section.type) {
    case "TITLE_AND_TEXT":
      return (
        <SectionShell>
          {section.title ? (
            <Heading fontSize="18px" fontFamily="Lato" mb={2}>
              {section.title}
            </Heading>
          ) : null}

          <Box
            fontFamily="Lato"
            fontSize="14px"
            color="#434645"
            dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
            className="ql-editor"
            sx={{
                p: "0 !important",
                "& p:first-of-type": { mt: 0 },
                "& p:last-child": { mb: 0 },
              }}
          />
        </SectionShell>
      );

    case "IMAGE":
      return (
        <SectionShell>
          <Image src={section.files?.[0]?.url} borderRadius="12px" />
        </SectionShell>
      );

    case "VIDEO":
      return (
        <SectionShell>
          <video controls width="100%">
            <source src={section.files?.[0]?.url} />
          </video>
        </SectionShell>
      );

    case "AUDIO":
      return (
        <SectionShell>
          <audio controls style={{ width: "100%" }}>
            <source src={section.files?.[0]?.url} />
          </audio>
        </SectionShell>
      );

    case "DOCUMENT":
      return (
        <SectionShell>
          <Text fontFamily="Lato" mb={1}>
            {section.files?.[0]?.name ?? "Document"}
          </Text>
          <Link href={section.files?.[0]?.url} isExternal color="#0070C1">
            {t("user.courses.render.openDocument")}
          </Link>
        </SectionShell>
      );

    case "EMBED":
      return (
        <SectionShell>
          <Box dangerouslySetInnerHTML={{ __html: section.content ?? "" }} />
        </SectionShell>
      );

    case "ALBUM":
      return (
        <SectionShell>
          <Text fontFamily="Lato" fontWeight="bold" mb={2}>
            {t("user.courses.render.album")}
          </Text>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="10px">
            {section.files?.map((f) => (
              <Image key={f.id} src={f.url} borderRadius="10px" />
            ))}
          </Box>
        </SectionShell>
      );

    case "NOTE_FOR_TEACHER":
      return (
        <SectionShell>
          <Box border="1px solid #B4D6DF" borderRadius="10px" p="12px">
            <Text fontFamily="Lato" fontWeight="bold" mb={1}>
              {t("user.courses.render.noteForTeacher")}
            </Text>
            <Text fontFamily="Lato" fontSize="14px" color="#434645">
              {section.content ?? ""}
            </Text>
          </Box>
        </SectionShell>
      );

    default:
      return null;
  }
}
