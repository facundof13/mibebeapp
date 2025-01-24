"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "../theme-provider";
import { Button } from "~/app/_components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const setDark = () => {
    setTheme("dark");
  };

  const setLight = () => {
    setTheme("light");
  };

  return (
    <div>
      {theme === "dark" ? (
        <Button variant="ghost" size="icon" onClick={setLight}>
          <SunIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={setDark}>
          <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      )}
    </div>
  );
}
