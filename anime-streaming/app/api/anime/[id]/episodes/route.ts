import { type NextRequest, NextResponse } from "next/server"
import { load } from "cheerio"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const episodeNumber = searchParams.get("ep") || "1"

    // Fetch the anime page to get episode data
    const response = await fetch(`https://9animetv.to/watch/${params.id}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://9animetv.to/",
      },
    }).catch((error) => {
      console.error("Fetch error:", error)
      return null
    })

    if (!response || !response.ok) {
      // Return fallback episode data
      return NextResponse.json({
        id: `fallback-${params.id}-${episodeNumber}`,
        number: episodeNumber,
        title: `Episode ${episodeNumber}`,
        fallback: true,
      })
    }

    const html = await response.text()
    const $ = load(html)

    // Find the episode data
    let episodeId = ""
    let episodeTitle = ""
    let episodeFound = false

    // Try different selectors to find episodes
    const episodeSelectors = [".ss-list .ep-item", ".episodes-list .episode-item", ".episodes-container .episode"]

    for (const selector of episodeSelectors) {
      $(selector).each((i, el) => {
        const dataNumber = $(el).attr("data-number") || $(el).attr("data-ep") || $(el).text().trim()

        if (dataNumber === episodeNumber) {
          episodeId = $(el).attr("data-id") || $(el).attr("id") || ""
          episodeTitle = $(el).attr("title") || `Episode ${episodeNumber}`
          episodeFound = true
        }
      })

      if (episodeFound) break
    }

    // If we still can't find the episode, try to get the first episode
    if (!episodeId && episodeNumber === "1") {
      for (const selector of episodeSelectors) {
        const firstEpisode = $(selector).first()
        if (firstEpisode.length) {
          episodeId = firstEpisode.attr("data-id") || firstEpisode.attr("id") || ""
          episodeTitle = firstEpisode.attr("title") || "Episode 1"
          episodeFound = true
          break
        }
      }
    }

    // If we still can't find any episode, create a fallback
    if (!episodeId) {
      // Look for any data that might contain episode information
      const scriptData = $("script")
        .filter(function () {
          return $(this).text().includes("episodes") || $(this).text().includes("episode_id")
        })
        .text()

      if (scriptData) {
        // Try to extract episode ID from script data
        const episodeIdMatch =
          scriptData.match(/"episode_id"\s*:\s*"([^"]+)"/) ||
          scriptData.match(/episode_id\s*:\s*['"]([^'"]+)['"]/) ||
          scriptData.match(/id\s*:\s*['"]([^'"]+)['"]/)

        if (episodeIdMatch && episodeIdMatch[1]) {
          episodeId = episodeIdMatch[1]
          episodeTitle = `Episode ${episodeNumber}`
          episodeFound = true
        }
      }
    }

    if (!episodeFound) {
      // Create a fallback response with dummy data
      return NextResponse.json({
        id: `fallback-${params.id}-${episodeNumber}`,
        number: episodeNumber,
        title: `Episode ${episodeNumber}`,
        fallback: true,
      })
    }

    return NextResponse.json({
      id: episodeId,
      number: episodeNumber,
      title: episodeTitle,
    })
  } catch (error) {
    console.error("Error fetching episode data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch episode data",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true,
        id: `fallback-${params.id}-${searchParams?.get("ep") || "1"}`,
        number: searchParams?.get("ep") || "1",
        title: `Episode ${searchParams?.get("ep") || "1"}`,
      },
      { status: 200 }, // Return 200 even for errors to prevent cascading failures
    )
  }
}

