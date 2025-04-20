"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { getPopularGenres } from "@/lib/anime-service"

// Get genres from the anime service
const genres = getPopularGenres()

// Sample anime data for fallback
const fallbackAnimeList = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cddd76d8e21d0b2c9a6b12cc8e4e/5490cddd76d8e21d0b2c9a6b12cc8e4e.jpg",
    genre: "Action",
  },
  {
    id: "one-piece",
    title: "One Piece",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/8d/9d/8d9d3a296af7ceba7eee92a3a9f3f805/8d9d3a296af7ceba7eee92a3a9f3f805.jpg",
    genre: "Adventure",
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b5/1f/b51f863b05f30576cf6d8c83c2d3ef45/b51f863b05f30576cf6d8c83c2d3ef45.jpg",
    genre: "Action",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/db/2f/db2f3ce7b9cab7fdbcbeb4d9d71c109d/db2f3ce7b9cab7fdbcbeb4d9d71c109d.jpg",
    genre: "Supernatural",
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b0/ef/b0ef51344ce21a0987f2e19aa1f2b009/b0ef51344ce21a0987f2e19aa1f2b009.jpg",
    genre: "Action",
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/83/ec/83ec769de7e427c41906dc8b9d18e227/83ec769de7e427c41906dc8b9d18e227.jpg",
    genre: "Drama",
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    image: "https://img.flawlessfiles.com/_r/300x400/100/79/d5/79d5a5b8a4e6e6d9a5b8e5e6e6d9a5b8/chainsaw-man.jpg",
    genre: "Horror",
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/spy-family.jpg",
    genre: "Comedy",
  },
  {
    id: "tokyo-revengers",
    title: "Tokyo Revengers",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/d9/e6d9a5b8e5e6e6d9a5b8e5e6e6d9a5/tokyo-revengers.jpg",
    genre: "Drama",
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/23/d5/23d56125b14c4ea0c85b5a1853f73039/23d56125b14c4ea0c85b5a1853f73039.jpg",
    genre: "Historical",
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/9f/8d/9f8d4a6304069f5af3635969f3a105d8/9f8d4a6304069f5af3635969f3a105d8.jpg",
    genre: "Sports",
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/d9/e6d9a5b8e5e6e6d9a5b8e5e6e6d9a5/frieren.jpg",
    genre: "Fantasy",
  },
  {
    id: "the-100-girlfriends",
    title: "The 100 Girlfriends Who Really, Really, Really, Really, Really Love You",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/60/b9/60b960efb02e9a4c5b397d8d029c37d4/60b960efb02e9a4c5b397d8d029c37d4.jpg",
    genre: "Comedy",
  },
  {
    id: "dandadan",
    title: "Dandadan",
    image: "https://img.flawlessfiles.com/_r/300x400/100/b8/e5/b8e5e6e6d9a5b8e5e6e6d9a5b8e5e6/dandadan.jpg",
    genre: "Supernatural",
  },
  {
    id: "kaiju-no-8",
    title: "Kaiju No. 8",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/kaiju-no-8.jpg",
    genre: "Sci-Fi",
  },
  {
    id: "oshi-no-ko",
    title: "Oshi No Ko",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/oshi-no-ko.jpg",
    genre: "Drama",
  },
  {
    id: "mushoku-tensei",
    title: "Mushoku Tensei: Jobless Reincarnation",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e5/e6/e5e6e6d9a5b8e5e6e6d9a5b8e5e6e6/mushoku-tensei.jpg",
    genre: "Fantasy",
  },
  {
    id: "dr-stone",
    title: "Dr. STONE",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/e6/e6e6d9a5b8e5e6e6d9a5b8e5e6e6d9/dr-stone.jpg",
    genre: "Sci-Fi",
  },
  {
    id: "kaguya-sama",
    title: "Kaguya-sama: Love is War",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/kaguya-sama.jpg",
    genre: "Romance",
  },
  {
    id: "mob-psycho-100",
    title: "Mob Psycho 100",
    image: "https://img.flawlessfiles.com/_r/300x400/100/b8/e5/b8e5e6e6d9a5b8e5e6e6d9a5b8e5e6/mob-psycho.jpg",
    genre: "Supernatural",
  },
  {
    id: "made-in-abyss",
    title: "Made in Abyss",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/made-in-abyss.jpg",
    genre: "Adventure",
  },
  {
    id: "naruto",
    title: "Naruto",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/d5/b0/d5b0e8f9bbd596d780a1a4bf945f9cbf/d5b0e8f9bbd596d780a1a4bf945f9cbf.jpg",
    genre: "Action",
  },
  {
    id: "naruto-shippuden",
    title: "Naruto Shippuden",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/35/75/3575ca5985b5358f4399a195c4c42a6f/3575ca5985b5358f4399a195c4c42a6f.jpg",
    genre: "Action",
  },
  {
    id: "death-note",
    title: "Death Note",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/95/92/9592ca36f0c146e6a8dbe2d7e43718d7/9592ca36f0c146e6a8dbe2d7e43718d7.jpg",
    genre: "Thriller",
  },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [animeList, setAnimeList] = useState(fallbackAnimeList)
  const [isLoading, setIsLoading] = useState(false)
  const [activeGenre, setActiveGenre] = useState("all")

  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q")
  const genreParam = searchParams.get("genre")

  // Handle search from URL parameter
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
      searchAnime(queryParam)
    } else if (genreParam) {
      setActiveGenre(genreParam.toLowerCase())
      fetchAnimeByGenre(genreParam)
    } else {
      // Load all anime if no search query
      fetchAllAnime()
    }
  }, [queryParam, genreParam])

  // Fetch all anime
  const fetchAllAnime = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API
      const response = await fetch("/api/anime/all")

      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Map API results to our format
          const mappedResults = data.results.map((anime: any) => ({
            id: anime.id,
            title: anime.title,
            image: anime.image,
            genre: anime.genres?.[0] || "Unknown",
          }))
          setAnimeList(mappedResults)
        } else {
          // Use fallback if API returns empty results
          setAnimeList(fallbackAnimeList)
        }
      } else {
        // Use fallback if API fails
        setAnimeList(fallbackAnimeList)
      }
    } catch (error) {
      console.error("Error fetching anime:", error)
      // Use fallback on error
      setAnimeList(fallbackAnimeList)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch anime by genre
  const fetchAnimeByGenre = async (genre: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/genre/${genre}`)

      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Map API results to our format
          const mappedResults = data.results.map((anime: any) => ({
            id: anime.id,
            title: anime.title,
            image: anime.image,
            genre: anime.genres?.[0] || genre || "Unknown",
          }))
          setAnimeList(mappedResults)
        } else {
          // Filter fallback data if API returns empty results
          const filteredResults = fallbackAnimeList.filter((anime) => anime.genre.toLowerCase() === genre.toLowerCase())
          setAnimeList(filteredResults)
        }
      } else {
        // Filter fallback data if API fails
        const filteredResults = fallbackAnimeList.filter((anime) => anime.genre.toLowerCase() === genre.toLowerCase())
        setAnimeList(filteredResults)
      }
    } catch (error) {
      console.error(`Error fetching anime by genre ${genre}:`, error)
      // Filter fallback data on error
      const filteredResults = fallbackAnimeList.filter((anime) => anime.genre.toLowerCase() === genre.toLowerCase())
      setAnimeList(filteredResults)
    } finally {
      setIsLoading(false)
    }
  }

  // Search anime
  const searchAnime = async (query: string) => {
    if (!query.trim()) {
      fetchAllAnime()
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Map API results to our format
          const mappedResults = data.results.map((anime: any) => ({
            id: anime.id,
            title: anime.title,
            image: anime.image,
            genre: anime.genres?.[0] || "Unknown",
          }))
          setAnimeList(mappedResults)
        } else {
          // Filter fallback data if API returns empty results
          const filteredResults = fallbackAnimeList.filter((anime) =>
            anime.title.toLowerCase().includes(query.toLowerCase()),
          )
          setAnimeList(filteredResults)
        }
      } else {
        // Filter fallback data if API fails
        const filteredResults = fallbackAnimeList.filter((anime) =>
          anime.title.toLowerCase().includes(query.toLowerCase()),
        )
        setAnimeList(filteredResults)
      }
    } catch (error) {
      console.error("Error searching anime:", error)
      // Filter fallback data on error
      const filteredResults = fallbackAnimeList.filter((anime) =>
        anime.title.toLowerCase().includes(query.toLowerCase()),
      )
      setAnimeList(filteredResults)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAnime(searchQuery)
  }

  // Filter anime by genre
  const getAnimeByGenre = (genre: string) => {
    if (genre === "all") {
      return animeList
    }
    return animeList.filter((anime) => anime.genre.toLowerCase() === genre.toLowerCase())
  }

  // Handle genre tab change
  const handleGenreChange = (value: string) => {
    setActiveGenre(value)
    if (value !== "all") {
      fetchAnimeByGenre(value)
    } else {
      fetchAllAnime()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Browse Anime</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for anime, genres, or characters..."
              className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Genre Tabs */}
          <Tabs defaultValue="all" value={activeGenre} onValueChange={handleGenreChange} className="mb-12">
            <TabsList className="bg-gray-900 p-1 overflow-x-auto flex flex-nowrap max-w-full no-scrollbar">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All
              </TabsTrigger>
              {genres.map((genre) => (
                <TabsTrigger
                  key={genre}
                  value={genre.toLowerCase()}
                  className="data-[state=active]:bg-purple-600 whitespace-nowrap"
                >
                  {genre}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : animeList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {animeList.map((anime) => (
                    <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                        <Image
                          src={anime.image || "/placeholder.svg?height=400&width=300"}
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div>
                            <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                            <p className="text-xs text-gray-300">{anime.genre}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No anime found matching your search.</p>
                </div>
              )}

              {animeList.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Load More
                  </Button>
                </div>
              )}
            </TabsContent>

            {genres.map((genre) => (
              <TabsContent key={genre} value={genre.toLowerCase()} className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : getAnimeByGenre(genre.toLowerCase()).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {getAnimeByGenre(genre.toLowerCase()).map((anime) => (
                      <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                          <Image
                            src={anime.image || "/placeholder.svg?height=400&width=300"}
                            alt={anime.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <h3 className="font-medium line-clamp-1">{anime.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No anime found in this genre.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

