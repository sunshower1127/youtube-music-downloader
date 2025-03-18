import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import "dotenv/config";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT_URL!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
});

export async function uploadMusic(author: string, title: string, thumbnail: { url: string; size: number }, musicBuffer: Buffer) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.webm`,
    ContentType: "audio/webm",
    Body: musicBuffer,
    ContentLength: musicBuffer.length,
    Metadata: {
      thumbnail: JSON.stringify(thumbnail),
    },
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
