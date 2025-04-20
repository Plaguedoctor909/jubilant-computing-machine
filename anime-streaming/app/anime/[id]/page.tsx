"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"

interface AnimeDetailsPageProps {
  params: {
    id: string
  }
}

export default function AnimeDetailsPage({ params }: AnimeDetailsPageProps) {
  const [animeDetails, setAnimeDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/anime/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch anime details: ${response.status}`)
        }

        const data = await response.json()
        setAnimeDetails(data)
      } catch (error) {
        console.error("Error fetching anime details:", error)
        setError("Failed to load anime details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleFavoriteToggle = () => {
    if (!animeDetails) return

    if (isFavorite(animeDetails.id)) {
      removeFromFavorites(animeDetails.id)
      toast({
        title: "Removed from favorites",
        description: `${animeDetails.title} has been removed from your favorites.`,
      })
    } else {
      addToFavorites({
        id: animeDetails.id,
        title: animeDetails.title,
        image: animeDetails.image,
      })
      toast({
        title: "Added to favorites",
        description: `${animeDetails.title} has been added to your favorites.`,
      })
    }
  }

  // Fallback if no data is found or error
  if (error || (isLoading === false && !animeDetails)) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <Header />
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Anime Not Found</h1>
          <p className="mb-8">{error || "We couldn't find the anime you're looking for."}</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Hero Banner */}
          <section className="relative pt-16">
            <div className="relative h-[70vh] w-full">
              <Image
                src={animeDetails.image || "/placeholder.svg?height=1080&width=1920"}
                alt={animeDetails.title}
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-16">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-2 md:text-6xl">{animeDetails.title}</h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  {animeDetails.status && (
                    <Badge variant="outline" className="text-white border-white">
                      {animeDetails.status}
                    </Badge>
                  )}
                  {animeDetails.releaseDate && (
                    <Badge variant="outline" className="text-white border-white">
                      {animeDetails.releaseDate}
                    </Badge>
                  )}
                  {animeDetails.episodes > 0 && (
                    <Badge variant="outline" className="text-white border-white">
                      {animeDetails.episodes} Episodes
                    </Badge>
                  )}
                  {animeDetails.duration && (
                    <Badge variant="outline" className="text-white border-white">
                      {animeDetails.duration}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {animeDetails.genres?.map((genre: string) => (
                    <Badge key={genre} className="bg-purple-600 hover:bg-purple-700">
                      <Link href={`/browse?genre=${genre.toLowerCase()}`}>{genre}</Link>
                    </Badge>
                  ))}
                </div>

                <p className="text-lg mb-8 text-gray-200 max-w-2xl">{animeDetails.description}</p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Play className="h-5 w-5 fill-current" />
                    <Link href={`/watch/${animeDetails.id}`}>Watch Now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white/10 gap-2"
                    onClick={handleFavoriteToggle}
                  >
                    {isFavorite(animeDetails.id) ? (
                      <>
                        <X className="h-5 w-5" />
                        Remove from Favorites
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5" />
                        Add to Favorites
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Details Section */}
          <section className="px-6 md:px-16 py-12 bg-black">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">About {animeDetails.title}</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {animeDetails.studios?.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 mb-2">Studios</h3>
                      <p>{animeDetails.studios.join(", ")}</p>
                    </div>
                  )}
                  {animeDetails.releaseDate && (
                    <div>
                      <h3 className="text-gray-400 mb-2">Released</h3>
                      <p>{animeDetails.releaseDate}</p>
                    </div>
                  )}
                  {animeDetails.status && (
                    <div>
                      <h3 className="text-gray-400 mb-2">Status</h3>
                      <p>{animeDetails.status}</p>
                    </div>
                  )}
                  {animeDetails.genres?.length > 0 && (
                    <div>
                      <h3 className="text-gray-400 mb-2">Genres</h3>
                      <p>{animeDetails.genres.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Episodes</h2>
                <div className="space-y-4">
                  {animeDetails.episodes > 0 ? (
                    [...Array(Math.min(5, animeDetails.episodes))].map((_, i) => (
                      <Link href={`/watch/${animeDetails.id}?ep=${i + 1}`} key={i} className="block">
                        <div className="flex gap-4 p-3 rounded-md hover:bg-gray-900 transition-colors">
                          <div className="relative w-32 aspect-video rounded overflow-hidden">
                            <Image
                              src={animeDetails.image || "/placeholder.svg?height=180&width=320"}
                              alt={`Episode ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Episode {i + 1}</p>
                            <h4 className="font-medium">Episode {i + 1}</h4>
                            <p className="text-sm text-gray-400">{animeDetails.duration || "Unknown"}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-400">No episodes available</p>
                  )}
                  {animeDetails.episodes > 5 && (
                    <Button variant="outline" className="w-full">
                      View All Episodes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Related Anime */}
          {animeDetails.relatedAnime?.length > 0 && (
            <section className="px-6 md:px-16 py-12 bg-black">
              <h2 className="text-2xl font-bold mb-6">Related Anime</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {animeDetails.relatedAnime.slice(0, 12).map((anime: any) => (
                  <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                      <Image
                        src={anime.image || "/placeholder.svg?height=400&width=300"}
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-medium line-clamp-1">{anime.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="pt-16">
      {/* Hero Banner Skeleton */}
      <section className="relative">
        <div className="relative h-[70vh] w-full bg-gray-800" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-16">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-3/4 bg-gray-700 mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-20 bg-gray-700" />
              <Skeleton className="h-6 w-24 bg-gray-700" />
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16 bg-gray-700" />
              <Skeleton className="h-6 w-20 bg-gray-700" />
              <Skeleton className="h-6 w-24 bg-gray-700" />
            </div>
            <Skeleton className="h-24 w-full bg-gray-700 mb-8" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-gray-700" />
              <Skeleton className="h-12 w-40 bg-gray-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Details Section Skeleton */}
      <section className="px-6 md:px-16 py-12 bg-black">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-48 bg-gray-700 mb-4" />
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <Skeleton className="h-6 w-24 bg-gray-700 mb-2" />
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </div>
              <div>
                <Skeleton className="h-6 w-24 bg-gray-700 mb-2" />
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </div>
              <div>
                <Skeleton className="h-6 w-24 bg-gray-700 mb-2" />
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </div>
              <div>
                <Skeleton className="h-6 w-24 bg-gray-700 mb-2" />
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </div>
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-32 bg-gray-700 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-3">
                  <Skeleton className="w-32 h-20 bg-gray-700" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 bg-gray-700 mb-2" />
                    <Skeleton className="h-5 w-32 bg-gray-700 mb-2" />
                    <Skeleton className="h-4 w-16 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

