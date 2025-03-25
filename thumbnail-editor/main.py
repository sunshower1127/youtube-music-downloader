import colorsys
import sys
import warnings
from io import BytesIO

import requests
from PIL import Image

warnings.filterwarnings("ignore")
MIN_ARG_LEN = 3
MAX_ARG_LEN = 4


def download_image(url):
    """URL에서 이미지 다운로드"""
    response = requests.get(url, timeout=10)
    return Image.open(BytesIO(response.content))


def crop_to_square(image):
    """이미지를 정사각형으로 자르기"""
    width, height = image.size
    size = min(width, height)
    left = (width - size) // 2
    top = (height - size) // 2
    right = left + size
    bottom = top + size
    return image.crop((left, top, right, bottom))


def get_dominant_hue(image):
    """이미지를 1x1 픽셀로 리사이즈하여 hue 값 추출"""
    image_small = image.resize((1, 1))
    r, g, b = image_small.getpixel((0, 0))[:3]  # RGB 값 추출 (알파 채널 무시)
    h, _, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return int(h * 360)  # 0-1 값을 0-360 범위로 변환


if not (MIN_ARG_LEN <= len(sys.argv) <= MAX_ARG_LEN):
    err = Exception("사용법: python main.py <이미지_URL> [저장할_파일명] crop")
    raise err

url = sys.argv[1]
filename = sys.argv[2]
is_crop = len(sys.argv) == MAX_ARG_LEN


# 이미지 다운로드
image = download_image(url)

if is_crop:
    image = crop_to_square(image)

# 이미지 저장
image.save(filename)

# 이미지의 Hue 값 계산 및 출력
hue = get_dominant_hue(image)
print(hue, flush=True)
