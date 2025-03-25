import sys
import warnings

import librosa
import numpy as np

warnings.filterwarnings("ignore")
ARG_LEN = 2

# if not sys.stdin.isatty():
if len(sys.argv) != ARG_LEN:
    err = Exception("사용법: python main.py 파일명")
    raise err

f = sys.argv[1]
y, sr = librosa.load(f, sr=None)

spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)[0])

valence = min(spectral_centroid / 5000.0, 1.0)

mood = int(valence * 100)

print(mood, flush=True)
