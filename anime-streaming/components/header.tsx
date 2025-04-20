"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Bell, Menu, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          const data = await response.json()
          setSearchResults(data.results || [])
        } catch (error) {
          console.error("Error searching:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
    }
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-16">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <h1 className="text-2xl font-bold ml-1 text-white">Nosa's Anime</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-purple-500">
              Home
            </Link>
            <Link href="/browse" className="text-sm font-medium hover:text-purple-500">
              Browse
            </Link>
            <Link href="/top-anime" className="text-sm font-medium hover:text-purple-500 flex items-center">
              <Star className="h-3 w-3 mr-1" /> Top Anime
            </Link>
            <Link href="/history" className="text-sm font-medium hover:text-purple-500">
              History
            </Link>
            <Link href="/mylist" className="text-sm font-medium hover:text-purple-500">
              My List
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search anime..."
                  className="w-64 bg-black/80 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 text-gray-400 hover:text-white"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Search Results Dropdown */}
              {searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/anime/${result.id}`}
                        className="flex items-start gap-3 p-3 hover:bg-gray-900 transition-colors"
                        onClick={() => setShowSearch(false)}
                      >
                        <div className="relative w-12 h-16 flex-shrink-0">
                          <Image
                            src={result.image || "/placeholder.svg?height=64&width=48"}
                            alt={result.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{result.title}</h4>
                          {result.type && <p className="text-xs text-gray-400">{result.type}</p>}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No results found</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black border-gray-800 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="hover:bg-gray-800">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800">Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800">My List</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="hover:bg-gray-800">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-black border-t border-gray-800 md:hidden">
          <nav className="flex flex-col p-4">
            <Link href="/" className="py-2 hover:text-purple-500">
              Home
            </Link>
            <Link href="/browse" className="py-2 hover:text-purple-500">
              Browse
            </Link>
            <Link href="/top-anime" className="py-2 hover:text-purple-500 flex items-center">
              <Star className="h-3 w-3 mr-1" /> Top Anime
            </Link>
            <Link href="/history" className="py-2 hover:text-purple-500">
              History
            </Link>
            <Link href="/mylist" className="py-2 hover:text-purple-500">
              My List
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

