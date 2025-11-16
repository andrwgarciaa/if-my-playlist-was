"use client";
import Playlist from "@/components/custom/Playlist";
import { usePlaylist } from "@/providers/PlaylistProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FromDBPlaylist, SpotifyPlaylist } from "@/types/spotify";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Icon } from "lucide-react";

export default function Home() {
  const { playlistData, setPlaylistData } = usePlaylist();
  const [allPlaylists, setAllPlaylists] = useState<FromDBPlaylist[] | null>(
    null
  );
  const [isShowHistoryClicked, setIsShowHistoryClicked] =
    useState<boolean>(false);

  const handleHistoryClick = (history: FromDBPlaylist) => {
    setPlaylistData(history);
  };

  useEffect(() => {
    const getAllPlaylists = async () => {
      try {
        const res = await fetch("/api/spotify/get-all-playlist", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          setAllPlaylists(null);
        } else {
          setAllPlaylists(data);
        }
      } catch (err) {
        setAllPlaylists(null);
      }
    };

    getAllPlaylists();
  }, []);

  return (
    <main>
      <div className="max-w-xs lg:max-w-[100vw] w-full space-y-4">
        <p className="text-2xl lg:text-4xl italic">
          “What if your Spotify playlist… wasn’t a playlist at all?”
        </p>
        <Playlist />

        {playlistData && (
          <>
            <div className="flex flex-col md:flex-row">
              <div className="flex gap-4 items-center">
                <Link href={`/result/${playlistData.spotify_id}`}>
                  <Button variant="default">See result</Button>
                </Link>
                <Link
                  href={`https://open.spotify.com/playlist/${playlistData.spotify_id}`}
                  target="_blank"
                >
                  <Button
                    variant="default"
                    className="w-fit bg-[#1ED760] hover:bg-[#1ED760]/90"
                  >
                    <img
                      src={"/Spotify_Primary_Logo_RGB_Black.png"}
                      className="w-6"
                    />
                    <span>Open on Spotify</span>
                  </Button>
                </Link>
              </div>
              <span className="text-xs lg:text-sm text-gray-400 mt-4 lg:ml-auto lg:mt-auto">
                First analysed in{" "}
                {new Date(playlistData.created_at).toLocaleString()}
              </span>
            </div>
            <Separator className="my-8" />
          </>
        )}

        {allPlaylists && (
          <div className="flex flex-col items-center gap-4 overflow-hidden">
            <h3 className="text-sm md:text-lg">Recent searches by visitors:</h3>
            <Carousel
              className="max-w-2xl m-auto"
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: false,
                }),
              ]}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {allPlaylists.map((playlist, idx) => (
                  <CarouselItem
                    key={playlist.id}
                    className="lg:basis-1/3 w-full"
                  >
                    <div
                      className="hover:cursor-pointer"
                      onClick={() => handleHistoryClick(playlist)}
                    >
                      <div className="w-full h-full">
                        <img
                          src={playlist.image_url}
                          alt={`playlist cover ${idx}`}
                          className="aspect-square md:w-full w-xs"
                        />
                        <p className="font-semibold">{playlist.name}</p>
                        <p>by {playlist.owner_name}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="invisible lg:visible" />
              <CarouselNext className="invisible lg:visible" />
            </Carousel>
          </div>
        )}
      </div>
    </main>
  );
}
