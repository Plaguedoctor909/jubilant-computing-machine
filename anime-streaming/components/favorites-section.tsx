"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import { Button } from "@/components/ui/button"
import { Play, Heart } from "lucide-react"

export function FavoritesSection() {
  const { favorites, removeFromFavorites } = useFavorites()
  const [mounted, setMounted] = useState(false)

  // Only show after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (favorites.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Favorites</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {favorites.map((anime) => (
          <div key={anime.id} className="group relative">
            <Link href={`/anime/${anime.id}`}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                <Image
                  src={anime.image || "/placeholder.svg?height=400&width=300"}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                </div>
              </div>
            </Link>
            <Button
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFromFavorites(anime.id)}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
            <Button
              size="icon"
              className="absolute bottom-2 right-2 rounded-full bg-purple-600 hover:bg-purple-700 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              asChild
            >
              <Link href={`/watch/${anime.id}`}>
                <Play className="h-4 w-4 fill-current" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

