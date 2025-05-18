"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Maximize2, ChevronLeft, ChevronRight, Heart, Download, Share2, Edit, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

type Photo = {
  id: string
  src: string
  alt: string
  location: string
  date: string
  liked: boolean
  memoryTag?: string
  aspectRatio?: number // For varying image sizes
}

const photos: Photo[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Beach sunset",
    location: "Bali, Indonesia",
    date: "June 15, 2023",
    liked: false,
    memoryTag: "The most breathtaking sunset I've ever seen 🌅",
    aspectRatio: 1.2,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Mountain view",
    location: "Swiss Alps",
    date: "January 3, 2023",
    liked: false,
    memoryTag: "First time seeing snow in the mountains ❄️",
    aspectRatio: 0.8,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "City skyline",
    location: "New York, USA",
    date: "March 22, 2023",
    liked: false,
    memoryTag: "City that never sleeps - felt so alive! 🏙️",
    aspectRatio: 1.5,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Desert landscape",
    location: "Sahara Desert",
    date: "November 10, 2023",
    liked: false,
    memoryTag: "Saw the morning sun here for the first time 🌞",
    aspectRatio: 1.1,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tropical waterfall",
    location: "Costa Rica",
    date: "August 5, 2023",
    liked: false,
    memoryTag: "The water was so refreshing after the hike 💦",
    aspectRatio: 0.7,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1606337321936-02d1b1a4d5ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Ancient temple",
    location: "Kyoto, Japan",
    date: "May 18, 2023",
    liked: false,
    memoryTag: "Such peaceful energy everywhere here 🧘‍♀️",
    aspectRatio: 1.3,
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Northern Lights",
    location: "Iceland",
    date: "February 12, 2023",
    liked: false,
    memoryTag: "Nature's most beautiful light show 🌌",
    aspectRatio: 1.6,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Safari wildlife",
    location: "Kenya",
    date: "July 29, 2023",
    liked: false,
    memoryTag: "Got so close to this beauty on safari! 🦁",
    aspectRatio: 0.9,
  },
]

export default function TravelGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>(photos)
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [newMemoryTag, setNewMemoryTag] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    if (!selectedPhoto) return

    const currentIndex = galleryPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % galleryPhotos.length
    } else {
      newIndex = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length
    }

    setSelectedPhoto(galleryPhotos[newIndex])
  }

  const toggleLike = (id: string) => {
    const updatedPhotos = galleryPhotos.map((photo) => (photo.id === id ? { ...photo, liked: !photo.liked } : photo))
    setGalleryPhotos(updatedPhotos)

    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, liked: !selectedPhoto.liked })
    }
  }

  const startEditingTag = (id: string) => {
    setEditingTag(id)
    const photo = galleryPhotos.find((p) => p.id === id)
    if (photo) {
      setNewMemoryTag(photo.memoryTag || "")
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }

  const saveMemoryTag = (id: string) => {
    const updatedPhotos = galleryPhotos.map((photo) => 
      photo.id === id ? { ...photo, memoryTag: newMemoryTag } : photo
    )
    setGalleryPhotos(updatedPhotos)
    
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, memoryTag: newMemoryTag })
    }
    
    setEditingTag(null)
  }

  // Generate a random rotation between -3 and 3 degrees for each photo
  const getRandomRotation = (id: string) => {
    // Use the photo ID to generate a consistent rotation
    const charSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return (charSum % 7) - 3 // Between -3 and 3 degrees
  }
  
  // New download function
  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = `${photo.location.replace(/,\s*/g, '-')}-${photo.date.replace(/,\s*/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // New share function
  const handleShare = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My trip to ${photo.location}`,
          text: photo.memoryTag || `Check out this photo from my trip to ${photo.location}!`,
          url: photo.src
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(photo.src);
      alert("Image URL copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Travel Gallery</h2>
        <p className="text-muted-foreground">Relive your favorite travel moments</p>
      </div>

      {/* Masonry grid layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryPhotos.map((photo) => (
          <motion.div 
            key={photo.id} 
            className="mb-4 break-inside-avoid" 
            whileHover={{ 
              rotate: getRandomRotation(photo.id),
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <Card className="overflow-hidden cursor-pointer group bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-shadow duration-300" style={{ transformStyle: 'preserve-3d' }}>
              <CardContent className="p-0 relative">
                {/* Image */}
                <div className="p-3 pt-3 pb-0">
                  <div className="overflow-hidden">
                    <img
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      className="w-full rounded-sm object-cover"
                      style={{ aspectRatio: photo.aspectRatio || 1 }}
                      onClick={() => openModal(photo)}
                    />
                  </div>
                </div>
                
                {/* Polaroid caption area */}
                <div className="px-3 pb-3 pt-2">
                  <div className="flex justify-between items-center mt-1 mb-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      {photo.location}, {photo.date.split(" ")[0]} {photo.date.includes("January") ? "❄️" : 
                        photo.date.includes("June") || photo.date.includes("July") || photo.date.includes("August") ? "☀️" : 
                        photo.date.includes("May") ? "🌸" : "🌇"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(photo.id)
                      }}
                    >
                      <Heart className={`h-3 w-3 ${photo.liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  
                  {/* Memory tag/caption with inline editing */}
                  <div 
                    className="mt-1 min-h-[24px] flex justify-between items-center" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    {editingTag === photo.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          ref={inputRef}
                          className="text-sm py-1 h-7"
                          value={newMemoryTag}
                          onChange={(e) => setNewMemoryTag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveMemoryTag(photo.id)}
                          placeholder="Add a memory..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => saveMemoryTag(photo.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm italic flex-1 truncate" title={photo.memoryTag}>
                          {photo.memoryTag || "Add a memory..."}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditingTag(photo.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Maximize button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal(photo)
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full"
                onClick={closeModal}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="relative w-full h-[80vh] flex items-center justify-center">
                <img
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.alt}
                  className="max-h-full max-w-full object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto("prev")
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto("next")
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-lg mt-4 w-full max-w-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{selectedPhoto.location}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPhoto.date}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(selectedPhoto.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${selectedPhoto.liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(selectedPhoto)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShare(selectedPhoto)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Memory tag in modal */}
                <div className="mt-2">
                  {editingTag === selectedPhoto.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        className="text-sm"
                        value={newMemoryTag}
                        onChange={(e) => setNewMemoryTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveMemoryTag(selectedPhoto.id)}
                        placeholder="Add a memory..."
                      />
                      <Button
                        size="sm"
                        onClick={() => saveMemoryTag(selectedPhoto.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm italic">
                        {selectedPhoto.memoryTag || "No memory added yet"}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEditingTag(selectedPhoto.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
