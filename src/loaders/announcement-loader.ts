import { readdir, readFile } from "node:fs/promises";
import { extname, isAbsolute, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseFrontmatter } from "astro/markdown";
import type { Loader } from "astro/loaders";

const toPosixPath = (value: string) => value.replaceAll("\\", "/");

function entryId(directoryPath: string, filePath: string) {
  return toPosixPath(relative(directoryPath, filePath))
    .replace(/\.md$/i, "")
    .split("/")
    .map((segment) => segment.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .join("/");
}

async function markdownFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const filePath = `${directoryPath}/${entry.name}`;
    if (entry.isDirectory()) return markdownFiles(filePath);
    return entry.isFile() && extname(entry.name).toLowerCase() === ".md" ? [filePath] : [];
  }));
  return files.flat();
}

export function announcementLoader(directory: string) {
  return {
    name: "announcement-markdown-loader",
    async load({ config, generateDigest, logger, parseData, renderMarkdown, store, watcher }) {
      const directoryUrl = new URL(directory.endsWith("/") ? directory : `${directory}/`, config.root);
      const directoryPath = fileURLToPath(directoryUrl);
      const rootPath = fileURLToPath(config.root);

      const isAnnouncement = (filePath: string) => {
        const pathFromDirectory = relative(directoryPath, filePath);
        return !pathFromDirectory.startsWith("..") && !isAbsolute(pathFromDirectory) && extname(filePath).toLowerCase() === ".md";
      };

      const syncFile = async (filePath: string) => {
        if (!isAnnouncement(filePath)) return;
        const source = await readFile(filePath, "utf8");
        const { frontmatter, content } = parseFrontmatter(source);
        const id = entryId(directoryPath, filePath);
        const data = await parseData({ id, data: frontmatter, filePath });
        const rendered = await renderMarkdown(content, { fileURL: pathToFileURL(filePath) });

        store.set({
          id,
          data,
          body: content,
          digest: generateDigest(source),
          filePath: toPosixPath(relative(rootPath, filePath)),
          rendered,
        });
      };

      store.clear();
      const files = await markdownFiles(directoryPath);
      await Promise.all(files.map(syncFile));
      logger.info(`Loaded ${files.length} announcement Markdown file${files.length === 1 ? "" : "s"}.`);

      if (!watcher) return;
      watcher.add(directoryPath);
      watcher.on("add", syncFile);
      watcher.on("change", syncFile);
      watcher.on("unlink", (filePath) => {
        if (isAnnouncement(filePath)) store.delete(entryId(directoryPath, filePath));
      });
    },
  } satisfies Loader;
}
