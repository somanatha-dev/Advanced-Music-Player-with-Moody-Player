import React, { useContext, useEffect, useMemo, useState } from "react";
import { PlayerContext } from "../App.jsx";

/** Curated picks (title + artist). We’ll resolve real previews via iTunes. */
const PICKS = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Dance Monkey", artist: "Tones And I" },
  { title: "Someone You Loved", artist: "Lewis Capaldi" },
  { title: "Circles", artist: "Post Malone" },
];

const mapItunes = (item) => ({
  id: item.trackId,
  name: item.trackName,
  artists: item.artistName,
  album: item.collectionName || "",
  image: item.artworkUrl100?.replace("100x100bb", "200x200bb"),
  preview: item.previewUrl, // 30s mp3/aac (CORS-friendly)
});

export default function TopSongs() {
  const { controls } = useContext(PlayerContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch each pick from iTunes so we get working previews
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = [];
        for (const p of PICKS) {
          const term = `${p.title} ${p.artist}`;
          const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
            term
          )}&entity=song&limit=1`;

          try {
            const res = await fetch(url);
            const json = await res.json();
            const item = (json.results || [])[0];

            if (item) {
              results.push(mapItunes(item));
            } else {
              // fallback: no result
              results.push({
                id: `${p.title}-${p.artist}`,
                name: p.title,
                artists: p.artist,
                album: "",
                image: "https://placehold.co/80x80/282828/E0E0E0?text=?",
                preview: null,
              });
            }
          } catch {
            results.push({
              id: `${p.title}-${p.artist}`,
              name: p.title,
              artists: p.artist,
              album: "",
              image: "https://placehold.co/80x80/282828/E0E0E0?text=?",
              preview: null,
            });
          }
        }
        if (!cancelled) setRows(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const numbered = useMemo(
    () => rows.map((t, i) => ({ ...t, _rank: i + 1 })),
    [rows]
  );

  return (
    <div className="container-wide">
      <h1 className="page-title center">Our Top Picks</h1>

      {loading && <p className="muted center">Loading top songs…</p>}

      <ul className="rank-list">
        {numbered.map((t) => (
          <li key={t.id} className="rank-item">
            <div className="rank-badge">{t._rank}</div>

            {/* thumb */}
            <img className="rank-thumb" src={t.image} alt="" />

            {/* meta */}
            <div className="rank-meta">
              <div className="rank-title">{t.name}</div>
              <div className="rank-artist">{t.artists}</div>
              {t.album && <div className="rank-album">{t.album}</div>}
            </div>

            {/* play */}
            <button
              className={`playpill ${t.preview ? "" : "disabled"}`}
              onClick={() => t.preview && controls.addAndPlay(t)}
              disabled={!t.preview}
              title={t.preview ? "Play preview" : "No preview available"}
            >
              ▶
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}