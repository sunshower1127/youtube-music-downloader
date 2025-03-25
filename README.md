# Youtube Music Downloader

Youtube Music Downloader는 YouTube에서 음악을 다운로드할 수 있는 Node.js 애플리케이션입니다.

## 특징

- YouTube 동영상의 오디오를 추출하여 WEBM으로 변환
- 변환된 파일을 S3 버킷에 업로드

## 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/youtube-music-downloader.git
cd youtube-music-downloader

# 의존성 설치
npm install
```

## 사용법

```bash
# CLI 사용 예시
npm run start
```

로직 순서 정리

다운로드

1. 일단 전체적인 프로세스들 관리와 cli는 node로 작성
2. 사용자에게 계속해서 유튜브 링크를 입력받음
3. `yt-dlp`를 통해 가수명(artist), 음악명(title) 데이터를 가져오고, 사용자가 수정할 수 있게함. + 썸네일을 정사각형으로 자를지(Y), 목표 데시벨을 몇으로 할지(이건 추후 수정) 선택
4. `yt-dlp`로 `musics` 폴더에다가 100kbps mp4 음원 파일을 다운로드. `가수명_음악명.mp4` 로 저장 후

   1. ffmpeg로 음원의 평균 볼륨을 뽑아내고 거기에 맞춰서 볼륨 수정해서 `normalized-musics`에 저장시킴.
   2. `mood-extractor`로 음원의 분위기값(emotion, energy) 뽑아냄.

5. `thumbnail-editor`로 썸네일 다운받아와서 옵션따라 정사각형으로 크롭한다음 `thumbnails` 폴더에 `가수명_음악명.jpg`로 저장하고 썸네일 대표 색상값 뽑아냄
6. 4-1에서 뽑은 `mean-volume`, 4-2에서 뽑은 `emotion, energy`, 5에서 뽑은 `mean-hue` 값을 `metadata` 폴더에 `가수명_음악명.json` 으로 저장함.

업로드

1. 가수명, 음악명을 입력받음
2. `normalized-musics/가수명_음악명.mp4` 파일을 s3에 `가수명/음악명.mp4` 로 업로드. 메타데이터를 `metadata/가수명_음악명.json`에서 읽어와서 붙임
3. `thumbnails/가수명_음악명.jpg` 파일 업로드
