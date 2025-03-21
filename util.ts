import { spawn } from "child_process";
import { Readable } from "stream";

export async function streamToBuffer(readableStream: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of readableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function extractAudio(readable: Readable) {
  // ffmpeg를 사용하여 오디오만 추출하는 프로세스를 생성
  // TODO: ffmpeg 한 번 공부해보기
  const ffmpeg = spawn("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-i",
    "pipe:0",
    "-vn",
    "-acodec",
    "libopus", // 재인코딩: 복사가 아닌 Opus 코덱 사용
    "-b:a",
    "128k", // 오디오 비트레이트 지정
    "-f",
    "webm",
    "pipe:1",
  ]);

  // ffmpeg.stdin의 EPIPE 에러를 무시하도록 핸들러 추가
  ffmpeg.stdin.on("error", (err: any) => {
    if (err.code !== "EPIPE") {
      console.error("ffmpeg.stdin error:", err);
    }
  });

  // ffmpeg stderr 로그 출력 (옵션)
  ffmpeg.stderr.on("data", (data: Buffer) => {
    console.error("ffmpeg stderr:", data.toString());
  });

  readable.pipe(ffmpeg.stdin);
  return ffmpeg.stdout; // 추출된 오디오 스트림 리턴
}
