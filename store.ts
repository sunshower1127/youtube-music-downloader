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

export async function uploadMusic(author: string, title: string, musicBuffer: Buffer, musicValue: { emotion: number; energy: number }) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.webm`,
    ContentType: "audio/webm",
    Body: musicBuffer,
    ContentLength: musicBuffer.length,
    Metadata: {
      emotion: musicValue.emotion.toString(),
      energy: musicValue.energy.toString(),
    },
  });

  try {
    const response = await s3.send(command);
    console.log("S3 Music Upload complete");
    return response;
  } catch (error) {
    console.error("Upload failure", error);
    throw error;
  }
}

export async function uploadThumbnail(author: string, title: string, thumbnailBuffer: Buffer, colorCode: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: `${author}/${title}.webp`,
    ContentType: "image/webp",
    Body: thumbnailBuffer,
    ContentLength: thumbnailBuffer.length,
    Metadata: {
      colorcode: colorCode,
    },
  });

  try {
    const response = await s3.send(command);
    console.log("S3 Thumnail Upload complete");
    return response;
  } catch (error) {
    console.error("Upload failure", error);
    throw error;
  }
}
