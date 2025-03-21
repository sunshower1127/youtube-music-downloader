import { spawn } from "child_process";

export async function getMetadata(urlOrId: string) {
  return new Promise<{ title: string; author: string; thumbnail: string }>((resolve, reject) => {
    const ytDlp = spawn("yt-dlp", ["--print", "%(title)s", "--print", "%(uploader)s", "--print", "%(thumbnail)s", "--no-download", "--no-playlist", `${urlOrId}`]);

    let output = "";

    ytDlp.stdout.on("data", (data) => {
      output += data.toString();
    });

    ytDlp.stderr.on("data", (data) => {
      console.error(`yt-dlp: ${data}`);
    });

    ytDlp.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp process exited with code ${code}`));
        return;
      }

      const [title, author, thumbnail] = output.trim().split("\n");

      resolve({ title, author, thumbnail });
    });
  });
}

export async function getAudio(urlOrId: string) {
  return new Promise<Buffer>(async (resolve, reject) => {
    const ytDlp = spawn("yt-dlp", ["-f", "251", "-o", "-", "--no-playlist", urlOrId]); // 251: medium quality webm audio only

    const chunks: Buffer[] = [];

    ytDlp.stdout.on("data", (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    ytDlp.stderr.on("data", (data) => {
      console.error(`yt-dlp: ${data}`);
    });

    ytDlp.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp process exited with code ${code}`));
        return;
      }

      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
}
