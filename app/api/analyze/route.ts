import { NextResponse } from "next/server";
import { analyzePlaylist } from "@/lib/groq";
import { createServerSupabase } from "@/lib/supabase";
import { GroqAnalysisResponse } from "@/types/groq";
import { getPlaylist } from "@/lib/spotify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createServerSupabase();
    const { spotifyId } = body;

    if (!spotifyId) {
      return NextResponse.json(
        { error: "Spotify id cannot be null." },
        { status: 400 }
      );
    }

    const { data: existingPlaylist, error: playlistFetchError } = await supabase
      .from("playlists")
      .select("*")
      .eq("spotify_id", spotifyId)
      .maybeSingle();

    if (playlistFetchError && playlistFetchError.code !== "PGRST116")
      throw playlistFetchError;

    const { data: existingAnalysis, error: analysisFetchError } = await supabase
      .from("analysis_results")
      .select("*")
      .eq("spotify_id", spotifyId);

    if (analysisFetchError && analysisFetchError.code !== "PGRST116")
      throw analysisFetchError;

    let playlistData: GroqAnalysisResponse = {
      mood: "",
      genre: "",
      matches: [],
    };

    if (existingPlaylist && existingAnalysis && existingAnalysis?.length > 0) {
      playlistData.genre = existingPlaylist.genre;
      playlistData.mood = existingPlaylist.mood;
      playlistData.matches = existingAnalysis;
      return NextResponse.json(playlistData);
    }

    const playlist = await getPlaylist(spotifyId);

    const tracksToAnalyze = playlist.tracks?.items
      .map((t) => t.track)
      .filter((t): t is { name: string; artists: { name: string }[] } => !!t);

    const rawResult = await analyzePlaylist(tracksToAnalyze);

    if (!rawResult) {
      return NextResponse.json(
        { error: "Failed to analyze playlist" },
        { status: 500 }
      );
    }

    const analysis: GroqAnalysisResponse = JSON.parse(rawResult);

    const { data: updateExistingPlaylist, error: playlistUpdateError } =
      await supabase
        .from("playlists")
        .update({
          mood: analysis.mood,
          genre: analysis.genre,
        })
        .select("*")
        .eq("spotify_id", spotifyId);

    if (playlistUpdateError && playlistUpdateError.code !== "PGRST116")
      throw playlistUpdateError;

    analysis.matches.map(async (match) => {
      const { data: insertNewAnalysis, error: insertNewAnalysisError } =
        await supabase.from("analysis_results").insert({
          spotify_id: spotifyId,
          name: match.name,
          category: match.category,
          description: match.description,
          reasoning: match.reasoning,
          image_url: match.image_url,
        });

      if (insertNewAnalysisError && insertNewAnalysisError.code !== "PGRST116")
        throw insertNewAnalysisError;
    });

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
