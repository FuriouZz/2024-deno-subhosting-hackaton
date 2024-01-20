/// <reference lib="deno.unstable" />

import { IUserPrefs } from "@/lib/types.ts";
import { IDeployment, IPage } from "@/lib/types.ts";

const kv = await Deno.openKv("./tmp/db.sql");

const createID = async (projectId: string, prefix: string) => {
  const key = [projectId, "metadata", prefix];
  const result = await kv.get<{ index: number; count: number }>(key);
  const value = result.value ?? { index: 0, count: 0 };
  value.index++;
  value.count++;
  await kv.set(key, value);
  return value.index;
};

const decrementCount = async (projectId: string, prefix: string) => {
  const key = [projectId, "metadata", prefix];
  const result = await kv.get<{ index: number; count: number }>(key);
  if (!result.value) return;
  result.value.count--;
  await kv.set(key, result.value);
};

function createCRUD<T>(prefix: string) {
  const crud = {
    async post(
      projectId: string,
      page: Omit<T, "id" | "createdAt" | "updatedAt">,
    ) {
      const id = await createID(projectId, prefix);
      const createdAt = new Date();
      return kv.set([projectId, prefix, id], {
        ...page,
        id,
        createdAt,
        updatedAt: createdAt,
      });
    },

    get(projectId: string, id: number) {
      return kv.get<T>([projectId, prefix, id]);
    },

    put(projectId: string, id: number, page: Partial<T>) {
      const updatedAt = new Date();
      return kv.set([projectId, prefix, id], { ...page, updatedAt });
    },

    async delete(projectId: string, id: number) {
      const result = await kv.delete([projectId, prefix, id]);
      await decrementCount(projectId, prefix);
      return result;
    },

    all(projectId: string, options?: Deno.KvListOptions | undefined) {
      return kv.list<T>({ prefix: [projectId, prefix] }, options);
    },

    async allArray(
      projectId: string,
      options?: Deno.KvListOptions | undefined,
    ) {
      const entries: T[] = [];
      for await (const entry of crud.all(projectId, options)) {
        entries.push(entry.value);
      }
      return entries;
    },
  };

  return crud;
}

export const PageModel = createCRUD<IPage>("pages");
export const UserPrefsModel = createCRUD<IUserPrefs>("userprefs");

export async function watchProject(
  projectId: string,
  hooks: {
    onPageChanges: (entries: IPage[]) => void;
    onDeploymentChanges: (entries: IDeployment[]) => void;
  },
) {
  const metadataKey = [projectId, "metadata", "pages"];
  const deploymentsKey = [projectId, "deployments"];

  for await (
    const [pagesChange, deploymentsChange] of kv.watch([
      metadataKey,
      deploymentsKey,
    ])
  ) {
    if (pagesChange.versionstamp !== null) {
      const entries: IPage[] = await PageModel.allArray(projectId, {
        reverse: true,
      });
      hooks.onPageChanges(entries);
    }

    if (deploymentsChange.value !== null) {
      hooks.onDeploymentChanges(deploymentsChange.value! as IDeployment[]);
    }
  }
}

export function updateDeployments(
  projectId: string,
  deployments: IDeployment[],
) {
  return kv.set([projectId, "deployments"], deployments);
}
