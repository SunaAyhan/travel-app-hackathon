"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Maximize2, ChevronLeft, ChevronRight, Heart, Download, Share2 } from "lucide-react"

type Photo = {
  id: string
  src: string
  alt: string
  location: string
  date: string
  liked: boolean
}

const photos: Photo[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Beach sunset",
    location: "Bali, Indonesia",
    date: "June 15, 2023",
    liked: false,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Mountain view",
    location: "Swiss Alps",
    date: "January 3, 2023",
    liked: false,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "City skyline",
    location: "New York, USA",
    date: "March 22, 2023",
    liked: false,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Desert landscape",
    location: "Sahara Desert",
    date: "November 10, 2023",
    liked: false,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tropical waterfall",
    location: "Costa Rica",
    date: "August 5, 2023",
    liked: false,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1606337321936-02d1b1a4d5ef?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Ancient temple",
    location: "Kyoto, Japan",
    date: "May 18, 2023",
    liked: false,
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Northern Lights",
    location: "Iceland",
    date: "February 12, 2023",
    liked: false,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Safari wildlife",
    location: "Kenya",
    date: "July 29, 2023",
    liked: false,
  },
]

export default function TravelGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>(photos)

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Travel Gallery</h2>
        <p className="text-muted-foreground">Relive your favorite travel moments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryPhotos.map((photo) => (
          <motion.div key={photo.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden cursor-pointer group">
              <CardContent className="p-0 relative">
                <img
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openModal(photo)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-medium text-sm">{photo.location}</h3>
                  <p className="text-white/80 text-xs">{photo.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(photo.id)
                  }}
                >
                  <Heart className={`h-4 w-4 ${photo.liked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                  onClick={() => openModal(photo)}
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
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
