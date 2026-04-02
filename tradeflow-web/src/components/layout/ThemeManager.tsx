import { useEffect } from "react";
import { useStore } from "../../stores/useStore";

export function ThemeManager() {
  const isDark = useStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-[#0B0E17]");
      document.body.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-[#0B0E17]");
      document.body.style.colorScheme = "light";
    }
  }, [isDark]);

  return null;
}
