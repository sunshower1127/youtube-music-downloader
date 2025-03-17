import { CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import "dotenv/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
});

export async function uploadMusic(author: string, title: string, musicBuffer: Buffer) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.webm`,
    ContentType: "audio/webm",
    Body: musicBuffer,
    ContentLength: musicBuffer.length,
  });

  try {
    const response = await s3.send(command);
    console.log("Upload complete", response);
    return response;
  } catch (error) {
    console.error("Upload failure", error);
    throw error;
  }
}

export async function migrateUploadedMusicFiles() {
  const bucket = process.env.BUCKET_NAME!;
  const listResponse = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
    })
  );
  for (const item of listResponse.Contents ?? []) {
    if (item.Key && item.Key.endsWith(".mp3")) {
      const newKey = item.Key.slice(0, -4) + ".webm";
      // Copy object to new key with URL encoding for special characters in key
      await s3.send(
        new CopyObjectCommand({
          Bucket: bucket,
          CopySource: `${bucket}/${encodeURIComponent(item.Key)}`,
          Key: newKey,
        })
      );
      // Delete old object
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: item.Key,
        })
      );
      console.log(`Migrated ${item.Key} to ${newKey}`);
    }
  }
  console.log("Migration completed");
}
