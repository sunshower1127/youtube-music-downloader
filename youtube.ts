import { spawn } from "child_process";
import { files } from "./path.ts";

export async function getMetadata(urlOrId: string) {
  return new Promise<{ title: string; artist: string; thumbnail: string }>((resolve, reject) => {
    const ytDlp = spawn("yt-dlp", [
      "--print",
      "%(title)s",
      "--print",
      "%(uploader)s",
      "--print",
      "%(thumbnail)s",
      "--no-download",
      "--no-playlist",
      `${urlOrId}`,
    ]);

    let output = "";

    ytDlp.stdout.on("data", (data) => {
      output += data.toString();
    });

    ytDlp.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp process exited with code ${code}`));
        return;
      }

      const [title, artist, thumbnail] = output.trim().split("\n");

      resolve({ title, artist, thumbnail });
    });
  });
}

export async function downloadMusic(urlOrId: string, artist: string, title: string) {
  return new Promise<void>(async (resolve, reject) => {
    let ytDlp = spawn("yt-dlp", ["-f", "234", "-o", files.music(artist, title), "--no-playlist", urlOrId]);
    let error = false;

    ytDlp.on("close", async (code) => {
      if (code !== 0 || error) {
        reject(new Error(`음원 다운로드중 오류 발생: ${error}`));
        return;
      }

      resolve();
    });
  });
}
