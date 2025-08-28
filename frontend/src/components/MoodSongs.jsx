import React, { useState, useRef } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import "./MoodSongs.css"; // keep if you still need extra rules; otherwise you can remove this import

const moodEmoji = (m) =>
  ({
    happy: "😄",
    sad: "😕",
    neutral: "🙂",
    angry: "😡",
    surprised: "😮",
    disgusted: "🤢",
    fearful: "😨",
  }[m] || "🎵");

export default function MoodSongs({ Songs = [], mood }) {
  const [isPlaying, setIsPlaying] = useState(null);
  const audioRefs = useRef([]);

  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      audioRefs.current[index]?.pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null) audioRefs.current[isPlaying]?.pause();
      audioRefs.current[index]?.play();
      setIsPlaying(index);
    }
  };

  return (
    <>
      <h3 className="section-title">Mood & Recommendations</h3>

      {/* Mood Badge */}
      <div className="mood-chip" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{moodEmoji(mood)}</span>
        <span style={{ marginLeft: 10 }}>
          {mood ? mood[0].toUpperCase() + mood.slice(1) : "No mood detected"}
        </span>
      </div>

      {/* Songs List */}
      <div className="list">
        {Songs.length === 0 && (
          <p className="muted">Click “Detect Mood” to load recommendations.</p>
        )}

        {Songs.map((song, index) => (
          <div className="song-card" key={`${song.title}-${index}`}>
            {/* Cover (fallback to emoji) */}
            {song.image ? (
              <img src={song.image} alt={song.title} className="cover" />
            ) : (
              <div className="cover">{moodEmoji(mood)}</div>
            )}

            {/* Text */}
            <div className="meta">
              <div className="title">{song.title}</div>
              <div className="artist">{song.artist}</div>
            </div>

            {/* Player */}
            <div className="play-pause-button">
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.audio}
              />
              <button className="icon-btn" onClick={() => handlePlayPause(index)} title="Play/Pause">
                {isPlaying === index ? <FiPause /> : <FiPlay />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}