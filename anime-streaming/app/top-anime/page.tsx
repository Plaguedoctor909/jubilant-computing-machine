"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"

// Top anime list (static data for this page)
const topAnimeList = [
  {
    id: "fullmetal-alchemist-brotherhood",
    title: "Fullmetal Alchemist: Brotherhood",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/f5/8b/f58b0204c20ae3310f65ae7b8cb9987e/f58b0204c20ae3310f65ae7b8cb9987e.jpg",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    rating: 9.1,
    year: 2009,
    rank: 1,
  },
  {
    id: "steins-gate",
    title: "Steins;Gate",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/92/75/9275052d9c8eed19498a3c1ef1f3bea9/9275052d9c8eed19498a3c1ef1f3bea9.jpg",
    genres: ["Drama", "Sci-Fi", "Thriller"],
    rating: 9.0,
    year: 2011,
    rank: 2,
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/83/ec/83ec769de7e427c41906dc8b9d18e227/83ec769de7e427c41906dc8b9d18e227.jpg",
    genres: ["Action", "Drama", "Fantasy"],
    rating: 8.9,
    year: 2013,
    rank: 3,
  },
  {
    id: "hunter-x-hunter-2011",
    title: "Hunter x Hunter (2011)",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/eb/5d/eb5d0d7f87c245c5b36f274d3b65870d/eb5d0d7f87c245c5b36f274d3b65870d.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 8.9,
    year: 2011,
    rank: 4,
  },
  {
    id: "death-note",
    title: "Death Note",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/95/92/9592ca36f0c146e6a8dbe2d7e43718d7/9592ca36f0c146e6a8dbe2d7e43718d7.jpg",
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
    rating: 8.8,
    year: 2006,
    rank: 5,
  },
  {
    id: "one-piece",
    title: "One Piece",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/8d/9d/8d9d3a296af7ceba7eee92a3a9f3f805/8d9d3a296af7ceba7eee92a3a9f3f805.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 8.7,
    year: 1999,
    rank: 6,
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b5/1f/b51f863b05f30576cf6d8c83c2d3ef45/b51f863b05f30576cf6d8c83c2d3ef45.jpg",
    genres: ["Action", "Supernatural"],
    rating: 8.7,
    year: 2019,
    rank: 7,
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/db/2f/db2f3ce7b9cab7fdbcbeb4d9d71c109d/db2f3ce7b9cab7fdbcbeb4d9d71c109d.jpg",
    genres: ["Action", "Supernatural"],
    rating: 8.6,
    year: 2020,
    rank: 8,
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/23/d5/23d56125b14c4ea0c85b5a1853f73039/23d56125b14c4ea0c85b5a1853f73039.jpg",
    genres: ["Action", "Adventure", "Drama", "Historical"],
    rating: 8.6,
    year: 2019,
    rank: 9,
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/d9/e6d9a5b8e5e6e6d9a5b8e5e6e6d9a5/frieren.jpg",
    genres: ["Adventure", "Fantasy", "Slice of Life"],
    rating: 8.5,
    year: 2023,
    rank: 10,
  },
  {
    id: "oshi-no-ko",
    title: "Oshi No Ko",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/oshi-no-ko.jpg",
    genres: ["Drama", "Supernatural"],
    rating: 8.5,
    year: 2023,
    rank: 11,
  },
  {
    id: "naruto-shippuden",
    title: "Naruto Shippuden",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/35/75/3575ca5985b5358f4399a195c4c42a6f/3575ca5985b5358f4399a195c4c42a6f.jpg",
    genres: ["Action", "Adventure", "Martial Arts"],
    rating: 8.4,
    year: 2007,
    rank: 12,
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b0/ef/b0ef51344ce21a0987f2e19aa1f2b009/b0ef51344ce21a0987f2e19aa1f2b009.jpg",
    genres: ["Action", "Superhero"],
    rating: 8.4,
    year: 2016,
    rank: 13,
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    image: "https://img.flawlessfiles.com/_r/300x400/100/79/d5/79d5a5b8a4e6e6d9a5b8e5e6e6d9a5b8/chainsaw-man.jpg",
    genres: ["Action", "Supernatural", "Horror"],
    rating: 8.3,
    year: 2022,
    rank: 14,
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/spy-family.jpg",
    genres: ["Action", "Comedy"],
    rating: 8.3,
    year: 2022,
    rank: 15,
  },
]

export default function TopAnimePage() {
  const [displayCount, setDisplayCount] = useState(10)

  const loadMore = () => {
    setDisplayCount(Math.min(displayCount + 5, topAnimeList.length))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Top Anime Series</h1>
          <p className="text-gray-400 mb-8">The highest rated anime series based on user ratings and popularity</p>

          <div className="space-y-6">
            {topAnimeList.slice(0, displayCount).map((anime) => (
              <div key={anime.id} className="flex flex-col md:flex-row gap-6 p-4 bg-gray-900/50 rounded-lg">
                <div className="relative w-full md:w-32 aspect-[2/3] overflow-hidden rounded-md flex-shrink-0">
                  <Image src={anime.image || "/placeholder.svg"} alt={anime.title} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{anime.title}</h2>
                      <p className="text-gray-400 text-sm">
                        {anime.year} • {anime.genres.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold">{anime.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <div className="flex items-center justify-center bg-purple-600 text-white w-8 h-8 rounded-full font-bold">
                      {anime.rank}
                    </div>
                    <div className="ml-4 space-x-2">
                      <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link href={`/anime/${anime.id}`}>Details</Link>
                      </Button>
                      <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
                        <Link href={`/watch/${anime.id}`}>Watch</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayCount < topAnimeList.length && (
            <div className="mt-8 flex justify-center">
              <Button onClick={loadMore} variant="outline" className="text-white border-white hover:bg-white/10 gap-2">
                Load More <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

