// types/spotify.ts
export type SpotifyImage = {
  url: string;
  height?: number | null;
  width?: number | null;
};

export type SpotifyExternalUrls = {
  spotify: string;
};

export type SpotifyUserCompact = {
  display_name?: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

export type SpotifyArtist = {
  id?: string | null;
  name: string;
  external_urls?: SpotifyExternalUrls;
  href?: string | null;
  type?: string | null;
  uri?: string | null;
};

export type SpotifyAlbum = {
  album_type?: string;
  total_tracks?: number;
  external_urls?: SpotifyExternalUrls;
  href?: string | null;
  id?: string | null;
  images?: SpotifyImage[];
  name?: string;
  release_date?: string;
  release_date_precision?: string;
  uri?: string | null;
  artists?: SpotifyArtist[];
};

export type SpotifyTrackObject = {
  album?: SpotifyAlbum;
  artists?: SpotifyArtist[];
  available_markets?: string[];
  disc_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  external_ids?: Record<string, string>;
  external_urls?: SpotifyExternalUrls;
  href?: string | null;
  id?: string | null;
  is_playable?: boolean;
  linked_from?: unknown;
  restrictions?: { reason?: string } | null;
  name: string;
  popularity?: number;
  preview_url?: string | null;
  track_number?: number;
  type?: string | null;
  uri?: string | null;
  is_local?: boolean;
};

export type SpotifyPlaylistTrackItem = {
  added_at?: string | null;
  added_by?: SpotifyUserCompact | null;
  is_local: boolean;
  track?: SpotifyTrackObject | null;
};

export type SpotifyTracksPage = {
  href: string;
  limit: number;
  next?: string | null;
  offset: number;
  previous?: string | null;
  total: number;
  items: SpotifyPlaylistTrackItem[];
};

export type SpotifyPlaylist = {
  collaborative: boolean;
  description?: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyUserCompact;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyTracksPage;
  type: string;
  uri: string;
};

export type FromDBPlaylist = SpotifyPlaylist & {
  id: string;
  created_at: Date;
  spotify_id: string;
  image_url: string;
  name: string;
  owner_name: string;
  mood: string;
  genre: string;
};
