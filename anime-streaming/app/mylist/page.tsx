"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { useFavorites } from "@/hooks/use-favorites"

export default function MyListPage() {
  const { favorites, removeFromFavorites } = useFavorites()
  const [mounted, setMounted] = useState(false)

  // Only show after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My List</h1>

          {!mounted ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Your list is empty</h2>
              <p className="text-gray-400 mb-8">
                Add your favorite anime to your list by clicking the heart icon on the anime details page.
              </p>
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

