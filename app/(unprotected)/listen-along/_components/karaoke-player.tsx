"use client";
import { PlusIcon } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";

interface Timestamp {
  word: string;
  start: number;
  end: number;
}

export default function KaraokePlayer() {
  const [file, setFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);

  // Prepare karaoke timestamps based on audio duration
  const prepareKaraoke = () => {
    if (!audioFile || !transcript.trim())
      return alert("Upload audio and paste transcript!");

    const splitWords = transcript.trim().split(/\s+/);
    const duration = audioRef.current?.duration || 1; // fallback 1s if audio not loaded yet
    const wordsCount = splitWords.length;

    let ts: Timestamp[] = splitWords.map((word, index) => {
      const start = (index / wordsCount) * duration;
      const end = ((index + 1) / wordsCount) * duration;
      return { word, start, end };
    });

    setTimestamps(ts);
    setCurrentWordIndex(-1);
  };

  // Highlight current word
  const highlightWord = () => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const index = timestamps.findIndex(
      (w) => currentTime >= w.start && currentTime < w.end
    );
    setCurrentWordIndex(index);
  };

  // Use requestAnimationFrame for smoother highlighting
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      highlightWord();
      rafId = requestAnimationFrame(animate);
    };

    if (timestamps.length > 0 && audioRef.current) {
      rafId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(rafId);
  }, [timestamps]);

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    if (file) setAudioFile(URL.createObjectURL(file));
  };

  return (
    <div
      className="bg-blue-400 rounded-xl text-white"
      style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}
    >
      <h2>🎤 Karaoke Sync</h2>

      <div className="flex  items-center justify-center">
        <label
          htmlFor="audioFile"
          className="flex gap-1 items-center justify-center button bg-white text-black px-4 py-2 rounded-xl my-4"
        >
          <PlusIcon /> Upload audio
        </label>
        <input
          id="audioFile"
          className="hidden"
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
        />
      </div>

      {file && (
        <>
          <div>
            <p>{file?.name}</p>
            <audio
              ref={audioRef}
              src={audioFile || undefined}
              controls
              onTimeUpdate={() => console.log(audioRef.current?.currentTime)}
              style={{ width: "100%", marginTop: "10px" }}
            />
          </div>
          <textarea
            className="border border-white rounded-xl outline-none"
            placeholder="Paste transcript here"
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              fontSize: "16px",
            }}
          />

          <button
            className="bg-white text-black rounded-xl"
            onClick={prepareKaraoke}
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              fontSize: "16px",
            }}
          >
            Start Karaoke
          </button>

          <div
            style={{
              marginTop: "20px",
              fontSize: "20px",
              lineHeight: "2em",
              minHeight: "100px",
              overflowWrap: "break-word",
            }}
          >
            {timestamps.map((w, i) => (
              <span
                key={i}
                style={{
                  color: i === currentWordIndex ? "#e53e3e" : "#111",
                  backgroundColor:
                    i === currentWordIndex ? "#fed7d7" : "transparent",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  marginRight: "3px",
                  transition: "all 0.1s ease",
                  display: "inline-block",
                }}
              >
                {w.word}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
