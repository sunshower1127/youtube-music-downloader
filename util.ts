import { spawn } from "child_process";

export async function getMusicValue(buffer: Buffer): Promise<{ emotion: number; energy: number }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["mood-extractor/main.py"]);

    let moodData = "";

    proc.stdout.on("data", (data: Buffer) => {
      moodData += data.toString();
    });

    proc.stderr.on("data", (data: Buffer) => {
      console.error("mood-extractor stderr:", data.toString());
    });

    proc.on("error", (err: Error) => {
      reject(err);
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Process exited with code ${code}`));
      }
      resolve(JSON.parse(moodData.trim()));
    });

    // Write the buffer to the process's stdin and close it.
    proc.stdin.end(buffer);
  });
}
