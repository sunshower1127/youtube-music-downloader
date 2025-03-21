import sys
import tempfile
import warnings

import librosa
import numpy as np
import soundfile as sf

warnings.filterwarnings("ignore")


def extract_valence(audio_binary):
    # Create a temporary file to handle webm data
    with tempfile.NamedTemporaryFile(suffix=".webm") as temp_file:
        temp_file.write(audio_binary)
        temp_file.flush()

        # Convert to wav for librosa processing (if needed)
        try:
            y, sr = librosa.load(temp_file.name, sr=None)
        except:  # noqa: E722
            # If direct loading fails, use soundfile as intermediate
            with tempfile.NamedTemporaryFile(suffix=".wav") as wav_file:
                data, samplerate = sf.read(temp_file.name)
                sf.write(wav_file.name, data, samplerate)
                y, sr = librosa.load(wav_file.name, sr=None)

    # Calculate valence (using spectral centroid)
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)[0])

    energy = np.mean(librosa.feature.rms(y=y))

    valence = min(spectral_centroid / 5000.0, 1.0)

    # Convert to integer after multiplying by 100
    return int(valence * 100), int(energy * 100)


if not sys.stdin.isatty():
    # pipe로 받은 .webm 음악 arraybuffer 입력 처리
    audio_binary = sys.stdin.buffer.read()
    emotion, energy = extract_valence(audio_binary)
    # Print just the integer value
    print(f'{{"emotion": {emotion}, "energy": {energy}}}', flush=True)
