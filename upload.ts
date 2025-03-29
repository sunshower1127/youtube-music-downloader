import fs from "fs";
import { files } from "./path.ts";
import { uploadMusicWithMetadata, uploadThumbnail } from "./s3.ts";

export default async function upload(artist: string, title: string) {
  const metadata = await loadMetadata(artist, title);
  await Promise.all([uploadMusicWithMetadata(artist, title, metadata), uploadThumbnail(artist, title)]);
}

async function loadMetadata(artist: string, title: string) {
  try {
    const inputPath = files.metadata(artist, title);
    const metadata = await fs.promises.readFile(inputPath, "utf-8");
    return JSON.parse(metadata) as Record<string, any>;
  } catch (error) {
    console.error("Error reading metadata file:", error);
    throw error;
  }
}
