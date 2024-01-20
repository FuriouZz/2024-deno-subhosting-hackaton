import "@/src/components/fu-editor.js";
import "@/src/components/fu-select.js";
import "@/src/components/fu-create-project-form.js";
import "@/src/components/fu-select-project-form.js";
import "@/src/components/fu-create-page-form.js";
import "@/src/components/fu-save-page-form.js";
import "@/src/components/fu-page-list.js";
import "@/src/components/fu-alert.js";

__USE_LIVE_RELOAD && new EventSource("/api/esbuild").addEventListener(
  "change",
  () => location.reload(),
);
