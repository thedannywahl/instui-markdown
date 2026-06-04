import { Text } from "@instructure/ui-text/v11_7";
import type { ReactNode } from "react";

export function createSpanComponent() {
  return ({ children }: { children?: ReactNode }) => {
    return <Text as="span">{children}</Text>;
  };
}

export function createEmComponent() {
  return ({ children }: { children?: ReactNode }) => (
    <Text as="span" fontStyle="italic">
      {children}
    </Text>
  );
}

export function createStrongComponent() {
  return ({ children }: { children?: ReactNode }) => (
    <Text as="span" weight="bold">
      {children}
    </Text>
  );
}

export function createDelComponent() {
  return ({ children }: { children?: ReactNode }) => <Text as="del">{children}</Text>;
}

export function createInsComponent() {
  return ({ children }: { children?: ReactNode }) => <Text as="ins">{children}</Text>;
}

export function createSubComponent() {
  return ({ children }: { children?: ReactNode }) => <Text as="sub">{children}</Text>;
}

export function createSupComponent() {
  return ({ children }: { children?: ReactNode }) => <Text as="sup">{children}</Text>;
}

export function createPComponent() {
  return ({ children }: { children?: ReactNode }) => <Text as="p">{children}</Text>;
}
