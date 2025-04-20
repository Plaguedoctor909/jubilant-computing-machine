"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRecentlyWatched } from "@/hooks/use-recently-watched"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function RecentlyWatchedSection() {
  const { recentlyWatched, clearRecentlyWatched } = useRecentlyWatched()
  const [mounted, setMounted] = useState(false)

  // Only show after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (recentlyWatched.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Continue Watching</h2>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={clearRecentlyWatched}>
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyWatched.map((anime) => (
          <Link
            key={`${anime.id}-${anime.episodeNumber}`}
            href={`/watch/${anime.id}?ep=${anime.episodeNumber}`}
            className="group"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={anime.image || "/placeholder.svg?height=400&width=600"}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <div>
                  <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                  <p className="text-xs text-gray-300">Episode {anime.episodeNumber}</p>
                </div>
                <Button size="icon" className="rounded-full bg-purple-600 hover:bg-purple-700 w-8 h-8">
                  <Play className="h-4 w-4 fill-current" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-purple-600 w-1/3"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

