import inquirer from "inquirer";
import { cropImage, getAverageColor } from "./image-edit.ts";
import { uploadMusic, uploadThumbnail } from "./store.ts";
import { getMusicValue } from "./util.ts";
import { getAudio, getMetadata } from "./youtube.ts";

while (true) {
  let { youtubeLink } = await inquirer.prompt([
    {
      type: "input",
      name: "youtubeLink",
      message: "Enter YouTube link or ID:",
      validate: (input) => (input.length > 0 ? true : "Please enter a link or ID!"),
    },
  ]);
  youtubeLink = youtubeLink.trim();

  let { author, title, thumbnail } = await getMetadata(youtubeLink);
  author = author.split("-")[0].trim();
  title = title.trim();

  console.log(`Found information: Artist - "${author}", Title - "${title}"`);

  const { saveOption } = await inquirer.prompt([
    {
      type: "list",
      name: "saveOption",
      message: "How would you like to save?",
      choices: [
        { name: `Save with current info ("${author}" / "${title}")`, value: "current" },
        { name: "Save after editing", value: "edit" },
      ],
    },
  ]);

  let finalAuthor = author,
    finalTitle = title;
  if (saveOption === "edit") {
    let confirmed = false;
    while (!confirmed) {
      let response = await inquirer.prompt([
        {
          type: "input",
          name: "newAuthor",
          message: "Artist name:",
          default: finalAuthor,
        },
        {
          type: "input",
          name: "newTitle",
          message: "Title:",
          default: finalTitle,
        },
      ]);

      response.newAuthor = response.newAuthor.trim();
      response.newTitle = response.newTitle.trim();

      const { confirmation } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmation",
          message: `Are these correct? Artist: "${response.newAuthor}", Title: "${response.newTitle}"`,
          default: true,
        },
      ]);
      confirmed = confirmation;
      if (confirmed) {
        finalAuthor = response.newAuthor;
        finalTitle = response.newTitle;
      }
    }
    console.log(`Saved with edited info: ${finalAuthor} - ${finalTitle}`);
  } else {
    console.log(`Saved with current info: ${finalAuthor} - ${finalTitle}`);
  }

  const buffer = await getAudio(youtubeLink);
  if (!buffer) {
    console.error("Failed to download audio");
    continue;
  }

  await uploadMusic(finalAuthor, finalTitle, buffer, await getMusicValue(buffer));
  await uploadThumbnail(finalAuthor, finalTitle, await cropImage(thumbnail), await getAverageColor(thumbnail));
  console.log("--------------------------\n");
}
