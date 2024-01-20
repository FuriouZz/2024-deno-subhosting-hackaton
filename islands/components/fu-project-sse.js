import { LitElement } from "lit";
import { DeployementsSignal, PagesSignal } from "@/islands/lib/store.js";

globalThis.customElements.define(
  "fu-project-sse",
  class extends LitElement {
    static properties = {
      projectId: { attribute: "project-id" },
    };

    firstUpdated() {
      this.createSource();
    }

    updated(changed) {
      if (changed.has("projectId")) {
        if (this.source) this.source.close();
        this.createSource();
      }
    }

    createSource() {
      this.source = new EventSource(
        `/api/projects/${this.projectId}/sse`,
      );

      this.source.addEventListener("pages_change", (e) => {
        try {
          PagesSignal(JSON.parse(e.data));
        } catch (e) {
          console.warn(e);
        }
      });

      this.source.addEventListener("deployments_change", (e) => {
        try {
          DeployementsSignal(JSON.parse(e.data));
        } catch (e) {
          console.warn(e);
        }
      });
    }
  },
);
