import "@/islands/components/fu-editor.js";
import "@/islands/components/fu-select.js";
import "@/islands/components/fu-create-project-form.js";
import "@/islands/components/fu-select-project-form.js";
import "@/islands/components/fu-create-page-form.js";
import "@/islands/components/fu-save-page-form.js";
import "@/islands/components/fu-page-list.js";
import "@/islands/components/fu-alert.js";

__USE_LIVE_RELOAD && new EventSource("/api/esbuild").addEventListener(
  "change",
  () => location.reload(),
);
