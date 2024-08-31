import { createReactiveStore } from "@electron-suite/utils";

const defaults = {
  text: "content",
  foo: {
    bar: 123456,
    abc: true as boolean
  }
};

export const demoStore = createReactiveStore({
  id: "demo",
  defaults
});
