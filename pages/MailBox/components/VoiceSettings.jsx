import React from "react";
import "./VoiceSettings.css";
import { useEffect } from "react";

const VoiceSettings = ({
  pitch,
  setPitch,
  rate,
  setRate,
  volume,
  setVolume,
  selectedVoice,
  setSelectedVoice,
  voices, 
  populateVoices, 
}) => {

  useEffect(() => {
    if (!voices.length) {
      populateVoices();
    }
  
    const handleVoicesChanged = () => {
      populateVoices();
    };
  
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
  
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [voices, populateVoices]);

  return (
    <div>
      <div>
        <label htmlFor="lang">
          Choose language and speaker：
          <select
            name="lang"
            id="lang"
            value={selectedVoice ? selectedVoice.voiceURI : ""}
            onChange={(e) =>
              setSelectedVoice(voices.find((voice) => voice.voiceURI === e.target.value))
            }
          >
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="pitch">
          set pitch(range between [0 - 2])：
          <input type="number" value={pitch} name="pitch" id="pitch" onChange={(e) => setPitch(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="rate">
          Set reading speed (range between [0 - 10])：
          <input type="number" value={rate} name="rate" id="rate" onChange={(e) => setRate(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="volume">
          Set volume  (range between [0 - 1])：
          <input type="number" value={volume} name="volume" id="volume" onChange={(e) => setVolume(e.target.value)} />
        </label>
      </div>
    </div>
  );
};

export default VoiceSettings;
