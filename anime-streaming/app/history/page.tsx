"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { useRecentlyWatched } from "@/hooks/use-recently-watched"
import { formatDistanceToNow } from "date-fns"

export default function HistoryPage() {
  const { recentlyWatched, clearRecentlyWatched } = useRecentlyWatched()
  const [mounted, setMounted] = useState(false)

  // Only show after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format the timestamp to a relative time (e.g., "2 hours ago")
  const formatWatchTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true })
    } catch (error) {
      return "recently"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Watch History</h1>
            {mounted && recentlyWatched.length > 0 && (
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10 gap-2"
                onClick={clearRecentlyWatched}
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            )}
          </div>

          {!mounted ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : recentlyWatched.length > 0 ? (
            <div className="space-y-6">
              {recentlyWatched.map((anime) => (
                <div
                  key={`${anime.id}-${anime.episodeNumber}`}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900/50 rounded-lg"
                >
                  <div className="relative w-full sm:w-48 aspect-video rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={anime.image || "/placeholder.svg?height=400&width=600"}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div className="h-full bg-purple-600 w-1/3"></div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-medium mb-1">{anime.title}</h2>
                      <p className="text-sm text-gray-400 mb-2">Episode {anime.episodeNumber}</p>
                      <p className="text-xs text-gray-500">Watched {formatWatchTime(anime.timestamp)}</p>
                    </div>

                    <div className="mt-4">
                      <Button asChild className="bg-purple-600 hover:bg-purple-700 gap-2">
                        <Link href={`/watch/${anime.id}?ep=${anime.episodeNumber}`}>
                          <Play className="h-4 w-4 fill-current" />
                          Continue Watching
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Your watch history is empty</h2>
              <p className="text-gray-400 mb-8">Start watching anime to build your history.</p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/browse">Browse Anime</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

