import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import { files } from "./path.ts";
import { downloadMusic } from "./youtube.ts";

export default async function download(youtubeLink: string, artist: string, title: string, thumbnail: string, isCropRequired: boolean) {
  const [{ moodValue }, { meanHue }] = await Promise.all([
    (async () => {
      await downloadMusic(youtubeLink, artist, title);
      return extractMoodValue(artist, title);
    })(),
    downloadAndCropThumbnail(thumbnail, artist, title, isCropRequired),
  ]);

  await saveMetadata(artist, title, { meanHue, moodValue });
}

// async function getOriginalVolume(artist: string, title: string) {
//   const execAsync = promisify(exec);
//   const inputPath = files.music(artist, title);

//   const command = `ffmpeg -i "${inputPath}" -af volumedetect -f null /dev/null`;
//   try {
//     const { stderr } = await execAsync(command);
//     // stderr에서 mean_volume을 찾아서 반환합니다.
//     const regex = /mean_volume:\s(-?\d+(\.\d+)?) dB/;
//     const match = regex.exec(stderr);
//     if (match) {
//       const meanVolume = parseFloat(match[1]);
//       return meanVolume;
//     } else {
//       throw new Error("원래 볼륨을 감지할 수 없습니다.");
//     }
//   } catch (error) {
//     console.error("원래 볼륨 측정 중 에러:", error);
//     throw error;
//   }
// }

// async function normalizeVolume(artist: string, title: string, targetVolume: number) {
//   const execAsync = promisify(exec);
//   const inputPath = files.music(artist, title);
//   const outputPath = files.normalizedMusic(artist, title);

//   const command = `ffmpeg -i "${inputPath}" -filter:a "volume=${targetVolume}dB:precision=double" -c:a aac "${outputPath}"`;
//   try {
//     // 먼저 원래 볼륨을 측정합니다.
//     const originalVolume = await getOriginalVolume(artist, title);
//     await execAsync(command);
//     return { originalVolume, newVolume: targetVolume };
//   } catch (error) {
//     console.error("볼륨 정규화 중 에러 발생:", error);
//     throw error;
//   }
// }

async function extractMoodValue(artist: string, title: string) {
  const execAsync = promisify(exec);
  const inputPath = files.music(artist, title);
  const command = `python3 "mood-extractor/main.py" "${inputPath}"`;
  try {
    const { stdout } = await execAsync(command);
    return { moodValue: +stdout };
  } catch (error) {
    console.error("음악 감정 추출 중 에러 발생:", error);
    throw error;
  }
}

async function downloadAndCropThumbnail(thumbnail: string, artist: string, title: string, isCropRequired: boolean) {
  const execAsync = promisify(exec);
  const outputPath = files.thumbnail(artist, title);
  let command = `python3 "thumbnail-editor/main.py" "${thumbnail}" "${outputPath}" ${isCropRequired ? "crop" : ""}`;

  try {
    const { stdout } = await execAsync(command);
    return { meanHue: +stdout };
  } catch (error) {
    console.error("Thumbnail processing error:", error);
    throw error;
  }
}

async function saveMetadata(artist: string, title: string, metadata: object) {
  // Save the updated metadata to the file
  try {
    const outputPath = files.metadata(artist, title);
    await fs.promises.writeFile(outputPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error("Error writing metadata file:", error);
    throw error;
  }
}
