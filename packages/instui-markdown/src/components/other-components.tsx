import { View } from "@instructure/ui-view";
import { InlineSVG } from "@instructure/ui-svg-images";
import type { ReactNode } from "react";
import type { SVGProps } from "react";

export function createHrComponent() {
  return () => <View as="hr" margin="1rem 0" borderWidth="small 0 0" borderColor="primary" />;
}

export function createSectionComponent() {
  return ({ children, className }: { children?: ReactNode; className?: string }) => (
    <View
      as="section"
      margin={className?.includes("footnotes") ? "medium 0 0" : "0"}
      borderWidth={className?.includes("footnotes") ? "small 0 0" : "none"}
      borderColor="primary"
      padding={className?.includes("footnotes") ? "small 0 0" : "0"}
    >
      {children}
    </View>
  );
}

export function createSvgComponent() {
  return ({
    children,
    className,
    viewBox,
    width,
    height,
    role,
    ..._props
  }: SVGProps<SVGSVGElement> & { children?: ReactNode } = {}) => (
    <View as="figure">
      <InlineSVG
        inline={false}
        className={className}
        viewBox={viewBox}
        width={width}
        height={height}
        role={role}
      >
        {children}
      </InlineSVG>
    </View>
  );
}
