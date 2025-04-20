import { type NextRequest, NextResponse } from "next/server"
import { fetchAnimeDetails } from "@/lib/anime-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const animeDetails = await fetchAnimeDetails(params.id)

    if (!animeDetails) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 })
    }

    return NextResponse.json(animeDetails)
  } catch (error) {
    console.error("Error fetching anime details:", error)
    return NextResponse.json({ error: "Failed to fetch anime details" }, { status: 500 })
  }
}

