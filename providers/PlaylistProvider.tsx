"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { FromDBPlaylist, SpotifyPlaylist } from "../types/spotify";

type PlaylistContextType = {
  playlistData: FromDBPlaylist | null;
  setPlaylistData: (data: FromDBPlaylist | null) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlistData, setPlaylistData] = useState<FromDBPlaylist | null>(null);

  return (
    <PlaylistContext.Provider value={{ playlistData, setPlaylistData }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context)
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  return context;
};
