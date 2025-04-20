import { type NextRequest, NextResponse } from "next/server"
import { searchAnime } from "@/lib/anime-service"

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const results = await searchAnime(query)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error searching anime:", error)
    return NextResponse.json({ error: "Failed to search anime" }, { status: 500 })
  }
}

