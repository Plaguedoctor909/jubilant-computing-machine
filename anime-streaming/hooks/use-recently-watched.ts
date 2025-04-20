"use client"

import { useState, useEffect } from "react"

export interface WatchedAnime {
  id: string
  title: string
  image: string
  episodeNumber: string
  timestamp: number
}

const MAX_RECENTLY_WATCHED = 12

export function useRecentlyWatched() {
  const [recentlyWatched, setRecentlyWatched] = useState<WatchedAnime[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentlyWatched")
    if (stored) {
      try {
        setRecentlyWatched(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse recently watched data:", error)
      }
    }
  }, [])

  // Add anime to recently watched
  const addToRecentlyWatched = (anime: WatchedAnime) => {
    setRecentlyWatched((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => !(item.id === anime.id && item.episodeNumber === anime.episodeNumber))

      // Add to beginning of array
      const updated = [anime, ...filtered].slice(0, MAX_RECENTLY_WATCHED)

      // Save to localStorage
      localStorage.setItem("recentlyWatched", JSON.stringify(updated))

      return updated
    })
  }

  // Clear recently watched
  const clearRecentlyWatched = () => {
    localStorage.removeItem("recentlyWatched")
    setRecentlyWatched([])
  }

  return {
    recentlyWatched,
    addToRecentlyWatched,
    clearRecentlyWatched,
  }
}

