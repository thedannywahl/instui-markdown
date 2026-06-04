import { Alert } from "@instructure/ui-alerts/v11_7";
import { Text } from "@instructure/ui-text/v11_7";
import { View } from "@instructure/ui-view";
import type { ReactNode } from "react";
import { ALERT_VARIANTS, stripAlertPrefix } from "../helpers.tsx";

interface BlockquoteComponentOptions {
  showAlertCloseButton: boolean;
}

export function createBlockquoteComponent(options: BlockquoteComponentOptions) {
  return ({ children }: { children?: ReactNode }) => {
    const result = stripAlertPrefix(children);
    if (result.found && result.marker) {
      return (
        <Alert
          variant={ALERT_VARIANTS[result.marker]}
          margin="small small medium"
          renderCloseButtonLabel={options.showAlertCloseButton ? "Close" : undefined}
          onDismiss={options.showAlertCloseButton ? () => undefined : undefined}
        >
          {result.node}
        </Alert>
      );
    }

    return (
      <View
        as="div"
        borderWidth="0 0 0 large"
        borderColor="info"
        padding="xxx-small none xxx-small small"
        margin="small 0 medium small"
      >
        <Text fontStyle="italic">{children}</Text>
      </View>
    );
  };
}
