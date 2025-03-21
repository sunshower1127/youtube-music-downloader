import ytdl from "@distube/ytdl-core";
import { extractAudio, streamToBuffer } from "./util.ts";

export async function getMetadata(urlOrId: string) {
  const {
    videoDetails: {
      title,
      author: { name: author },
      thumbnails,
    },
  } = await ytdl.getBasicInfo(urlOrId);

  const thumbnail = thumbnails[thumbnails.length - 1].url;

  return { title, author, thumbnail };
}

export async function getAudio(urlOrId: string) {
  let readable = ytdl(urlOrId, {
    filter: (f) => {
      return f.container === "webm" && !f.hasVideo && f.hasAudio && f.audioQuality === "AUDIO_QUALITY_MEDIUM";
    },
  });

  try {
    // Issue: https://github.com/fent/node-ytdl-core/issues/1230
    return await streamToBuffer(readable);
  } catch (error) {
    console.error("Failed to download audio. Instead, trying to extract audio from video...");

    readable = ytdl(urlOrId, {
      quality: "highest",
    });

    readable = await extractAudio(readable);
    return await streamToBuffer(readable);
  }
}
