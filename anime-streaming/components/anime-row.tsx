import Image from "next/image"
import Link from "next/link"

interface AnimeRowProps {
  title: string
}

export default function AnimeRow({ title }: AnimeRowProps) {
  // Sample anime data
  const animeList = [
    { id: 1, title: "Attack on Titan", image: "/placeholder.svg?height=400&width=600" },
    { id: 2, title: "My Hero Academia", image: "/placeholder.svg?height=400&width=600" },
    { id: 3, title: "Jujutsu Kaisen", image: "/placeholder.svg?height=400&width=600" },
    { id: 4, title: "One Piece", image: "/placeholder.svg?height=400&width=600" },
    { id: 5, title: "Demon Slayer", image: "/placeholder.svg?height=400&width=600" },
    { id: 6, title: "Chainsaw Man", image: "/placeholder.svg?height=400&width=600" },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeList.map((anime) => (
          <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={anime.image || "/placeholder.svg"}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium line-clamp-1">{anime.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

