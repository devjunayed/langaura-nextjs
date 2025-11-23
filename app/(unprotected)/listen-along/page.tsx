import { Button } from "@heroui/button";
import React from "react";
import KaraokePlayer from "./_components/karaoke-player";

const ListenAlongPage = () => {
  return (
    <div className=" h-full w-full p-4 rounded-lg">
       <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Karaoke Transcript Player</h1>
          <p className="text-default-500 text-lg">Upload audio/video files and watch words highlight in real-time</p>
        </div>
        <KaraokePlayer />
      </div>
    </div>
  );
};

export default ListenAlongPage;
