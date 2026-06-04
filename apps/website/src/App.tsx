import "./style.css";
import { InstuiMarkdown, type InstuiMarkdownRenderOptions } from "instui-markdown";
import { Button, CloseButton } from "@instructure/ui-buttons";
import { Checkbox } from "@instructure/ui-checkbox/v11_7";
import { SourceCodeEditor } from "@instructure/ui-source-code-editor/v11_7";
import { SimpleSelect } from "@instructure/ui-simple-select/v11_7";
import { TextInput } from "@instructure/ui-text-input/v11_7";
import { useState } from "react";
import { Flex } from "@instructure/ui-flex/v11_7";
import { Heading } from "@instructure/ui-heading/v11_7";
import { Text } from "@instructure/ui-text/v11_7";
import { Tray } from "@instructure/ui-tray/v11_7";
import { Link } from "@instructure/ui-link/v11_7";
import type { DarkTheme, LightTheme } from "@instructure/ui-themes";
import { View } from "@instructure/ui-view";
import DEFAULT_MD from "./default.md?raw";

type AppProps = {
  instuiTheme: DarkTheme | LightTheme;
};

export function App({ instuiTheme }: AppProps) {
  const [md, setMd] = useState(DEFAULT_MD);
  const [isOptionsTrayOpen, setIsOptionsTrayOpen] = useState(false);
  const semantics = instuiTheme.newTheme.semantics(instuiTheme.newTheme.primitives);
  const sharedTokens = instuiTheme.newTheme.sharedTokens(semantics);
  const pageBackground = sharedTokens.background.pageColor;
  const [renderOptions, setRenderOptions] = useState<InstuiMarkdownRenderOptions>({
    alert: {
      closeButton: false,
    },
    table: {
      display: "auto",
      hover: false,
      sortable: true,
    },
    link: {
      externalIcon: true,
      permalinks: true,
      permalinkClassName: "mdx-heading-anchor",
    },
    code: {
      editable: false,
      readOnly: true,
      lineNumbers: true,
      lineWrapping: true,
      spellCheck: false,
      highlightActiveLine: false,
      direction: "ltr",
    },
    color: {
      enabled: true,
    },
    icons: {
      enabled: true,
      color: undefined,
    },
  });

  return (
    <View
      as="div"
      height="100vh"
      width="100vw"
      background="primary"
      themeOverride={{ backgroundPrimary: pageBackground ?? "#ffffff" }}
    >
      <Flex id="app" direction="column" height="100vh" padding="medium none none medium">
        <Flex.Item id="header">
          <Flex direction="column" gap="small">
            <Flex.Item>
              <Heading level="h1">InstUI Markdown Playground</Heading>
              <Text>
                Render plain markdown with{" "}
                <Link href="https://instructure.design">InstUI components</Link>. Several
                configurable options are available.{" "}
                <Link href="https://github.com/thedannywahl/instui-markdown">View on GitHub</Link>.
              </Text>
            </Flex.Item>
            <Flex.Item>
              <View as="div" margin="small 0 medium">
                <Button color="secondary" onClick={() => setIsOptionsTrayOpen(true)}>
                  Open render options
                </Button>
              </View>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item shouldGrow shouldShrink>
          <Flex id="playground" gap="medium" margin="small" alignItems="start">
            <Flex.Item id="editor" shouldGrow shouldShrink width="50%">
              <SourceCodeEditor
                label="Markdown source"
                language="markdown"
                value={md}
                onChange={setMd}
                lineNumbers
                lineWrapping
                height="100%"
              />
            </Flex.Item>
            <Flex.Item id="preview" shouldGrow shouldShrink width="50%">
              <InstuiMarkdown renderOptions={renderOptions}>{md}</InstuiMarkdown>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
      <Tray
        label="Render options"
        placement="end"
        size="regular"
        open={isOptionsTrayOpen}
        onDismiss={() => setIsOptionsTrayOpen(false)}
        shouldContainFocus
        shouldReturnFocus
        shouldCloseOnDocumentClick
      >
        <View as="div" padding="medium">
          <Flex direction="column" gap="medium">
            <Flex.Item>
              <Flex justifyItems="space-between" alignItems="center">
                <Flex.Item shouldGrow>
                  <Heading level="h2">Render Options</Heading>
                </Flex.Item>
                <Flex.Item>
                  <CloseButton
                    screenReaderLabel="Close"
                    onClick={() => setIsOptionsTrayOpen(false)}
                  />
                </Flex.Item>
              </Flex>
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Alert
              </Heading>
              <Checkbox
                label="Alert close button"
                checked={Boolean(renderOptions.alert?.closeButton)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    alert: {
                      ...prev.alert,
                      closeButton: checked,
                    },
                  }));
                }}
              />
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Table
              </Heading>
              <SimpleSelect
                renderLabel="Table display"
                value={renderOptions.table?.display ?? "auto"}
                onChange={(_event, data) => {
                  const display = (data.value as "auto" | "stacked" | "fixed") ?? "auto";
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    table: {
                      ...prev.table,
                      display,
                    },
                  }));
                }}
              >
                <SimpleSelect.Option id="table-display-auto" value="auto">
                  auto
                </SimpleSelect.Option>
                <SimpleSelect.Option id="table-display-stacked" value="stacked">
                  stacked
                </SimpleSelect.Option>
                <SimpleSelect.Option id="table-display-fixed" value="fixed">
                  fixed
                </SimpleSelect.Option>
              </SimpleSelect>
              <Checkbox
                label="Table hover"
                checked={Boolean(renderOptions.table?.hover)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    table: {
                      ...prev.table,
                      hover: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Table sortable"
                checked={Boolean(renderOptions.table?.sortable)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    table: {
                      ...prev.table,
                      sortable: checked,
                    },
                  }));
                }}
              />
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Link
              </Heading>
              <Checkbox
                label="External link icon"
                checked={Boolean(renderOptions.link?.externalIcon)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    link: {
                      ...prev.link,
                      externalIcon: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Heading permalinks"
                checked={Boolean(renderOptions.link?.permalinks)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    link: {
                      ...prev.link,
                      permalinks: checked,
                    },
                  }));
                }}
              />
              <TextInput
                renderLabel="Permalink class"
                value={renderOptions.link?.permalinkClassName ?? ""}
                onChange={(_event, value) => {
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    link: {
                      ...prev.link,
                      permalinkClassName: value,
                    },
                  }));
                }}
              />
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Code
              </Heading>
              <Checkbox
                label="Code editable"
                checked={Boolean(renderOptions.code?.editable)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      editable: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Code readOnly"
                checked={Boolean(renderOptions.code?.readOnly)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      readOnly: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Code line numbers"
                checked={Boolean(renderOptions.code?.lineNumbers)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      lineNumbers: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Code line wrapping"
                checked={Boolean(renderOptions.code?.lineWrapping)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      lineWrapping: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Code spell check"
                checked={Boolean(renderOptions.code?.spellCheck)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      spellCheck: checked,
                    },
                  }));
                }}
              />
              <Checkbox
                label="Highlight active line"
                checked={Boolean(renderOptions.code?.highlightActiveLine)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      highlightActiveLine: checked,
                    },
                  }));
                }}
              />
              <SimpleSelect
                renderLabel="Code direction"
                value={renderOptions.code?.direction ?? "ltr"}
                onChange={(_event, data) => {
                  const direction = (data.value as "ltr" | "rtl") ?? "ltr";
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    code: {
                      ...prev.code,
                      direction,
                    },
                  }));
                }}
              >
                <SimpleSelect.Option id="code-direction-ltr" value="ltr">
                  ltr
                </SimpleSelect.Option>
                <SimpleSelect.Option id="code-direction-rtl" value="rtl">
                  rtl
                </SimpleSelect.Option>
              </SimpleSelect>
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Color
              </Heading>
              <Checkbox
                label="Color tokens"
                checked={Boolean(renderOptions.color?.enabled)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    color: {
                      ...prev.color,
                      enabled: checked,
                    },
                  }));
                }}
              />
            </Flex.Item>

            <Flex.Item>
              <Heading level="h3" margin="0 0 x-small">
                Icons
              </Heading>
              <Checkbox
                label="Icon tokens"
                checked={Boolean(renderOptions.icons?.enabled)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    icons: {
                      ...prev.icons,
                      enabled: checked,
                    },
                  }));
                }}
              />
              <TextInput
                renderLabel="Icon color (hex)"
                value={renderOptions.icons?.color ?? ""}
                onChange={(_event, value) => {
                  setRenderOptions((prev: InstuiMarkdownRenderOptions) => ({
                    ...prev,
                    icons: {
                      ...prev.icons,
                      color: value,
                    },
                  }));
                }}
              />
            </Flex.Item>
          </Flex>
        </View>
      </Tray>
    </View>
  );
}
