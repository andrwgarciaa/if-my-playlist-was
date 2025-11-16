import type { SpotifyPlaylist } from "@/types/spotify";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
const baseUrl = "https://api.spotify.com/v1";

async function getAccessToken(): Promise<string | null> {
  const now = Date.now();

  // Reuse token until expiration
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();

  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return cachedToken;
}

export async function getPlaylist(id: string): Promise<SpotifyPlaylist> {
  const token = await getAccessToken();

  const res = await fetch(`${baseUrl}/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch playlist: ${res.status}`);
  }

  return res.json();
}

// export async function getAudioFeatures(
//   trackId: string
// ): Promise<SpotifyAudioFeatures> {
//   const token = await getAccessToken();

//   const res = await fetch(`${baseUrl}/audio-features/${trackId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to fetch audio features: ${res.status}`);
//   }

//   return res.json();
// }
