import ytdl from "@distube/ytdl-core";

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

export async function getAudioStream(urlOrId: string) {
  const readable = ytdl(urlOrId, {
    filter: (f) => {
      return f.container === "webm" && !f.hasVideo && f.hasAudio && f.audioQuality === "AUDIO_QUALITY_MEDIUM";
    },
  });

  return readable;
}
