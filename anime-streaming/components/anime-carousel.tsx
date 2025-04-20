"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnimeCarouselProps {
  title: string
}

export default function AnimeCarousel({ title }: AnimeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = 5 // Number of items - visible items

  const carouselRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.offsetWidth / 2.5
      carouselRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  // Sample anime data
  const animeList = [
    { id: 1, title: "Attack on Titan", image: "/placeholder.svg?height=400&width=600" },
    { id: 2, title: "My Hero Academia", image: "/placeholder.svg?height=400&width=600" },
    { id: 3, title: "Jujutsu Kaisen", image: "/placeholder.svg?height=400&width=600" },
    { id: 4, title: "One Piece", image: "/placeholder.svg?height=400&width=600" },
    { id: 5, title: "Demon Slayer", image: "/placeholder.svg?height=400&width=600" },
    { id: 6, title: "Chainsaw Man", image: "/placeholder.svg?height=400&width=600" },
    { id: 7, title: "Spy x Family", image: "/placeholder.svg?height=400&width=600" },
    { id: 8, title: "Tokyo Revengers", image: "/placeholder.svg?height=400&width=600" },
  ]

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div ref={carouselRef} className="flex gap-2 overflow-x-hidden scroll-smooth pb-4">
          {animeList.map((anime) => (
            <div key={anime.id} className="flex-none w-[40%] md:w-[30%] lg:w-[20%] relative group/item">
              <Link href={`/anime/${anime.id}`}>
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={anime.image || "/placeholder.svg"}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium line-clamp-1">{anime.title}</h3>
              </Link>

              <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <Button size="icon" className="rounded-full bg-white text-black hover:bg-white/90 w-8 h-8">
                  <Play className="h-4 w-4 fill-current" />
                </Button>
                <Button size="icon" className="rounded-full bg-gray-800/80 hover:bg-gray-700/80 w-8 h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}

