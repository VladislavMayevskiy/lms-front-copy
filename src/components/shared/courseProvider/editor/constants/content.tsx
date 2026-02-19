import TextIcon from "assets/imgs/courseProvider/text.svg?react";
import ImageIcon from "assets/imgs/courseProvider/image.svg?react";
import AlbumIcon from "assets/imgs/courseProvider/album.svg?react";
import VideoIcon from "assets/imgs/courseProvider/video.svg?react";
import DocumentIcon from "assets/imgs/courseProvider/document.svg?react";
import AudioIcon from "assets/imgs/courseProvider/audio.svg?react";
import EmbedIcon from "assets/imgs/courseProvider/embed.svg?react";
import type { ContentType } from "../types/content";

export const content: ContentType[]  = [
  {
    title: "Title & Text",
    type: "TITLE_AND_TEXT",
    icon: <TextIcon />,
  },
  {
    title: "Image",
    type: "IMAGE",
    icon: <ImageIcon />,
  },
  {
    title: "Album",
    type: "ALBUM",
    icon: <AlbumIcon />,
  },
  {
    title: "Video",
    type: "VIDEO",
    icon: <VideoIcon />,
  },
  {
    title: "Document",
    type: "DOCUMENT",
    icon: <DocumentIcon />,
  },
  {
    title: "Audio",
    type: "AUDIO",
    icon: <AudioIcon />,
  },
  {
    title: "Embed",
    type: "EMBED",
    icon: <EmbedIcon />,
  },
  {
    title: "Note For Teacher",
    type: "NOTE_FOR_TEACHER",
    icon: <TextIcon />,
  }
];

export const ImageTypes = {
  "image/*": [".webp", ".jpeg", ".jpg", ".png", ".gif", ".bmp"],
};

export const AudioTypes = {
  "audio/*": [".mp3", ".wav"],
};

export const VideoTypes = {
  "video/*": [".mp4", ".mov", ".avi"],
};

export const DocumentTypes = {
  "application/*": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"],
};
