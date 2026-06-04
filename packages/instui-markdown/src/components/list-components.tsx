import { List } from "@instructure/ui-list/v11_7";
import { Checkbox } from "@instructure/ui-checkbox/v11_7";
import { Children, isValidElement, type ReactNode } from "react";
import { onlyElementChildren } from "../helpers.tsx";

export function createUlComponent() {
  return ({ children, className }: { children?: ReactNode; className?: string }) => {
    const isUnstyled = className?.includes("contains-task-list");
    return (
      <List
        as="ul"
        isUnstyled={isUnstyled}
        margin={isUnstyled ? "small none small small" : "small 0"}
      >
        {onlyElementChildren(children)}
      </List>
    );
  };
}

export function createOlComponent() {
  return ({ children }: { children?: ReactNode }) => (
    <List as="ol" margin="small 0">
      {onlyElementChildren(children)}
    </List>
  );
}

export function createLiComponent() {
  return ({ children }: { children?: ReactNode }) => {
    const childArray = Children.toArray(children);
    const isTaskItem = childArray.some(
      (child) =>
        isValidElement(child) && (child.props as Record<string, unknown>).type === "checkbox",
    );

    return (
      <List.Item
        padding={isTaskItem ? "none none x-small" : undefined}
        spacing={isTaskItem ? "none" : undefined}
      >
        {children}
      </List.Item>
    );
  };
}

export function createInputComponent() {
  return ({ type, checked }: { type?: string; checked?: boolean }) => {
    if (type === "checkbox") {
      return <Checkbox size="small" label="" checked={Boolean(checked)} disabled inline />;
    }
    return null;
  };
}
