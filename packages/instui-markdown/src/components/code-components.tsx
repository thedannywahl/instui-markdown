import { Badge } from "@instructure/ui-badge/v11_7";
import { Text } from "@instructure/ui-text/v11_7";
import { SourceCodeEditor } from "@instructure/ui-source-code-editor/v11_7";
import { View } from "@instructure/ui-view";
import type { ReactNode } from "react";
import {
  isInlineCode,
  mapCodeLanguage,
  normalizeCodeValue,
  normalizeColorForSwatch,
} from "../helpers.tsx";

interface CodeComponentOptions {
  showColorCodes: boolean;
  codeEditable: boolean;
  codeReadOnly: boolean;
  codeLineNumbers?: boolean;
  codeLineWrapping?: boolean;
  codeSpellCheck?: boolean;
  codeHighlightActiveLine?: boolean;
  codeDirection?: "ltr" | "rtl";
}

export function createCodeComponent(options: CodeComponentOptions) {
  return ({ children, className }: { children?: ReactNode; className?: string }) => {
    const inline = isInlineCode(children, className);
    if (inline) {
      const inlineCodeValue = normalizeCodeValue(children).trim();
      const normalizedInlineColor = options.showColorCodes
        ? normalizeColorForSwatch(inlineCodeValue)
        : undefined;

      if (normalizedInlineColor) {
        return (
          <>
            <Text as="code">{children}</Text>{" "}
            <Badge
              standalone
              type="notification"
              variant="primary"
              pulse={false}
              themeOverride={{ colorPrimary: normalizedInlineColor }}
            />
          </>
        );
      }

      return <Text as="code">{children}</Text>;
    }

    return (
      <SourceCodeEditor
        label="Code"
        language={mapCodeLanguage(className)}
        value={normalizeCodeValue(children)}
        readOnly={options.codeReadOnly}
        editable={options.codeEditable}
        lineNumbers={options.codeLineNumbers}
        lineWrapping={options.codeLineWrapping}
        spellCheck={options.codeSpellCheck}
        highlightActiveLine={options.codeHighlightActiveLine}
        direction={options.codeDirection}
      />
    );
  };
}

export function createPreComponent() {
  return ({ children }: { children?: ReactNode }) => (
    <View as="div" margin="small 0">
      {children}
    </View>
  );
}
