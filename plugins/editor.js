import { defineNuxtPlugin } from "#app";
import { LightEditor, LightEditorPlugin } from "@hannanmiah/light-editor";
import "@hannanmiah/light-editor/dist/style.css";

export default defineNuxtPlugin((nuxtapp) => {
  nuxtapp.vueApp.component("LightEditor", LightEditor);
});
