import { type NextRequest, NextResponse } from "next/server"
import { fetchAnimeByGenre } from "@/lib/anime-service"

export async function GET(request: NextRequest, { params }: { params: { genre: string } }) {
  try {
    const results = await fetchAnimeByGenre(params.genre)

    return NextResponse.json({ results })
  } catch (error) {
    console.error(`Error fetching anime for genre ${params.genre}:`, error)
    return NextResponse.json({ error: "Failed to fetch anime by genre" }, { status: 500 })
  }
}

