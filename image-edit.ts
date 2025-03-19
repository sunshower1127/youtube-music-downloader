import { writeFile } from "fs/promises";
import sharp from "sharp";

export async function cropImage(thumbnailURL: string): Promise<Buffer> {
  // URL에서 이미지를 받아오기
  const response = await fetch(thumbnailURL);
  if (!response.ok) {
    throw new Error(`이미지 불러오기 실패: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 이미지를 Sharp로 처리
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("이미지 크기를 확인할 수 없습니다.");
  }

  // 가운데를 기준으로 정사각형 영역 계산
  const squareSize = Math.min(metadata.width, metadata.height);
  const left = Math.floor((metadata.width - squareSize) / 2);
  const top = Math.floor((metadata.height - squareSize) / 2);

  // 정사각형 영역으로 잘라내고 jpg 형식으로 반환
  return await image.extract({ left, top, width: squareSize, height: squareSize }).toFormat("webp").toBuffer();
}
