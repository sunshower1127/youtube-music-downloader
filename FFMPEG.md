# ffmpeg 사용법 정리

`ffmpeg -i "${originalFilePath}" -filter:a volumedetect -f null /dev/null`
이게 볼륨 측정하는 법인가?
`volumeAnalysis.match(/mean_volume: ([-\d.]+) dB/);`
보니깐 저기에서 mean_volume 값만 얻어오면 되는듯

`ffmpeg -i "${originalFilePath}" -filter:a "volume=${volumeChange}dB" -c:a libopus -b:a 128k "${normalizedFilePath}"`

이건 근데 128k짜리 webm 오디오 파일 볼륨 바꿔주는 로직임.
