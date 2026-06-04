import { Heading } from "@instructure/ui-heading/v11_7";
import type { ReactNode } from "react";

export function createHeadingComponent(level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  if (level === "h6") {
    return ({ children, id }: { children?: ReactNode; id?: string }) => (
      <Heading as="h6" level="h5" margin="small 0" id={id}>
        {children}
      </Heading>
    );
  }

  return ({ children, id }: { children?: ReactNode; id?: string }) => (
    <Heading level={level} margin="small 0" id={id}>
      {children}
    </Heading>
  );
}
