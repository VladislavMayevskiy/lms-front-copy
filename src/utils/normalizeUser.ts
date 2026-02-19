export const normalizeTheme = (theme?: string): "light" | "dark" => {
  if (theme === "dark") return "dark";
  return "light";
};
