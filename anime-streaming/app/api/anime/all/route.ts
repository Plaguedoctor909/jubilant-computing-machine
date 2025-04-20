import { NextResponse } from "next/server"
import { fetchTrendingAnime, fetchRecentAnime, fetchAllAnime } from "@/lib/anime-service"

export async function GET() {
  try {
    // Use the new fetchAllAnime function that combines trending, recent, and popular anime
    const allAnime = await fetchAllAnime()

    // If no results, fallback to combining trending and recent
    if (!allAnime || allAnime.length === 0) {
      // Fetch both trending and recent anime
      const [trending, recent] = await Promise.all([fetchTrendingAnime(), fetchRecentAnime()])

      // Combine and deduplicate
      const combined = [...trending]

      // Add recent anime that aren't already in the list
      for (const anime of recent) {
        if (!combined.some((item) => item.id === anime.id)) {
          combined.push(anime)
        }
      }

      return NextResponse.json({ results: combined })
    }

    return NextResponse.json({ results: allAnime })
  } catch (error) {
    console.error("Error fetching all anime:", error)
    return NextResponse.json(
      { error: "Failed to fetch anime", results: [] },
      { status: 200 }, // Return 200 even for errors to prevent cascading failures
    )
  }
}

