# yt-dlp 명령어 및 인자 모음

--no-playlist
달아줘야함. 안그러면 플레이리스트 전체 다운받아짐

--no-download
그냥 정보만 얻고싶으면 쓰는건가봄

--print
stdout으로 이제 해당 정보 내보내줌

- %(title)s
- %(uploader)s
- %(thumbnail)s

-F
포맷 리스트 출력

-f 숫자
포맷 선택

- 234 : audio-only mp4 100kbps 정도
- 251 : audio-only webm 100kbps 정도
  왠만하면 mp4 선택하셈. 가끔씩 webm은 선택이 안됨

-o
output 파일명. - 만 주면 stdout으로 바이트 보내줌.
