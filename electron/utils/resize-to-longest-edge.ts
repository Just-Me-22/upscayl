import fs from "fs";
import sharp from "sharp";
import logit from "./logit";

export const resizeToLongestEdge = async (
  filePath: string,
  targetLongestEdge: number,
) => {
  if (!targetLongestEdge || targetLongestEdge <= 0) return;
  if (!fs.existsSync(filePath)) return;

  const image = sharp(filePath, { failOn: "none", limitInputPixels: false });
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (width === 0 || height === 0) return;
  if (Math.max(width, height) === targetLongestEdge) return;

  const buffer = await image
    .resize(targetLongestEdge, targetLongestEdge, {
      fit: "inside",
      kernel: "lanczos3",
      withoutEnlargement: false,
    })
    .toBuffer();
  await fs.promises.writeFile(filePath, buffer);
  logit(
    `📐 Resized to longest edge ${targetLongestEdge}px: `,
    `${filePath} (from ${width}x${height})`,
  );
};

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "tif",
  "tiff",
]);

export const resizeFolderToLongestEdge = async (
  folderPath: string,
  targetLongestEdge: number,
) => {
  if (!targetLongestEdge || targetLongestEdge <= 0) return;
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const ext = file.split(".").pop()?.toLowerCase();
    if (!ext || !IMAGE_EXTENSIONS.has(ext)) continue;
    await resizeToLongestEdge(folderPath + "/" + file, targetLongestEdge);
  }
};
