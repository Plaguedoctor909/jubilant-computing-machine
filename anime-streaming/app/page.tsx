import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { RecentlyWatchedSection } from "@/components/recently-watched-section"
import { FavoritesSection } from "@/components/favorites-section"
import { fetchTrendingAnime, fetchRecentAnime } from "@/lib/anime-service"

export default async function HomePage() {
  // Fetch trending and recent anime
  const trendingAnime = await fetchTrendingAnime()
  const recentAnime = await fetchRecentAnime()

  // Use the first trending anime for the hero section
  const featuredAnime = trendingAnime[0] || {
    id: "demon-slayer",
    title: "Demon Slayer",
    image: "/placeholder.svg?height=1080&width=1920",
    description:
      "Tanjiro Kamado's peaceful life is shattered when his family is attacked by demons. Join him on his quest to cure his sister and avenge his family.",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={featuredAnime.image || "/placeholder.svg?height=1080&width=1920"}
            alt={featuredAnime.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-20 md:px-16 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2 md:text-6xl">{featuredAnime.title}</h1>
          <p className="text-lg mb-6 text-gray-200 line-clamp-3">
            {featuredAnime.description ||
              "Watch the latest episodes of this popular anime series on Nosa's Anime Site."}
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href={`/watch/${featuredAnime.id}`}>Play</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href={`/anime/${featuredAnime.id}`}>More Info</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-6 md:px-16 py-8 space-y-12 bg-black">
        {/* Recently Watched Section (Client Component) */}
        <RecentlyWatchedSection />

        {/* Favorites Section (Client Component) */}
        <FavoritesSection />

        <div>
          <h2 className="text-xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingAnime.slice(0, 12).map((anime) => (
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
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent Episodes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentAnime.slice(0, 12).map((anime) => (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={anime.image || "/placeholder.svg?height=400&width=300"}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {anime.type && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      {anime.type}
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium line-clamp-1">{anime.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

