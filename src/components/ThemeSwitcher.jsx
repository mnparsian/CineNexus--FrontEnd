import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="flex items-center gap-2">
      <Sun className={`w-5 h-5 text-yellow-400 transition-opacity ${isDark ? "opacity-0" : "opacity-100"}`} />

      <Switch checked={isDark} onCheckedChange={() => setIsDark(!isDark)} className="transition-all" />

      <Moon className={`w-5 h-5 text-gray-300 transition-opacity ${isDark ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
