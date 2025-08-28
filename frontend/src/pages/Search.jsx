import React, { useEffect, useState, useContext } from "react";
import { PlayerContext } from "../App.jsx";

const mapItunes = (item) => ({
  id: item.trackId,
  name: item.trackName,
  artists: item.artistName,
  album: item.collectionName || "",
  image: item.artworkUrl100?.replace("100x100bb", "200x200bb"),
  preview: item.previewUrl,
});

export default function SearchPage(){
  const { controls } = useContext(PlayerContext);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounced(q, 400);

  useEffect(() => {
    const run = async () => {
      if (!debounced.trim()) { setResults([]); return; }
      setLoading(true);
      try{
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(debounced)}&entity=song&limit=24`);
        const json = await res.json();
        setResults((json.results||[]).map(mapItunes));
      }catch{ setResults([]); }
      finally{ setLoading(false); }
    };
    run();
  }, [debounced]);

  return (
    <div className="search-page">
      <div className="hero">
        <h1 className="hero-title">Find Your Vibe</h1>
        <form className="pill" onSubmit={(e)=>e.preventDefault()}>
          <input
            className="pill-input"
            placeholder="Search for songs, artists, or albums..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button className="btn-green" onClick={()=>setQ(s=>s.trim())}>
            <span className="icon">🔍</span> Search
          </button>
        </form>
        {loading && <div className="muted" style={{marginTop:10}}>Searching…</div>}
      </div>

      <div className="results-wrap">
        <h2 className="results-title">Search Results</h2>

        {!q && <p className="muted center">Start searching to find your favorite songs! (e.g., “Blinding”, “Ed Sheeran”)</p>}
        {q && !loading && results.length===0 && <p className="muted center">No results found for “{q}”.</p>}

        <div className="card-grid">
          {results.map(t=>(
            <div key={t.id} className="song-card-neo">
              <img className="thumb" src={t.image} alt="" />
              <div className="meta">
                <div className="title">{t.name}</div>
                <div className="artist">{t.artists}</div>
                {t.album && <div className="album">{t.album}</div>}
              </div>
              <button
                className={`playpill ${t.preview ? "" : "disabled"}`}
                onClick={()=> t.preview && controls.addAndPlay(t)}
                disabled={!t.preview}
                title={t.preview ? "Play preview" : "No preview available"}
              >▶</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useDebounced(v, d=300){
  const [out, setOut] = useState(v);
  useEffect(()=>{ const id=setTimeout(()=>setOut(v), d); return ()=>clearTimeout(id); },[v,d]);
  return out;
}