import download from "./download.ts";
import { makeRequiredDirs } from "./path.ts";
import { promptArtistTitle, promptCropThumbnail, promptYoutubeLink } from "./prompt.ts";
import upload from "./upload.ts";
import { getMetadata } from "./youtube.ts";

makeRequiredDirs();

while (true) {
  const { youtubeLink } = await promptYoutubeLink();
  const { artist: _artist, title: _title, thumbnail } = await getMetadata(youtubeLink);
  const { artist, title } = await promptArtistTitle(_artist, _title);
  const { isCropRequired } = await promptCropThumbnail();

  (async () => {
    await download(youtubeLink, artist, title, thumbnail, isCropRequired);
    await upload(artist, title);
  })();

  console.log("--------------------------\n");
}
