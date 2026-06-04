import { Img } from "@instructure/ui-img";
import { View } from "@instructure/ui-view";

export function createImgComponent() {
  return ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => {
    if (!src) {
      return null;
    }

    return (
      <View as="span" margin="small 0" display="block">
        <Img src={src} alt={alt ?? ""} title={title} display="block" constrain="cover" />
      </View>
    );
  };
}
