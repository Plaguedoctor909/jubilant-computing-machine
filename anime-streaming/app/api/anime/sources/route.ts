import { type NextRequest, NextResponse } from "next/server"
import { load } from "cheerio"

export async function GET(request: NextRequest) {
  try {
    const episodeId = request.nextUrl.searchParams.get("episodeId")

    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 })
    }

    // Check if this is a fallback episode ID
    if (episodeId.startsWith("fallback-")) {
      // Return a fallback video source
      return NextResponse.json({
        sources: [
          {
            id: "fallback",
            server: "Default",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            direct: true,
          },
          {
            id: "fallback-2",
            server: "Backup",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            direct: true,
          },
        ],
      })
    }

    // Fetch servers for the episode
    const serversResponse = await fetch(`https://9animetv.to/ajax/episode/servers?episodeId=${episodeId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://9animetv.to/",
      },
    }).catch((error) => {
      console.error("Fetch error:", error)
      return null
    })

    if (!serversResponse || !serversResponse.ok) {
      return NextResponse.json({
        sources: [
          {
            id: "fallback",
            server: "Default",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            direct: true,
          },
          {
            id: "fallback-2",
            server: "Backup",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            direct: true,
          },
        ],
      })
    }

    const serversData = await serversResponse.json()

    if (!serversData.success) {
      return NextResponse.json({
        sources: [
          {
            id: "fallback",
            server: "Default",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            direct: true,
          },
          {
            id: "fallback-2",
            server: "Backup",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            direct: true,
          },
        ],
      })
    }

    const $ = load(serversData.html)
    const servers: any[] = []

    $(".server-item").each((i, el) => {
      const serverId = $(el).attr("data-id")
      const serverName = $(el).find(".name").text().trim()

      if (serverId) {
        servers.push({
          id: serverId,
          server: serverName || `Server ${i + 1}`,
        })
      }
    })

    // If no servers found, return fallback
    if (servers.length === 0) {
      return NextResponse.json({
        sources: [
          {
            id: "fallback",
            server: "Default",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            direct: true,
          },
          {
            id: "fallback-2",
            server: "Backup",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            direct: true,
          },
        ],
      })
    }

    // Get the first server's sources
    try {
      const sourceResponse = await fetch(`https://9animetv.to/ajax/episode/sources?id=${servers[0].id}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Referer: "https://9animetv.to/",
        },
      }).catch((error) => {
        console.error("Fetch error:", error)
        return null
      })

      if (sourceResponse && sourceResponse.ok) {
        const sourceData = await sourceResponse.json()

        if (sourceData.success) {
          // Map the servers with their embed URLs
          const sources = servers.map((server) => ({
            ...server,
            url:
              server.id === servers[0].id
                ? sourceData.link
                : `https://9animetv.to/ajax/episode/sources?id=${server.id}`,
            direct: false,
          }))

          return NextResponse.json({ sources })
        }
      }
    } catch (error) {
      console.error("Error fetching source data:", error)
    }

    // Fallback if source fetching fails
    return NextResponse.json({
      sources: [
        {
          id: "fallback",
          server: "Default",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          direct: true,
        },
        {
          id: "fallback-2",
          server: "Backup",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          direct: true,
        },
      ],
    })
  } catch (error) {
    console.error("Error fetching video sources:", error)
    return NextResponse.json({
      sources: [
        {
          id: "fallback",
          server: "Default",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          direct: true,
        },
        {
          id: "fallback-2",
          server: "Backup",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          direct: true,
        },
      ],
    })
  }
}

