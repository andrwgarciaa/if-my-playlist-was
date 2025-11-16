"use client";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { usePlaylist } from "@/providers/PlaylistProvider";
import Image from "next/image";
import { Separator } from "../ui/separator";

function Playlist() {
  const { playlistData, setPlaylistData } = usePlaylist();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePlaylistUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPlaylistData(null);
    setErrorMessage("");

    if (!searchQuery.trim()) {
      setErrorMessage("Playlist url cannot be empty.");
      return;
    }

    if (searchQuery.match(/playlist\/37i9dQZF1/)) {
      setErrorMessage(
        "Spotify-curated playlists are not supported. Please use a user-created playlist."
      );
      return;
    }
    setIsLoading(true);

    setIsLoading(true);

    try {
      const res = await fetch("/api/spotify/get-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: searchQuery }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to fetch playlist");
        setPlaylistData(null);
      } else {
        setPlaylistData(data);
      }
    } catch (err) {
      setErrorMessage("Failed to fetch playlist");
      setPlaylistData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="w-full flex gap-2">
        <Input
          id="search-playlist"
          type="text"
          value={searchQuery}
          onChange={handlePlaylistUrl}
          placeholder="https://open.spotify.com/playlist/..."
        />

        <Button variant="outline" type="submit" aria-label="Submit">
          <SearchIcon />
          <span>Search</span>
        </Button>
      </form>

      {errorMessage && (
        <label
          htmlFor="search-playlist"
          id="search-playlist--error"
          className="text-xs text-red-500"
        >
          {errorMessage}
        </label>
      )}

      {isLoading && (
        <div className="w-full">
          <div className="mx-auto my-4">
            <div className="aspect-square ">
              <Skeleton className="h-full rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-1/2 h-6" />
          </div>
        </div>
      )}

      {playlistData && (
        <>
          <div className="w-full">
            <div className="aspect-square my-4">
              {playlistData.image_url || playlistData.images ? (
                <img
                  src={
                    playlistData.image_url ??
                    playlistData.images.sort(
                      (a, b) => (b.height ?? 0) - (a.height ?? 0)
                    )[0].url
                  }
                  alt="Playlist cover"
                  className="h-full rounded-xl object-cover"
                />
              ) : (
                <></>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-2xl">{playlistData.name}</p>
              <div className="italic">
                <span>by </span>
                <span className="font-semibold">
                  {playlistData.owner_name ?? playlistData.owner.display_name}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Playlist;
