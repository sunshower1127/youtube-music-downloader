import ytdl from "@distube/ytdl-core";

export async function getMetadata(urlOrId: string) {
  const {
    videoDetails: {
      title,
      author: { name: author },
    },
  } = await ytdl.getBasicInfo(urlOrId);

  return { title, author };
}

export async function getAudioStream(urlOrId: string) {
  const readable = ytdl(urlOrId, {
    filter: (f) => {
      return f.container === "webm" && !f.hasVideo && f.hasAudio && f.audioQuality === "AUDIO_QUALITY_MEDIUM";
    },
  });

  return readable;
}
