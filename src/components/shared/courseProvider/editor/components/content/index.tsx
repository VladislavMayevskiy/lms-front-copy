import type { ComponentType } from "react";
import type { SectionTypes } from "types/models/Section";
import { TitleAndText } from "./TitleAndText";
import { Image } from "./Image";
import { Album } from "./Album";
import { Video } from "./Video";
import { Document } from "./Document";
import { Audio } from "./Audio";
import { Embed } from "./Embed";
import { NoteForTeacher } from "./NoteForTeacher";

/**
 * Map from section type name to the React component that renders it.
 *
 * Using ComponentType references (not pre-created elements) ensures that each
 * SectionForm / Section renders its OWN independent component instance and
 * that the component tree is always under the correct FormProvider.
 */
export const ContentComponents: Record<SectionTypes, ComponentType> = {
  "TITLE_AND_TEXT": TitleAndText,
  "IMAGE": Image,
  "ALBUM": Album,
  "VIDEO": Video,
  "DOCUMENT": Document,
  "AUDIO": Audio,
  "EMBED": Embed,
  "NOTE_FOR_TEACHER": NoteForTeacher,
};
