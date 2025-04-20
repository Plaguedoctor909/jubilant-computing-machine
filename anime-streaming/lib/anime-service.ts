"use server"

import { load } from "cheerio"

export interface AnimeItem {
  id: string
  title: string
  image: string
  url: string
  type?: string
  episodes?: number
  rating?: string
  genres?: string[]
}

export interface AnimeDetails extends AnimeItem {
  description: string
  status: string
  releaseDate: string
  studios: string[]
  episodes: number
  duration: string
  relatedAnime: AnimeItem[]
}

export interface EpisodeSource {
  url: string
  quality: string
  server: string
}

const BASE_URL = "https://9animetv.to"

// Expanded list of trending anime based on 9animetv.to's popular titles
const MOCK_TRENDING_ANIME: AnimeItem[] = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cddd76d8e21d0b2c9a6b12cc8e4e/5490cddd76d8e21d0b2c9a6b12cc8e4e.jpg",
    url: "/anime/solo-leveling",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "one-piece",
    title: "One Piece",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/8d/9d/8d9d3a296af7ceba7eee92a3a9f3f805/8d9d3a296af7ceba7eee92a3a9f3f805.jpg",
    url: "/anime/one-piece",
    type: "TV",
    episodes: 1100,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b5/1f/b51f863b05f30576cf6d8c83c2d3ef45/b51f863b05f30576cf6d8c83c2d3ef45.jpg",
    url: "/anime/demon-slayer",
    type: "TV",
    episodes: 44,
    genres: ["Action", "Supernatural"],
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/db/2f/db2f3ce7b9cab7fdbcbeb4d9d71c109d/db2f3ce7b9cab7fdbcbeb4d9d71c109d.jpg",
    url: "/anime/jujutsu-kaisen",
    type: "TV",
    episodes: 35,
    genres: ["Action", "Supernatural"],
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b0/ef/b0ef51344ce21a0987f2e19aa1f2b009/b0ef51344ce21a0987f2e19aa1f2b009.jpg",
    url: "/anime/my-hero-academia",
    type: "TV",
    episodes: 113,
    genres: ["Action", "Superhero"],
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/83/ec/83ec769de7e427c41906dc8b9d18e227/83ec769de7e427c41906dc8b9d18e227.jpg",
    url: "/anime/attack-on-titan",
    type: "TV",
    episodes: 88,
    genres: ["Action", "Drama", "Fantasy"],
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    image: "https://img.flawlessfiles.com/_r/300x400/100/79/d5/79d5a5b8e5e6e6d9a5b8e5e6e6d9a5b8/chainsaw-man.jpg",
    url: "/anime/chainsaw-man",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Supernatural", "Horror"],
  },
  {
    id: "naruto",
    title: "Naruto",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/d5/b0/d5b0e8f9bbd596d780a1a4bf945f9cbf/d5b0e8f9bbd596d780a1a4bf945f9cbf.jpg",
    url: "/anime/naruto",
    type: "TV",
    episodes: 220,
    genres: ["Action", "Adventure", "Martial Arts"],
  },
  {
    id: "naruto-shippuden",
    title: "Naruto Shippuden",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/35/75/3575ca5985b5358f4399a195c4c42a6f/3575ca5985b5358f4399a195c4c42a6f.jpg",
    url: "/anime/naruto-shippuden",
    type: "TV",
    episodes: 500,
    genres: ["Action", "Adventure", "Martial Arts"],
  },
  {
    id: "death-note",
    title: "Death Note",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/95/92/9592ca36f0c146e6a8dbe2d7e43718d7/9592ca36f0c146e6a8dbe2d7e43718d7.jpg",
    url: "/anime/death-note",
    type: "TV",
    episodes: 37,
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
  },
  {
    id: "fullmetal-alchemist-brotherhood",
    title: "Fullmetal Alchemist: Brotherhood",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/f5/8b/f58b0204c20ae3310f65ae7b8cb9987e/f58b0204c20ae3310f65ae7b8cb9987e.jpg",
    url: "/anime/fullmetal-alchemist-brotherhood",
    type: "TV",
    episodes: 64,
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
  },
  {
    id: "hunter-x-hunter-2011",
    title: "Hunter x Hunter (2011)",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/eb/5d/eb5d0d7f87c245c5b36f274d3b65870d/eb5d0d7f87c245c5b36f274d3b65870d.jpg",
    url: "/anime/hunter-x-hunter-2011",
    type: "TV",
    episodes: 148,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "dragon-ball-z",
    title: "Dragon Ball Z",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/f1/9f/f19f1c93e4c4520317a712db172b6a82/f19f1c93e4c4520317a712db172b6a82.jpg",
    url: "/anime/dragon-ball-z",
    type: "TV",
    episodes: 291,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "dragon-ball-super",
    title: "Dragon Ball Super",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/7b/a9/7ba93c6ea46ce799fa180aec55216a6b/7ba93c6ea46ce799fa180aec55216a6b.jpg",
    url: "/anime/dragon-ball-super",
    type: "TV",
    episodes: 131,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "bleach",
    title: "Bleach",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/4c/12/4c12663d595052cff9f3a8ee9cd498e3/4c12663d595052cff9f3a8ee9cd498e3.jpg",
    url: "/anime/bleach",
    type: "TV",
    episodes: 366,
    genres: ["Action", "Adventure", "Supernatural"],
  },
  {
    id: "bleach-thousand-year-blood-war",
    title: "Bleach: Thousand-Year Blood War",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/dd/c2/ddc2aeec58d83a954f182fd40de85c68/ddc2aeec58d83a954f182fd40de85c68.jpg",
    url: "/anime/bleach-thousand-year-blood-war",
    type: "TV",
    episodes: 26,
    genres: ["Action", "Adventure", "Supernatural"],
  },
  {
    id: "tokyo-ghoul",
    title: "Tokyo Ghoul",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/fa/2d/fa2d37a192986abcc85bf798affc9b81/fa2d37a192986abcc85bf798affc9b81.jpg",
    url: "/anime/tokyo-ghoul",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Horror", "Psychological", "Supernatural"],
  },
  {
    id: "black-clover",
    title: "Black Clover",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/46/e2/46e2001fb9961be557689733e969025e/46e2001fb9961be557689733e969025e.jpg",
    url: "/anime/black-clover",
    type: "TV",
    episodes: 170,
    genres: ["Action", "Comedy", "Fantasy", "Magic"],
  },
  {
    id: "fairy-tail",
    title: "Fairy Tail",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/25/f8/25f82de2bdefd969fda97179c475d899/25f82de2bdefd969fda97179c475d899.jpg",
    url: "/anime/fairy-tail",
    type: "TV",
    episodes: 328,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/spy-family.jpg",
    url: "/anime/spy-x-family",
    type: "TV",
    episodes: 25,
    genres: ["Action", "Comedy"],
  },
]

