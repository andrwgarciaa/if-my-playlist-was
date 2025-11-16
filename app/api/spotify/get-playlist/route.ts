import { NextResponse } from "next/server";
import { getPlaylist } from "@/lib/spotify";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const supabase = createServerSupabase();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing playlist URL" },
        { status: 400 }
      );
    }
    const match = url.match(/playlist\/([A-Za-z0-9]+)/);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid Spotify playlist URL" },
        { status: 400 }
      );
    }

    const playlistId = match[1];

    const { data: existingPlaylist, error: playlistFetchError } = await supabase
      .from("playlists")
      .select("*")
      .eq("spotify_id", playlistId)
      .maybeSingle();

    if (playlistFetchError && playlistFetchError.code !== "PGRST116")
      throw playlistFetchError;

    if (existingPlaylist) {
      return NextResponse.json(existingPlaylist);
    }

    const playlist = await getPlaylist(playlistId);

    const { data: newPlaylist, error: insertPlaylistError } = await supabase
      .from("playlists")
      .insert({
        spotify_id: playlistId,
        name: playlist.name,
        owner_name: playlist.owner.display_name,
        mood: null,
        genre: null,
        image_url: playlist.images[0].url,
      })
      .select("*")
      .maybeSingle();

    if (insertPlaylistError || !newPlaylist) throw insertPlaylistError;

    return NextResponse.json(newPlaylist);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}
