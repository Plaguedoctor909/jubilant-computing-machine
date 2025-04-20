"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Header from "@/components/header"
import { useRecentlyWatched } from "@/hooks/use-recently-watched"

interface VideoPlayerPageProps {
  params: {
    id: string
  }
}

export default function VideoPlayerPage({ params }: VideoPlayerPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [animeData, setAnimeData] = useState<any>(null)
  const [episodeData, setEpisodeData] = useState<any>(null)
  const [videoSources, setVideoSources] = useState<any[]>([])
  const [currentSource, setCurrentSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState(false)
  const { addToRecentlyWatched } = useRecentlyWatched()

  const searchParams = useSearchParams()
  const episodeNumber = searchParams.get("ep") || "1"

  // Fetch anime data and episode sources
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        setVideoError(false)

        // Fetch anime details
        const animeResponse = await fetch(`/api/anime/${params.id}`)
        if (!animeResponse.ok) {
          throw new Error(`Failed to fetch anime details: ${animeResponse.status} ${animeResponse.statusText}`)
        }
        const animeData = await animeResponse.json()
        setAnimeData(animeData)

        // Fetch episode data
        const episodeResponse = await fetch(`/api/anime/${params.id}/episodes?ep=${episodeNumber}`)
        if (!episodeResponse.ok) {
          throw new Error(`Failed to fetch episode data: ${episodeResponse.status} ${episodeResponse.statusText}`)
        }
        const episodeData = await episodeResponse.json()
        setEpisodeData(episodeData)

        // Fetch video sources
        if (episodeData.id) {
          const sourcesResponse = await fetch(`/api/anime/sources?episodeId=${episodeData.id}`)
          if (!sourcesResponse.ok) {
            throw new Error(`Failed to fetch video sources: ${sourcesResponse.status} ${sourcesResponse.statusText}`)
          }
          const sourcesData = await sourcesResponse.json()

          if (sourcesData.sources && sourcesData.sources.length > 0) {
            setVideoSources(sourcesData.sources)
            setCurrentSource(sourcesData.sources[0])
          } else {
            throw new Error("No video sources available")
          }
        } else {
          throw new Error("Episode ID not found")
        }

        // Add to recently watched
        addToRecentlyWatched({
          id: params.id,
          title: animeData.title,
          image: animeData.image,
          episodeNumber,
          timestamp: Date.now(),
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, episodeNumber, addToRecentlyWatched])

  // Video player controls
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = () => {
      console.error("Video error occurred")
      setVideoError(true)

      // Try to switch to another source if available
      if (videoSources.length > 1 && currentSource) {
        const currentIndex = videoSources.findIndex((source) => source.id === currentSource.id)
        if (currentIndex >= 0 && currentIndex < videoSources.length - 1) {
          setCurrentSource(videoSources[currentIndex + 1])
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
    }
  }, [currentSource, videoSources])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((error) => {
        console.error("Error playing video:", error)
        setVideoError(true)
      })
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
      video.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      video.muted = false
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById("video-container")
    if (!videoContainer) return

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <h2 className="text-2xl font-bold mb-4">Error Loading Video</h2>
          <p className="text-center mb-6">{error}</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Video Player */}
          <div
            id="video-container"
            className="relative w-full h-screen bg-black pt-16"
            onMouseEnter={() => setShowControls(true)}
          >
            {currentSource ? (
              currentSource.direct ? (
                // Direct video URL
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src={currentSource.url}
                  onClick={togglePlay}
                  playsInline
                  controls={false}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                // Iframe embed
                <iframe
                  src={currentSource.url}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                ></iframe>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold mb-4">Video Source Not Available</h2>
                <p className="text-center mb-6">We couldn't find a video source for this episode.</p>
              </div>
            )}

            {videoError && currentSource?.direct && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <h2 className="text-2xl font-bold mb-4">Video Playback Error</h2>
                <p className="text-center mb-6">There was an error playing this video. Please try another server.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {videoSources.map((source, index) => (
                    <Button
                      key={index}
                      variant={currentSource?.id === source.id ? "default" : "outline"}
                      className={currentSource?.id === source.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                      onClick={() => {
                        setCurrentSource(source)
                        setVideoError(false)
                      }}
                    >
                      {source.server}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Video Controls - only show for direct video */}
            {showControls && currentSource?.direct && !videoError && (
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/70 transition-opacity">
                {/* Top Bar */}
                <div className="flex items-center p-4 md:p-6">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/anime/${params.id}`}>
                      <ArrowLeft className="h-6 w-6" />
                    </Link>
                  </Button>
                  <div className="ml-4">
                    <h1 className="text-lg font-medium">{animeData?.title}</h1>
                    <p className="text-sm text-gray-300">Episode {episodeNumber}</p>
                  </div>
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full w-16 h-16 flex items-center justify-center"
                    onClick={togglePlay}
                  >
                    <Play className="h-8 w-8 fill-current" />
                  </Button>
                )}

                {/* Bottom Controls */}
                <div className="p-4 md:p-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-purple-600"
                    />
                    <span className="text-sm">{formatTime(duration || 0)}</span>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
                      </Button>

                      <div
                        className="relative"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <Button variant="ghost" size="icon" onClick={toggleMute}>
                          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </Button>

                        {showVolumeSlider && (
                          <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/80 rounded-md w-32">
                            <Slider
                              value={[isMuted ? 0 : volume]}
                              min={0}
                              max={1}
                              step={0.01}
                              onValueChange={handleVolumeChange}
                              className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-purple-600 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-purple-600"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-6 w-6" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                        <Maximize className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simple controls for iframe embed */}
            {showControls && !currentSource?.direct && (
              <div className="absolute top-16 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/anime/${params.id}`}>
                    <ArrowLeft className="h-6 w-6" />
                  </Link>
                </Button>
                <div className="ml-12 inline-block">
                  <h1 className="text-lg font-medium">{animeData?.title}</h1>
                  <p className="text-sm text-gray-300">Episode {episodeNumber}</p>
                </div>
              </div>
            )}
          </div>

          {/* Episode Info */}
          <section className="px-6 md:px-16 py-8 bg-black">
            <h2 className="text-2xl font-bold mb-2">
              {animeData?.title} - Episode {episodeNumber}
            </h2>
            <p className="text-gray-300 mb-8">
              {episodeData?.description || animeData?.description || "No description available."}
            </p>

            {/* Server Selection */}
            {videoSources.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Servers</h3>
                <div className="flex flex-wrap gap-2">
                  {videoSources.map((source, index) => (
                    <Button
                      key={index}
                      variant={currentSource?.id === source.id ? "default" : "outline"}
                      className={currentSource?.id === source.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                      onClick={() => {
                        setCurrentSource(source)
                        setVideoError(false)
                      }}
                    >
                      {source.server}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-12">
              {Number.parseInt(episodeNumber) > 1 && (
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href={`/watch/${params.id}?ep=${Number.parseInt(episodeNumber) - 1}`}>Previous Episode</Link>
                </Button>
              )}
              {animeData?.episodes && Number.parseInt(episodeNumber) < animeData.episodes && (
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href={`/watch/${params.id}?ep=${Number.parseInt(episodeNumber) + 1}`}>Next Episode</Link>
                </Button>
              )}
            </div>

            {/* Episode List */}
            <div>
              <h3 className="text-xl font-bold mb-4">Episodes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mb-6">
                {animeData?.episodes &&
                  [...Array(animeData.episodes)].map((_, i) => (
                    <Link
                      key={i}
                      href={`/watch/${params.id}?ep=${i + 1}`}
                      className={`flex items-center justify-center p-3 rounded-md border ${
                        Number.parseInt(episodeNumber) === i + 1
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

