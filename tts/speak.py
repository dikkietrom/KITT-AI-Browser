import sys
import os
from playsound import playsound
import requests
#from config import Config
elevenlabs_api_key=sys.argv[3]
#from gtts import gTTS
import gtts


# TODO: Nicer names for these ids

tts_headers = {
    "Content-Type": "application/json",
    "xi-api-key": elevenlabs_api_key
}

def eleven_labs_speech(text):
    voice = sys.argv[2]


    tts_url = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream".format(voice_id=voice)
    formatted_message = {"text": text}

    response = requests.post(tts_url, headers=tts_headers, json=formatted_message)

    if response.status_code == 200:
        with open("speech.mpeg", "wb") as f:
            f.write(response.content)
        playsound("speech.mpeg")
        os.remove("speech.mpeg")
        return True
    else:
        print("Request failed with status code:", response.status_code)
        print("Response content:", response.content)
        return False

def gtts_speech(text):
    tts = gtts.gTTS(text)
    tts.save("speech-py.mp3")
    playsound("speech-py.mp3")
    os.remove("speech-py.mp3")

def say_text(text):
    if not elevenlabs_api_key:
        gtts_speech(text)
    else:
        success = eleven_labs_speech(text)
        if not success:
            gtts_speech(text)


say_text(sys.argv[1])
