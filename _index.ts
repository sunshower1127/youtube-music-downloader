import download from "./download.ts";
import { makeRequiredDirs } from "./path.ts";
import { promptArtistTitle, promptCropThumbnail, promptTargetVolume, promptYoutubeLink } from "./prompt.ts";
import upload from "./upload.ts";
import { fetchMetadata } from "./youtube.ts";

makeRequiredDirs();

while (true) {
  const { youtubeLink } = await promptYoutubeLink();
  const { artist: _artist, title: _title, thumbnail } = await fetchMetadata(youtubeLink);
  const { artist, title } = await promptArtistTitle(_artist, _title);
  const { isCropRequired } = await promptCropThumbnail();
  const { targetVolume } = await promptTargetVolume();

  (async () => {
    await download(youtubeLink, artist, title, thumbnail, isCropRequired, targetVolume);
    await upload(artist, title);
  })();

  console.log("--------------------------\n");
}
