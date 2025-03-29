import inquirer from "inquirer";
import readline from "readline";

function askEditable(prompt: string, defaultValue: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    // Wrap the prompt text with green color escape codes
    rl.question(`\x1b[32m${prompt}\x1b[0m`, (answer) => {
      rl.close();
      resolve(answer || defaultValue);
    });
    rl.write(defaultValue);
  });
}

async function promptYoutubeLink() {
  return inquirer.prompt<{ youtubeLink: string }>([
    {
      type: "input",
      name: "youtubeLink",
      message: "Enter YouTube link or ID:",
      validate: (input) => (input.length > 0 ? true : "Please enter a link or ID!"),
    },
  ]);
}

async function promptArtistTitle(artist: string, title: string): Promise<{ artist: string; title: string }> {
  while (true) {
    const newAuthor = (await askEditable("Artist name: ", artist)).trim();
    const newTitle = (await askEditable("Title: ", title)).trim();

    const { confirmation } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmation",
        message: `Are these correct? Artist: "${newAuthor}", Title: "${newTitle}"`,
        default: true,
      },
    ]);

    if (confirmation) {
      console.log(`Saved with info: ${newAuthor} - ${newTitle}`);
      return { artist: newAuthor, title: newTitle };
    }
  }
}

function promptCropThumbnail() {
  return inquirer.prompt<{ isCropRequired: boolean }>([
    {
      type: "confirm",
      name: "isCropRequired",
      message: "Would you like to crop the thumbnail to 1x1?",
      default: true,
    },
  ]);
}

// function promptTargetVolume() {
//   return inquirer.prompt<{ targetVolume: number }>([
//     {
//       type: "number",
//       name: "targetVolume",
//       message: "What volume should the music be normalized to?",
//       default: -14,
//     },
//   ]);
// }

export { promptArtistTitle, promptCropThumbnail, promptYoutubeLink };
