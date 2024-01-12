import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";
import { join, relative } from "lume/deps/path.ts";

export interface Options {
  /**
   * Root path where files are located
   * @default Deno.cwd()
   */
  rootPath?: string;

  /**
   * Files that needs to be overrided or created if missing
   * @default []
   */
  entries: string[];
}

export const defaults: Required<Options> = {
  rootPath: ".",
  entries: [],
};

export default function override(userOptions?: Options) {
  const { rootPath, entries } = merge(defaults, userOptions);
  const files = new Map<string, string>();

  let absRootPath: string;

  const append = (site: Site, path: string) => {
    const file = relative(absRootPath, path);
    site.remoteFile(file, path);
    files.set(`/${join(rootPath, file)}`, `/${file}`);
  };

  const walkDir = (site: Site, dir: string) => {
    for (const entry of Deno.readDirSync(dir)) {
      if (entry.isFile) {
        append(site, join(dir, entry.name));
        continue;
      }

      if (entry.isDirectory) {
        walkDir(site, join(dir, entry.name));
      }
    }
  };

  return (site: Site) => {
    absRootPath = join(site.src(), rootPath);
    site.ignore(rootPath);

    for (const entry of entries.map((entry) => join(absRootPath, entry))) {
      try {
        const info = Deno.statSync(entry);

        if (info.isFile) {
          append(site, entry);
          continue;
        }

        if (info.isDirectory) {
          walkDir(site, entry);
        }
      } catch (_) {
        console.warn("Entry does not exist: ", entry);
      }
    }

    site.addEventListener("afterUpdate", (e) => {
      const entries = [...e.files]
        .filter((file) => files.has(file))
        .map((file) => files.get(file)!);
      if (entries.length > 0) {
        site.update(new Set(entries));
      }
    });
  };
}
