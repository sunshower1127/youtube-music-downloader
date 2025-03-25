import { exec } from "child_process";
import { promisify } from "util";
import { files } from "./path.ts";

const execAsync = promisify(exec);

export async function fetchMetadata(urlOrId: string) {
  try {
    const command = `yt-dlp --print "%(title)s" --print "%(uploader)s" --print "%(thumbnail)s" --no-download --no-playlist "${urlOrId}"`;
    const { stdout } = await execAsync(command);

    let [title, artist, thumbnail] = stdout.trim().split("\n");
    artist = artist.split(" - ")[0];

    return { title, artist, thumbnail };
  } catch (error) {
    throw new Error(`yt-dlp 메타데이터 추출 중 오류 발생: ${error.message}`);
  }
}

export async function downloadMusic(urlOrId: string, artist: string, title: string) {
  try {
    const outputPath = files.music(artist, title);
    const command = `yt-dlp -f 234 -o "${outputPath}" --no-playlist "${urlOrId}"`;
    await execAsync(command);
  } catch (error) {
    throw new Error(`음원 다운로드중 오류 발생: ${error.message}`);
  }
}
