import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { InstUISettingsProvider } from "@instructure/emotion";
import { dark, light } from "@instructure/ui-themes";

type ResolvedInstUITheme = "light" | "dark";

function resolvePreferredTheme(): ResolvedInstUITheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function AppBootstrap() {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedInstUITheme>(resolvePreferredTheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setResolvedTheme(media.matches ? "dark" : "light");
    updateTheme();

    media.addEventListener("change", updateTheme);
    return () => {
      media.removeEventListener("change", updateTheme);
    };
  }, []);

  const instuiTheme = useMemo(() => (resolvedTheme === "dark" ? dark : light), [resolvedTheme]);

  return (
    <InstUISettingsProvider theme={instuiTheme}>
      <App
        instuiTheme={instuiTheme}
        resolvedTheme={resolvedTheme}
        onToggleTheme={() => setResolvedTheme((t) => (t === "dark" ? "light" : "dark"))}
      />
    </InstUISettingsProvider>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
);
