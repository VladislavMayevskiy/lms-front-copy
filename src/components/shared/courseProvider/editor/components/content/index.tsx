import type { ReactElement } from "react";
import type { SectionTypes } from "types/models/Section";
import { TitleAndText } from "./TitleAndText";
import { Image } from "./Image";
import { Album } from "./Album";
import { Video } from "./Video";
import { Document } from "./Document";
import { Audio } from "./Audio";
import { Embed } from "./Embed";

export const Content: Record<SectionTypes, ReactElement> = {
  "TITLE_AND_TEXT": <TitleAndText />,
  "IMAGE": <Image />,
  "ALBUM": <Album />,
  "VIDEO": <Video />,
  "DOCUMENT": <Document />,
  "AUDIO": <Audio />,
  "EMBED": <Embed />,
  "NOTE_FOR_TEACHER": <TitleAndText />,
};