import fs from "fs";
import path from "path";

export const dirs = {
  root: "data",
  music: path.join("data", "musics"),
  normalizedMusic: path.join("data", "normalized_musics"),
  thumbnail: path.join("data", "thumbnails"),
  metadata: path.join("data", "metadata"),
};

export const files = {
  music: (artist: string, title: string) => path.join(dirs.music, `${artist}_${title}.mp4`),
  normalizedMusic: (artist: string, title: string) => path.join(dirs.normalizedMusic, `${artist}_${title}.mp4`),
  thumbnail: (artist: string, title: string) => path.join(dirs.thumbnail, `${artist}_${title}.webp`),
  metadata: (artist: string, title: string) => path.join(dirs.metadata, `${artist}_${title}.json`),
};

export function makeRequiredDirs() {
  for (const dir of Object.values(dirs)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
