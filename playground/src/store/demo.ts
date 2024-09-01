import { createStore } from "@electron-suite/utils";

const id = "demo";

const defaults = {
  foo: {
    bar: "hello world"
  },
  enable: true
};

export const demoStore = createStore({ id, defaults }).store;