// Updated recent anime based on 9animetv.to
const MOCK_RECENT_ANIME: AnimeItem[] = [
  {
    id: "the-100-girlfriends",
    title: "The 100 Girlfriends Who Really, Really, Really, Really, Really Love You",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/60/b9/60b960efb02e9a4c5b397d8d029c37d4/60b960efb02e9a4c5b397d8d029c37d4.jpg",
    url: "/anime/the-100-girlfriends",
    type: "TV",
    episodes: 12,
    genres: ["Comedy", "Romance", "Harem"],
  },
  {
    id: "sakamoto-days",
    title: "Sakamoto Days",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/a4/d4/a4d4547125a7d8e6b9a15f1ce046c477/a4d4547125a7d8e6b9a15f1ce046c477.jpg",
    url: "/anime/sakamoto-days",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Comedy"],
  },
  {
    id: "rezero-s3",
    title: "Re:ZERO -Starting Life in Another World- Season 3",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg",
    url: "/anime/rezero-s3",
    type: "TV",
    episodes: 12,
    genres: ["Drama", "Fantasy", "Thriller"],
  },
  {
    id: "alchemist-of-all-time",
    title: "Possibly the Greatest Alchemist of All Time",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/8c/a3/8ca3a15d954c5ef9d871f9d2d8f5c7db/8ca3a15d954c5ef9d871f9d2d8f5c7db.jpg",
    url: "/anime/alchemist-of-all-time",
    type: "TV",
    episodes: 12,
    genres: ["Fantasy", "Adventure"],
  },
  {
    id: "phantom-trigger",
    title: "Grisaia: Phantom Trigger",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/d5/b9/d5b9f53c3b7a1d1a93c8e8d2d9a0bd0d/d5b9f53c3b7a1d1a93c8e8d2d9a0bd0d.jpg",
    url: "/anime/phantom-trigger",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Drama"],
  },
  {
    id: "magic-maker",
    title: "Magic Maker: How to Make Magic in Another World",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/a9/e4/a9e4a12a96b5a1a1f5ec1e41a7e82e1e/a9e4a12a96b5a1a1f5ec1e41a7e82e1e.jpg",
    url: "/anime/magic-maker",
    type: "TV",
    episodes: 12,
    genres: ["Fantasy", "Isekai"],
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/d9/e6d9a5b8e5e6e6d9a5b8e5e6e6d9a5/frieren.jpg",
    url: "/anime/frieren",
    type: "TV",
    episodes: 28,
    genres: ["Adventure", "Fantasy", "Slice of Life"],
  },
  {
    id: "dandadan",
    title: "Dandadan",
    image: "https://img.flawlessfiles.com/_r/300x400/100/b8/e5/b8e5e6e6d9a5b8e5e6e6d9a5b8e5e6/dandadan.jpg",
    url: "/anime/dandadan",
    type: "TV",
    episodes: 12,
    genres: ["Supernatural", "Comedy", "Action"],
  },
  {
    id: "kaiju-no-8",
    title: "Kaiju No. 8",
    image: "https://img.flawlessfiles.com/_r/300x400/100/a5/b8/a5b8e5e6e6d9a5b8e5e6e6d9a5b8e5/kaiju-no-8.jpg",
    url: "/anime/kaiju-no-8",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Sci-Fi"],
  },
  {
    id: "wind-breaker",
    title: "Wind Breaker",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e5/e6/e5e6e6d9a5b8e5e6e6d9a5b8e5e6e6/wind-breaker.jpg",
    url: "/anime/wind-breaker",
    type: "TV",
    episodes: 12,
    genres: ["Action", "Drama"],
  },
  {
    id: "konosuba-s3",
    title: "KonoSuba: God's Blessing on This Wonderful World! Season 3",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/konosuba-s3.jpg",
    url: "/anime/konosuba-s3",
    type: "TV",
    episodes: 12,
    genres: ["Comedy", "Fantasy"],
  },
  {
    id: "classroom-of-the-elite-s3",
    title: "Classroom of the Elite Season 3",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/e6/e6e6d9a5b8e5e6e6d9a5b8e5e6e6d9/classroom-elite-s3.jpg",
    url: "/anime/classroom-of-the-elite-s3",
    type: "TV",
    episodes: 13,
    genres: ["Drama", "Psychological"],
  },
  {
    id: "tower-of-god-s2",
    title: "Tower of God Season 2",
    image: "https://img.flawlessfiles.com/_r/300x400/100/b8/e5/b8e5e6e6d9a5b8e5e6e6d9a5b8e5e6/tower-of-god-s2.jpg",
    url: "/anime/tower-of-god-s2",
    type: "TV",
    episodes: 13,
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "oshi-no-ko",
    title: "Oshi No Ko",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/oshi-no-ko.jpg",
    url: "/anime/oshi-no-ko",
    type: "TV",
    episodes: 11,
    genres: ["Drama", "Supernatural"],
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/23/d5/23d56125b14c4ea0c85b5a1853f73039/23d56125b14c4ea0c85b5a1853f73039.jpg",
    url: "/anime/vinland-saga",
    type: "TV",
    episodes: 24,
    genres: ["Action", "Adventure", "Drama", "Historical"],
  },
  {
    id: "vinland-saga-season-2",
    title: "Vinland Saga Season 2",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/87/30/87303683b209f89f49e42c5f1e256b3c/87303683b209f89f49e42c5f1e256b3c.jpg",
    url: "/anime/vinland-saga-season-2",
    type: "TV",
    episodes: 24,
    genres: ["Action", "Adventure", "Drama", "Historical"],
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/9f/8d/9f8d4a6304069f5af3635969f3a105d8/9f8d4a6304069f5af3635969f3a105d8.jpg",
    url: "/anime/blue-lock",
    type: "TV",
    episodes: 24,
    genres: ["Sports", "Drama"],
  },
  {
    id: "haikyuu",
    title: "Haikyuu!!",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b4/ae/b4ae30d1e928f2852c7f52c8a9f0b211/b4ae30d1e928f2852c7f52c8a9f0b211.jpg",
    url: "/anime/haikyuu",
    type: "TV",
    episodes: 25,
    genres: ["Comedy", "Drama", "Sports"],
  },
  {
    id: "steins-gate",
    title: "Steins;Gate",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/92/75/9275052d9c8eed19498a3c1ef1f3bea9/9275052d9c8eed19498a3c1ef1f3bea9.jpg",
    url: "/anime/steins-gate",
    type: "TV",
    episodes: 24,
    genres: ["Drama", "Sci-Fi", "Thriller"],
  },
]

