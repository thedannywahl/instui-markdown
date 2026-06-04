import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: false,
    exports: false,
  },
  lint: {
    options: {
      typeAware: false,
      typeCheck: false,
    },
  },
  fmt: {},
});
