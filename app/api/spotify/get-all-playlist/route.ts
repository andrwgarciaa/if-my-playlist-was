import { createServerSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();
  try {
    const { data: existingPlaylist, error: playlistFetchError } = await supabase
      .from("playlists")
      .select("*")
      .limit(15)
      .order("created_at", { ascending: false });

    if (playlistFetchError && playlistFetchError.code !== "PGRST116")
      throw playlistFetchError;

    if (existingPlaylist) {
      return NextResponse.json(existingPlaylist);
    }
  } catch (error) {
    throw error;
  }
}
