"use client";
import ResultCard from "@/components/custom/ResultCard";
import ResultContainer from "@/components/custom/ResultContainer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePlaylist } from "@/providers/PlaylistProvider";
import { GitHub, LinkedIn } from "@mui/icons-material";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Result() {
  const { playlistData } = usePlaylist();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (!playlistData) redirect("/");
  }, []);

  useEffect(() => {
    if (!playlistData) return;

    async function fetchAnalysis() {
      if (playlistData) {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spotifyId: playlistData?.spotify_id ?? null,
          }),
        });

        const data = await res.json();
        setAnalysis(data);
      }
    }

    fetchAnalysis();
  }, [playlistData]);

  if (!playlistData) return null;

  return (
    <main className="w-full flex flex-col items-center justify-between">
      <section className="space-y-4">
        {playlistData && <h1 className="text-2xl">{playlistData.name}</h1>}
        {analysis ? (
          <ResultContainer {...analysis} />
        ) : (
          <p>Analyzing playlist...</p>
        )}
      </section>
      <footer className="w-screen bg-white text-black dark:bg-black dark:text-white -mb-4 lg:-mb-8 mt-6 h-12 lg:h-12 text-xs lg:text-md flex items-center justify-center ">
        <div className="flex gap-4">
          <Link
            href="https://www.github.com/andrwgarciaa"
            target="_blank"
            className="hover:underline underline-offset-2"
          >
            <GitHub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/andrwgarciaa"
            target="_blank"
            className="hover:underline underline-offset-2"
          >
            <LinkedIn />
          </Link>
        </div>
        <Separator
          orientation="vertical"
          className="mx-4 h-8! lg:h-4! bg-black"
        />
        <div className="flex flex-col lg:flex-row lg:gap-4">
          <p>Data provided by Spotify Web API.</p>
          <p>Analysis powered by Groq AI.</p>
        </div>
      </footer>
    </main>
  );
}
