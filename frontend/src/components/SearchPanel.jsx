import React, { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import MoodSongs from "./components/MoodSongs";
import SearchPanel from "./components/SearchPanel";
import "./styles.css";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [mood, setMood] = useState("");
  const [searchSongs, setSearchSongs] = useState([]); // results from search

  const showingSearch = searchSongs.length > 0;

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#3ec9ff" />
              </linearGradient>
            </defs>
            <path
              d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7.5a5.5 5.5 0 1 1-3-4.77V6H7v10.5a3.5 3.5 0 1 1-3-3.163V6Z"
              stroke="url(#g)"
              strokeWidth="1.8"
              fill="none"
            />
          </svg>
          <div>
            <div style={{ fontSize: 18 }}>Moody Player</div>
            <div className="badge">Emotion-aware music</div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <SearchPanel onResults={setSearchSongs} />

      {/* Main content */}
      <div className="content">
        <FacialExpression setSongs={setSongs} setMood={setMood} />
        <MoodSongs Songs={showingSearch ? searchSongs : songs} mood={mood} />
      </div>
    </div>
  );
}