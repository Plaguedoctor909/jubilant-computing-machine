"use client"

import { useState, useEffect } from "react"

export interface FavoriteAnime {
  id: string
  title: string
  image: string
  addedAt: number
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse favorites data:", error)
      }
    }
  }, [])

  // Add anime to favorites
  const addToFavorites = (anime: Omit<FavoriteAnime, "addedAt">) => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((item) => item.id === anime.id)) {
        return prev
      }

      // Add to array with timestamp
      const updated = [...prev, { ...anime, addedAt: Date.now() }]

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(updated))

      return updated
    })
  }

  // Remove anime from favorites
  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id)

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(updated))

      return updated
    })
  }

  // Check if anime is in favorites
  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id)
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }
}

