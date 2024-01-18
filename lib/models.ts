/// <reference lib="deno.unstable" />

import { IUserPrefs } from "@/lib/types.ts";
import { IPage } from "@/lib/types.ts";

const kv = await Deno.openKv();

const createID = async (projectId: string, model: string) => {
  const result = await kv.get<number | undefined>([
    projectId,
    "index",
    model,
  ]);
  const id = (result.value ?? 0) + 1;
  await kv.set(["index", projectId, model], id);
  return id;
};

function createCRUD<T>(prefix: string) {
  return {
    async post(projectId: string, page: Omit<T, "id">) {
      const id = await createID(projectId, prefix);
      return kv.set([projectId, prefix, id], { ...page, id });
    },

    get(projectId: string, id: number) {
      return kv.get<T>([projectId, prefix, id]);
    },

    put(projectId: string, id: number, page: T) {
      return kv.set([projectId, prefix, id], page);
    },

    delete(projectId: string, id: number) {
      return kv.delete([projectId, prefix, id]);
    },

    all(projectId: string) {
      return kv.list<T>({ prefix: [projectId, prefix] });
    },
  };
}

export const PageModel = createCRUD<IPage>("pages");
export const UserPrefsModel = createCRUD<IUserPrefs>("userprefs");
