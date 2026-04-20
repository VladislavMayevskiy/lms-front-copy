import { useMemo } from "react";
import MenImage from "assets/imgs/men.png";
import { authStore } from "stores/authStore";

/**
 * Stable profile image URL for Student/Teacher surfaces.
 *
 * Uses auth store primitives (not React Query timestamps) so avatar `src` does not change
 * on harmless current-user refetches — avoids flicker, remounts, and reloads on navigation.
 *
 * Pass `extraBust > 0` only when the file at the same URL was replaced (e.g. after profile upload).
 */
export function useUserAvatarSrc(extraBust = 0) {
  const image = authStore((s) => s.user?.image ?? null);
  const userId = authStore((s) => s.user?.id ?? null);

  return useMemo(() => {
    const img = image?.trim();
    if (!img) {
      return { src: MenImage, key: `avatar-u-${userId ?? "anon"}-default` as const };
    }
    if (extraBust > 0) {
      const sep = img.includes("?") ? "&" : "?";
      const src = `${img}${sep}_v=${extraBust}`;
      return { src, key: `avatar-u-${userId}-bust-${extraBust}` };
    }
    return { src: img, key: `avatar-u-${userId}-img` };
  }, [image, userId, extraBust]);
}