// Additional genres to match the expanded anime collection
const ALL_ANIME = [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]

// Expand the top-rated anime details
const MOCK_ANIME_DETAILS: Record<string, AnimeDetails> = {
  "solo-leveling": {
    id: "solo-leveling",
    title: "Solo Leveling",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cddd76d8e21d0b2c9a6b12cc8e4e/5490cddd76d8e21d0b2c9a6b12cc8e4e.jpg",
    url: "/anime/solo-leveling",
    description:
      'In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect humanity, Sung Jinwoo, the weakest hunter of all mankind, finds himself in a mysterious "System" that allows him to level up in ways that no one else can.',
    status: "Ongoing",
    releaseDate: "2024",
    studios: ["A-1 Pictures"],
    episodes: 12,
    duration: "24 min per ep",
    genres: ["Action", "Adventure", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(1, 5),
  },
  "demon-slayer": {
    id: "demon-slayer",
    title: "Demon Slayer",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b5/1f/b51f863b05f30576cf6d8c83c2d3ef45/b51f863b05f30576cf6d8c83c2d3ef45.jpg",
    url: "/anime/demon-slayer",
    description:
      "Tanjiro Kamado's peaceful life is shattered when his family is attacked by demons. Join him on his quest to cure his sister and avenge his family.",
    status: "Ongoing",
    releaseDate: "2019",
    studios: ["ufotable"],
    episodes: 44,
    duration: "24 min per ep",
    genres: ["Action", "Supernatural"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(0, 4),
  },
  "jujutsu-kaisen": {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/db/2f/db2f3ce7b9cab7fdbcbeb4d9d71c109d/db2f3ce7b9cab7fdbcbeb4d9d71c109d.jpg",
    url: "/anime/jujutsu-kaisen",
    description:
      "Yuji Itadori, a high school student with exceptional physical abilities, gets involved in the world of Jujutsu Sorcery when he swallows a cursed object to protect his friends, becoming the host of Sukuna, the 'King of Curses'.",
    status: "Ongoing",
    releaseDate: "2020",
    studios: ["MAPPA"],
    episodes: 35,
    duration: "24 min per ep",
    genres: ["Action", "Supernatural"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(2, 6),
  },
  "one-piece": {
    id: "one-piece",
    title: "One Piece",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/8d/9d/8d9d3a296af7ceba7eee92a3a9f3f805/8d9d3a296af7ceba7eee92a3a9f3f805.jpg",
    url: "/anime/one-piece",
    description:
      "Gol D. Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.",
    status: "Ongoing",
    releaseDate: "1999",
    studios: ["Toei Animation"],
    episodes: 1100,
    duration: "24 min per ep",
    genres: ["Action", "Adventure", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(4, 8),
  },
  "attack-on-titan": {
    id: "attack-on-titan",
    title: "Attack on Titan",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/83/ec/83ec769de7e427c41906dc8b9d18e227/83ec769de7e427c41906dc8b9d18e227.jpg",
    url: "/anime/attack-on-titan",
    description:
      "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.",
    status: "Completed",
    releaseDate: "2013",
    studios: ["Wit Studio", "MAPPA"],
    episodes: 88,
    duration: "24 min per ep",
    genres: ["Action", "Drama", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(5, 9),
  },
  "my-hero-academia": {
    id: "my-hero-academia",
    title: "My Hero Academia",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/b0/ef/b0ef51344ce21a0987f2e19aa1f2b009/b0ef51344ce21a0987f2e19aa1f2b009.jpg",
    url: "/anime/my-hero-academia",
    description:
      "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of one day becoming a Hero, despite being bullied by his classmates for not having a Quirk. After being the only one to try and save his childhood bully from a Villain, Izuku is given a Quirk by the world's greatest Hero, All Might. Now, Izuku attends U.A. High School—a prestigious high school famous for its excellent Hero training program, and this year's freshmen look especially promising. With his bizarre but talented classmates and the looming threat of a Villain organization, Izuku will soon learn what it really means to be a Hero.",
    status: "Ongoing",
    releaseDate: "2016",
    studios: ["Bones"],
    episodes: 113,
    duration: "24 min per ep",
    genres: ["Action", "Superhero"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(7, 11),
  },
  naruto: {
    id: "naruto",
    title: "Naruto",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/d5/b0/d5b0e8f9bbd596d780a1a4bf945f9cbf/d5b0e8f9bbd596d780a1a4bf945f9cbf.jpg",
    url: "/anime/naruto",
    description:
      "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi (Nine-Tailed Fox) attacked Konohagakure, the Hidden Leaf Village. In order to put an end to the Kyuubi's rampage, the leader of the village, the Fourth Hokage, sealed the demon inside the newborn Naruto, causing him to be shunned by the villagers throughout his childhood. Despite this, Naruto is determined to become the greatest Hokage the village has ever seen.",
    status: "Completed",
    releaseDate: "2002",
    studios: ["Studio Pierrot"],
    episodes: 220,
    duration: "23 min per ep",
    genres: ["Action", "Adventure", "Martial Arts"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(8, 12),
  },
  "naruto-shippuden": {
    id: "naruto-shippuden",
    title: "Naruto Shippuden",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/35/75/3575ca5985b5358f4399a195c4c42a6f/3575ca5985b5358f4399a195c4c42a6f.jpg",
    url: "/anime/naruto-shippuden",
    description:
      "It has been two and a half years since Naruto Uzumaki left Konohagakure, the Hidden Leaf Village, for intense training following events which fueled his desire to be stronger. Now Akatsuki, the mysterious organization of elite rogue ninja, is closing in on their grand plan which may threaten the safety of the entire shinobi world.",
    status: "Completed",
    releaseDate: "2007",
    studios: ["Studio Pierrot"],
    episodes: 500,
    duration: "23 min per ep",
    genres: ["Action", "Adventure", "Martial Arts"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(8, 12),
  },
  "death-note": {
    id: "death-note",
    title: "Death Note",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/95/92/9592ca36f0c146e6a8dbe2d7e43718d7/9592ca36f0c146e6a8dbe2d7e43718d7.jpg",
    url: "/anime/death-note",
    description:
      "A shinigami, as a god of death, can kill anyone—provided they see their victim's face and write their victim's name in a notebook called a Death Note. One day, Ryuk, bored by the shinigami lifestyle and interested in seeing how a human would use a Death Note, drops one into the human realm. High school student and prodigy Light Yagami stumbles upon the Death Note and—since he deplores the state of the world—tests the deadly notebook by writing a criminal's name in it. When the criminal dies immediately following his experiment with the Death Note, Light is greatly surprised and quickly recognizes how devastating the power that has fallen into his hands could be.",
    status: "Completed",
    releaseDate: "2006",
    studios: ["Madhouse"],
    episodes: 37,
    duration: "23 min per ep",
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(9, 13),
  },
  "fullmetal-alchemist-brotherhood": {
    id: "fullmetal-alchemist-brotherhood",
    title: "Fullmetal Alchemist: Brotherhood",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/f5/8b/f58b0204c20ae3310f65ae7b8cb9987e/f58b0204c20ae3310f65ae7b8cb9987e.jpg",
    url: "/anime/fullmetal-alchemist-brotherhood",
    description:
      "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle banning human transmutation, the boys attempted to bring their recently deceased mother back to life. Instead, they suffered brutal personal loss: Alphonse's body disintegrated while Edward lost a leg and then sacrificed an arm to keep Alphonse's soul in the physical realm by binding it to a hulking suit of armor. The brothers are rescued by their neighbor Pinako Rockbell and her granddaughter Winry. Known as a bio-mechanical engineering prodigy, Winry creates prosthetic limbs for Edward by utilizing 'automail,' a tough, versatile metal used in robots and combat armor. After years of training, the Elric brothers set off on a quest to restore their bodies by locating the Philosopher's Stone—a powerful artifact that allows an alchemist to defy the traditional laws of Equivalent Exchange.",
    status: "Completed",
    releaseDate: "2009",
    studios: ["Bones"],
    episodes: 64,
    duration: "24 min per ep",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(10, 14),
  },
  "hunter-x-hunter-2011": {
    id: "hunter-x-hunter-2011",
    title: "Hunter x Hunter (2011)",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/eb/5d/eb5d0d7f87c245c5b36f274d3b65870d/eb5d0d7f87c245c5b36f274d3b65870d.jpg",
    url: "/anime/hunter-x-hunter-2011",
    description:
      "Twelve-year-old Gon Freecss is determined to become a Hunter, an exceptional being capable of greatness. With his friends and his potential, he seeks for his father who left him when he was younger.",
    status: "Completed",
    releaseDate: "2011",
    studios: ["Madhouse"],
    episodes: 148,
    duration: "23 min per ep",
    genres: ["Action", "Adventure", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(11, 15),
  },
  "dragon-ball-z": {
    id: "dragon-ball-z",
    title: "Dragon Ball Z",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/f1/9f/f19f1c93e4c4520317a712db172b6a82/f19f1c93e4c4520317a712db172b6a82.jpg",
    url: "/anime/dragon-ball-z",
    description:
      "Five years after winning the World Martial Arts tournament, Goku is now living a peaceful life with his wife and son. This changes, however, with the arrival of a mysterious enemy named Raditz who presents himself as Goku's long-lost brother. He reveals that Goku is a warrior from the once powerful but now virtually extinct Saiyan race, whose homeworld was completely annihilated. When he was sent to Earth as a baby, Goku's sole purpose was to conquer and destroy the planet; but after suffering amnesia from a head injury, his violent and savage nature changed, and instead was raised as a kind and well-mannered boy, now fighting to protect others.",
    status: "Completed",
    releaseDate: "1989",
    studios: ["Toei Animation"],
    episodes: 291,
    duration: "24 min per ep",
    genres: ["Action", "Adventure", "Fantasy"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(12, 16),
  },
  "steins-gate": {
    id: "steins-gate",
    title: "Steins;Gate",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/92/75/9275052d9c8eed19498a3c1ef1f3bea9/9275052d9c8eed19498a3c1ef1f3bea9.jpg",
    url: "/anime/steins-gate",
    description:
      "The self-proclaimed mad scientist Rintarou Okabe rents out a room in a decrepit building in Akihabara, where he indulges himself in his hobby of inventing prospective 'future gadgets' with fellow lab members: Mayuri Shiina, his air-headed childhood friend, and Hashida Itaru, a perverted hacker nicknamed 'Daru.' The three pass the time by tinkering with their most promising contraption yet, a machine dubbed the 'Phone Microwave,' which performs the strange function of morphing bananas into piles of green gel. Though miraculous in itself, the phenomenon doesn't provide anything concrete in Okabe's search for a scientific breakthrough; that is, until the lab members are spurred into action by a string of mysterious happenings before stumbling upon an unexpected success—the Phone Microwave can send emails to the past, altering the flow of history.",
    status: "Completed",
    releaseDate: "2011",
    studios: ["White Fox"],
    episodes: 24,
    duration: "24 min per ep",
    genres: ["Drama", "Sci-Fi", "Thriller"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(13, 17),
  },
  "tokyo-ghoul": {
    id: "tokyo-ghoul",
    title: "Tokyo Ghoul",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/fa/2d/fa2d37a192986abcc85bf798affc9b81/fa2d37a192986abcc85bf798affc9b81.jpg",
    url: "/anime/tokyo-ghoul",
    description:
      "Tokyo has become a cruel and merciless city—a place where vicious creatures called 'ghouls' exist alongside humans. The citizens of this once great metropolis live in constant fear of these bloodthirsty savages and their thirst for human flesh. However, the greatest threat these ghouls pose is their dangerous ability to masquerade as humans and blend in with society. Based on the best-selling supernatural horror manga by Sui Ishida, Tokyo Ghoul follows Ken Kaneki, a shy, bookish college student, who is instantly drawn to Rize Kamishiro, an avid reader like himself. However, Rize is not exactly who she seems, and this unfortunate meeting pushes Kaneki into the dark depths of the ghouls' inhuman world.",
    status: "Completed",
    releaseDate: "2014",
    studios: ["Studio Pierrot"],
    episodes: 12,
    duration: "24 min per ep",
    genres: ["Action", "Horror", "Psychological", "Supernatural"],
    relatedAnime: MOCK_TRENDING_ANIME.slice(15, 19),
  },
  frieren: {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    image: "https://img.flawlessfiles.com/_r/300x400/100/e6/d9/e6d9a5b8e5e6e6d9a5b8e5e6e6d9a5/frieren.jpg",
    url: "/anime/frieren",
    description:
      "After the party of heroes defeated the Demon King, they restored peace to the land and returned to lives of solitude. Decades later, the elf mage Frieren comes face to face with humanity's mortality. She takes on a new apprentice and embarks on a journey to find the meaning of life, love, and friendship.",
    status: "Ongoing",
    releaseDate: "2023",
    studios: ["Madhouse"],
    episodes: 28,
    duration: "24 min per ep",
    genres: ["Adventure", "Fantasy", "Slice of Life"],
    relatedAnime: MOCK_RECENT_ANIME.slice(6, 10),
  },
  "vinland-saga": {
    id: "vinland-saga",
    title: "Vinland Saga",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/23/d5/23d56125b14c4ea0c85b5a1853f73039/23d56125b14c4ea0c85b5a1853f73039.jpg",
    url: "/anime/vinland-saga",
    description:
      "Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. It's said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born, and certainly not like his current life as a mercenary. War is his home now. Though his father once told him, 'You have no enemies, nobody does. There is nobody who it's okay to hurt,' as he grew, Thorfinn knew that nothing was further from the truth. The war between England and the Danes grows worse with each passing year. Death has become commonplace, and the viking mercenaries are loving every moment of it. Allying with either side will cause a massive swing in the balance of power, and the vikings are happy to make names for themselves and take any spoils they earn along the way. Among the chaos, Thorfinn must take his revenge and kill the man who murdered his father, Askeladd. The only paradise for the vikings, it seems, is the era of war and death that rages on.",
    status: "Completed",
    releaseDate: "2019",
    studios: ["Wit Studio"],
    episodes: 24,
    duration: "24 min per ep",
    genres: ["Action", "Adventure", "Drama", "Historical"],
    relatedAnime: MOCK_RECENT_ANIME.slice(14, 18),
  },
  "blue-lock": {
    id: "blue-lock",
    title: "Blue Lock",
    image:
      "https://img.flawlessfiles.com/_r/300x400/100/9f/8d/9f8d4a6304069f5af3635969f3a105d8/9f8d4a6304069f5af3635969f3a105d8.jpg",
    url: "/anime/blue-lock",
    description:
      "After a disastrous defeat at the 2018 World Cup, Japan's team struggles to regroup. But what's missing? An absolute Ace Striker, who can guide them to the win. The Japan Football Union is hell-bent on creating a striker who hungers for goals and thirsts for victory, and who can be the decisive instrument in turning around a losing match...and to do so, they've gathered 300 of Japan's best and brightest youth players. Who will emerge to lead the team...and will they be able to out-muscle and out-ego everyone who stands in their way?",
    status: "Ongoing",
    releaseDate: "2022",
    studios: ["Eight Bit"],
    episodes: 24,
    duration: "24 min per ep",
    genres: ["Sports", "Drama"],
    relatedAnime: MOCK_RECENT_ANIME.slice(16, 20),
  },
  "oshi-no-ko": {
    id: "oshi-no-ko",
    title: "Oshi No Ko",
    image: "https://img.flawlessfiles.com/_r/300x400/100/d9/a5/d9a5b8e5e6e6d9a5b8e5e6e6d9a5b8/oshi-no-ko.jpg",
    url: "/anime/oshi-no-ko",
    description:
      "Dr. Gorou Amemiya, a countryside gynecologist, was reborn as the son of his favorite idol, Ai Hoshino, who was mysteriously murdered. Now, as Aqua Hoshino, he is determined to find his mother's killer and seek revenge.",
    status: "Ongoing",
    releaseDate: "2023",
    studios: ["Doga Kobo"],
    episodes: 11,
    duration: "24 min per ep",
    genres: ["Drama", "Supernatural"],
    relatedAnime: MOCK_RECENT_ANIME.slice(10, 14),
  },
}

// Expand the popular anime genres list
const popularAnimeGenres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
]

// Helper function to make fetch requests with proper headers and timeout
async function fetchWithHeaders(url: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://9animetv.to/",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      next: { revalidate: 3600 },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}

export async function fetchTrendingAnime(): Promise<AnimeItem[]> {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/home`)
    const html = await response.text()
    const $ = load(html)

    const animeList: AnimeItem[] = []

    // Try different selectors for trending anime
    const selectors = [
      ".trending .swiper-slide",
      ".featured-block .flw-item",
      ".block_area-content .film_list-wrap .flw-item",
    ]

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        const href = $(el).find("a").attr("href") || ""
        const id = href.split("/").pop() || ""
        const title = $(el).find(".film-name, .dynamic-name").text().trim()
        const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

        if (id && title) {
          animeList.push({
            id,
            title,
            image,
            url: `${BASE_URL}${href}`,
          })
        }
      })

      if (animeList.length > 0) break
    }

    // If no anime found, try a more generic approach
    if (animeList.length === 0) {
      $(".flw-item")
        .slice(0, 12)
        .each((i, el) => {
          const href = $(el).find("a").attr("href") || ""
          const id = href.split("/").pop() || ""
          const title = $(el).find(".film-name, .dynamic-name").text().trim()
          const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

          if (id && title) {
            animeList.push({
              id,
              title,
              image,
              url: `${BASE_URL}${href}`,
            })
          }
        })
    }

    return animeList.length > 0 ? animeList : MOCK_TRENDING_ANIME
  } catch (error) {
    console.error("Error fetching trending anime:", error)
    return MOCK_TRENDING_ANIME
  }
}

export async function fetchRecentAnime(): Promise<AnimeItem[]> {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/home`)
    const html = await response.text()
    const $ = load(html)

    const animeList: AnimeItem[] = []

    // Try different selectors for recent episodes
    const selectors = [
      ".latest .film_list-wrap .flw-item",
      ".block_area-content .film_list-wrap .flw-item",
      ".latest-block .flw-item",
    ]

    for (const selector of selectors) {
      $(selector).each((i, el) => {
        const href = $(el).find("a").attr("href") || ""
        const id = href.split("/").pop() || ""
        const title = $(el).find(".film-name, .dynamic-name").text().trim()
        const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""
        const type = $(el).find(".fd-infor .fdi-item, .tick-item").first().text().trim()

        if (id && title) {
          animeList.push({
            id,
            title,
            image,
            url: `${BASE_URL}${href}`,
            type,
          })
        }
      })

      if (animeList.length > 0) break
    }

    // If no anime found, try a more generic approach
    if (animeList.length === 0) {
      $(".flw-item")
        .slice(12, 24)
        .each((i, el) => {
          const href = $(el).find("a").attr("href") || ""
          const id = href.split("/").pop() || ""
          const title = $(el).find(".film-name, .dynamic-name").text().trim()
          const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

          if (id && title) {
            animeList.push({
              id,
              title,
              image,
              url: `${BASE_URL}${href}`,
            })
          }
        })
    }

    return animeList.length > 0 ? animeList : MOCK_RECENT_ANIME
  } catch (error) {
    console.error("Error fetching recent anime:", error)
    return MOCK_RECENT_ANIME
  }
}

export async function fetchAnimeDetails(id: string): Promise<AnimeDetails | null> {
  try {
    // Check if we have mock data for this ID
    if (MOCK_ANIME_DETAILS[id]) {
      return MOCK_ANIME_DETAILS[id]
    }

    const response = await fetchWithHeaders(`${BASE_URL}/watch/${id}`)
    const html = await response.text()
    const $ = load(html)

    // Try different selectors for title
    let title = $(".anisc-detail h2.film-name, .anime_info .anime_info_body h2.anime_info_body_bg").text().trim()
    if (!title) {
      title = $("h1.title, h2.title, .film-name").first().text().trim()
    }

    // Try different selectors for image
    let image = $(".anisc-poster img, .anime_info_body_bg img").attr("src") || ""
    if (!image) {
      image = $("img.film-poster-img").attr("src") || ""
    }

    // Try different selectors for description
    let description = $(".anisc-detail .film-description .text, .anime_info_body .description").text().trim()
    if (!description) {
      description = $(".description, .text").first().text().trim()
    }

    // Extract metadata
    let status = ""
    let releaseDate = ""
    let studios: string[] = []
    let episodes = 0
    let duration = ""
    let genres: string[] = []

    // Try different selectors for metadata
    const infoSelectors = [".anisc-info .item", ".anime_info_body .type", ".meta .meta-data"]

    for (const selector of infoSelectors) {
      $(selector).each((i, el) => {
        const label = $(el).find(".item-head, .text-h6").text().trim().toLowerCase()

        if (label.includes("status")) {
          status = $(el).find(".name, .text").text().trim()
        } else if (label.includes("studios") || label.includes("studio")) {
          studios = $(el)
            .find(".name, .text")
            .map((i, el) => $(el).text().trim())
            .get()
        } else if (label.includes("released") || label.includes("aired") || label.includes("year")) {
          releaseDate = $(el).find(".name, .text").text().trim()
        } else if (label.includes("episodes") || label.includes("episode")) {
          const episodeText = $(el).find(".name, .text").text().trim()
          episodes = Number.parseInt(episodeText) || 0
        } else if (label.includes("duration")) {
          duration = $(el).find(".name, .text").text().trim()
        } else if (label.includes("genres") || label.includes("genre")) {
          genres = $(el)
            .find(".name, .text")
            .map((i, el) => $(el).text().trim())
            .get()
        }
      })

      if (status || releaseDate || studios.length > 0 || episodes > 0 || duration || genres.length > 0) break
    }

    // If we couldn't find episodes, try to count them from the episode list
    if (episodes === 0) {
      const episodeSelectors = [".ss-list .ep-item", ".episodes-list .episode-item", ".episodes-container .episode"]

      for (const selector of episodeSelectors) {
        const count = $(selector).length
        if (count > 0) {
          episodes = count
          break
        }
      }
    }

    // Get related anime
    const relatedAnime: AnimeItem[] = []
    const relatedSelectors = [".film_list-wrap .flw-item", ".related-block .flw-item", ".block_area .flw-item"]

    for (const selector of relatedSelectors) {
      $(selector).each((i, el) => {
        const href = $(el).find("a").attr("href") || ""
        const relId = href.split("/").pop() || ""
        const relTitle = $(el).find(".film-name, .dynamic-name").text().trim()
        const relImage = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

        if (relId && relTitle && relId !== id) {
          relatedAnime.push({
            id: relId,
            title: relTitle,
            image: relImage,
            url: `${BASE_URL}${href}`,
          })
        }
      })

      if (relatedAnime.length > 0) break
    }

    return {
      id,
      title,
      image,
      url: `${BASE_URL}/watch/${id}`,
      description,
      status,
      releaseDate,
      studios,
      episodes: episodes || 12, // Fallback to 12 if no episodes found
      duration,
      genres,
      relatedAnime: relatedAnime.length > 0 ? relatedAnime : MOCK_TRENDING_ANIME.slice(0, 4),
    }
  } catch (error) {
    console.error(`Error fetching anime details for ${id}:`, error)

    // Return mock data if available, otherwise create a generic entry
    if (MOCK_ANIME_DETAILS[id]) {
      return MOCK_ANIME_DETAILS[id]
    }

    // Create a fallback anime details from trending anime
    const fallbackAnime = [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME].find((anime) => anime.id === id)

    if (fallbackAnime) {
      return {
        ...fallbackAnime,
        description: "No description available.",
        status: "Unknown",
        releaseDate: "Unknown",
        studios: ["Unknown"],
        episodes: fallbackAnime.episodes || 12,
        duration: "24 min per ep",
        genres: fallbackAnime.genres || ["Action", "Adventure"],
        relatedAnime: MOCK_TRENDING_ANIME.slice(0, 4),
      }
    }

    return {
      id,
      title: `Anime ${id}`,
      image: "/placeholder.svg?height=400&width=300",
      url: `/anime/${id}`,
      description: "No description available.",
      status: "Unknown",
      releaseDate: "Unknown",
      studios: ["Unknown"],
      episodes: 12,
      duration: "24 min per ep",
      genres: ["Action", "Adventure"],
      relatedAnime: MOCK_TRENDING_ANIME.slice(0, 4),
    }
  }
}

export async function searchAnime(query: string): Promise<AnimeItem[]> {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/filter?keyword=${encodeURIComponent(query)}`)
    const html = await response.text()
    const $ = load(html)

    const animeList: AnimeItem[] = []

    $(".flw-item").each((i, el) => {
      const href = $(el).find("a").attr("href") || ""
      const id = href.split("/").pop() || ""
      const title = $(el).find(".film-name, .dynamic-name").text().trim()
      const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""
      const type = $(el).find(".fd-infor .fdi-item, .tick-item").first().text().trim()

      if (id && title) {
        animeList.push({
          id,
          title,
          image,
          url: `${BASE_URL}${href}`,
          type,
        })
      }
    })

    if (animeList.length === 0) {
      // Provide mock search results based on the query
      return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
        .filter((anime) => anime.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    }

    return animeList
  } catch (error) {
    console.error(`Error searching anime for "${query}":`, error)

    // Provide mock search results based on the query
    return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
      .filter((anime) => anime.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
  }
}

export async function fetchAnimeByGenre(genre: string): Promise<AnimeItem[]> {
  try {
    const response = await fetchWithHeaders(`${BASE_URL}/genre/${genre}`)
    const html = await response.text()
    const $ = load(html)

    const animeList: AnimeItem[] = []

    $(".flw-item").each((i, el) => {
      const href = $(el).find("a").attr("href") || ""
      const id = href.split("/").pop() || ""
      const title = $(el).find(".film-name, .dynamic-name").text().trim()
      const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || ""

      if (id && title) {
        animeList.push({
          id,
          title,
          image,
          url: `${BASE_URL}${href}`,
        })
      }
    })

    if (animeList.length === 0) {
      // Provide mock genre results
      return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
        .filter((anime) => anime.genres?.some((g) => g.toLowerCase() === genre.toLowerCase()))
        .slice(0, 10)
    }

    return animeList
  } catch (error) {
    console.error(`Error fetching anime for genre "${genre}":`, error)

    // Provide mock genre results
    return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
      .filter((anime) => anime.genres?.some((g) => g.toLowerCase() === genre.toLowerCase()))
      .slice(0, 10)
  }
}

// Mock episode data
export async function fetchEpisodeSources(animeId: string, episodeId: string): Promise<EpisodeSource[]> {
  try {
    // Try to fetch real data first
    const response = await fetch(`${BASE_URL}/ajax/episode/servers?episodeId=${episodeId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: `${BASE_URL}/watch/${animeId}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch episode sources: ${response.status}`)
    }

    const data = await response.json()
    const $ = load(data.html)

    const sources: EpisodeSource[] = []

    $(".server-item").each((i, el) => {
      const serverId = $(el).attr("data-id") || ""
      const serverName = $(el).find(".name").text().trim()

      sources.push({
        url: `${BASE_URL}/ajax/episode/sources?id=${serverId}`,
        quality: "Auto",
        server: serverName || `Server ${i + 1}`,
      })
    })

    if (sources.length > 0) {
      return sources
    }

    // Fallback to mock data
    throw new Error("No sources found")
  } catch (error) {
    console.error(`Error fetching episode sources for ${animeId}, episode ${episodeId}:`, error)

    // Return fallback video sources
    return [
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        quality: "HD",
        server: "Default",
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        quality: "SD",
        server: "Backup",
      },
    ]
  }
}

// Function to get all anime (for browse page)
export async function fetchAllAnime(): Promise<AnimeItem[]> {
  try {
    // First try to fetch from the actual website
    const [trendingResponse, recentResponse] = await Promise.all([
      fetchWithHeaders(`${BASE_URL}/home`),
      fetchWithHeaders(`${BASE_URL}/most-popular`),
    ])

    const trendingHtml = await trendingResponse.text()
    const recentHtml = await recentResponse.text()

    const $trending = load(trendingHtml)
    const $recent = load(recentHtml)

    const animeList: AnimeItem[] = []

    // Process trending anime
    $trending(".flw-item").each((i, el) => {
      const href = $trending(el).find("a").attr("href") || ""
      const id = href.split("/").pop() || ""
      const title = $trending(el).find(".film-name, .dynamic-name").text().trim()
      const image = $trending(el).find("img").attr("data-src") || $trending(el).find("img").attr("src") || ""

      if (id && title && !animeList.some((anime) => anime.id === id)) {
        animeList.push({
          id,
          title,
          image,
          url: `${BASE_URL}${href}`,
        })
      }
    })

    // Process popular anime
    $recent(".flw-item").each((i, el) => {
      const href = $recent(el).find("a").attr("href") || ""
      const id = href.split("/").pop() || ""
      const title = $recent(el).find(".film-name, .dynamic-name").text().trim()
      const image = $recent(el).find("img").attr("data-src") || $recent(el).find("img").attr("src") || ""

      if (id && title && !animeList.some((anime) => anime.id === id)) {
        animeList.push({
          id,
          title,
          image,
          url: `${BASE_URL}${href}`,
        })
      }
    })

    if (animeList.length > 0) {
      return animeList
    }

    // Fallback to our mock data
    return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
  } catch (error) {
    console.error("Error fetching all anime:", error)
    return [...MOCK_TRENDING_ANIME, ...MOCK_RECENT_ANIME]
  }
}

// Export popular genres for the browse page
export function getPopularGenres(): string[] {
  return popularAnimeGenres
}

