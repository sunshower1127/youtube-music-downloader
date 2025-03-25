import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { files } from "./path.ts";

import "dotenv/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
});

export async function uploadMusicWithMetadata(author: string, title: string, metadata: Record<string, any>) {
  metadata = Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, String(value)]));
  const inputPath = files.normalizedMusic(author, title);
  const fileStream = fs.createReadStream(inputPath);
  const fileSizeInBytes = fs.statSync(inputPath).size;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.mp4`,
    ContentType: "audio/mp4",
    Body: fileStream,
    ContentLength: fileSizeInBytes,
    Metadata: metadata,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("Upload failure", error);
    throw error;
  }
}

export async function uploadThumbnail(author: string, title: string) {
  const inputPath = files.thumbnail(author, title);
  const fileStream = fs.createReadStream(inputPath);
  const fileSizeInBytes = fs.statSync(inputPath).size;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.webp`,
    ContentType: "image/webp",
    Body: fileStream,
    ContentLength: fileSizeInBytes,
  });

  try {
    await s3.send(command);
  } catch (error) {
    console.error("Upload failure", error);
    throw error;
  }
}
