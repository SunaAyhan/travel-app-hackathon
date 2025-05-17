"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Sticker, Download, Plus, Trash2, Palette } from "lucide-react"

type StickerItem = {
  id: string
  type: "image" | "text" | "sticker"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
  time?: string
}

const stickerEmojis = [
  "🏖️",
  "🏔️",
  "🌊",
  "🌴",
  "🏝️",
  "🗿",
  "🗼",
  "🏰",
  "🏯",
  "🏟️",
  "🚗",
  "✈️",
  "🚢",
  "🚆",
  "🚲",
  "🍕",
  "🍣",
  "🍷",
  "🍹",
  "📸",
  "🎒",
  "👙",
  "🕶️",
  "🧳",
]

const backgroundImages = [
  "/map.jpeg",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800&text=Beach",
  "/placeholder.svg?height=600&width=800&text=Mountains",
  "/placeholder.svg?height=600&width=800&text=City",
  "/placeholder.svg?height=600&width=800&text=Forest",
]

// Travel images from Unsplash
const travelImages = [
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
    alt: "Tropical Beach",
  },
  {
    src: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=500&auto=format&fit=crop",
    alt: "Mountain Landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=500&auto=format&fit=crop",
    alt: "City Streets",
  },
  {
    src: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Local Cuisine",
  },
  {
    src: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Historic Architecture",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1683141023289-49fdc6fa7506?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Cultural Experience",
  },
]

export default function TripMoodboard() {
  const [stickers, setStickers] = useState<StickerItem[]>([
    {
      id: "1",
      type: "image",
      content: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1642&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      x: 100,
      y: 100,
      rotation: -5,
      scale: 1,
    },
    {
      id: "2",
      type: "text",
      content: "Summer Vacation 2023",
      x: 300,
      y: 50,
      rotation: 0,
      scale: 1,
    },
    {
      id: "3",
      type: "sticker",
      content: "🏖️",
      x: 200,
      y: 200,
      rotation: 10,
      scale: 1.5,
      time: "Day 1",
    },
    {
      id: "4",
      type: "sticker",
      content: "🍹",
      x: 400,
      y: 250,
      rotation: -10,
      scale: 1.2,
      time: "Day 2",
    },
  ])

  const [activeTab, setActiveTab] = useState<"images" | "stickers" | "text">("images")
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [newText, setNewText] = useState<string>("")
  const [newTime, setNewTime] = useState<string>("")
  const [backgroundImage, setBackgroundImage] = useState<string>(backgroundImages[0])
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const handleStickerDrag = (id: string, clientX: number, clientY: number) => {
    if (!boardRef.current) return

    const boardRect = boardRef.current.getBoundingClientRect()
    const x = clientX - boardRect.left
    const y = clientY - boardRect.top

    setStickers(
      stickers.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              x,
              y,
            }
          : sticker,
      ),
    )
  }

  const addSticker = (content: string, type: "image" | "text" | "sticker") => {
    if (type === "text" && !newText) return

    const newSticker: StickerItem = {
      id: Date.now().toString(),
      type,
      content: type === "text" ? newText : content,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      rotation: Math.random() * 20 - 10,
      scale: 1,
      time: newTime || undefined,
    }

    setStickers([...stickers, newSticker])
    setNewText("")
    setNewTime("")
  }

  const removeSticker = (id: string) => {
    setStickers(stickers.filter((sticker) => sticker.id !== id))
    if (selectedSticker === id) {
      setSelectedSticker(null)
    }
  }

  const rotateSticker = (id: string, direction: "left" | "right") => {
    setStickers(
      stickers.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              rotation: sticker.rotation + (direction === "left" ? -15 : 15),
            }
          : sticker,
      ),
    )
  }

  const scaleSticker = (id: string, value: number[]) => {
    setStickers(
      stickers.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              scale: value[0],
            }
          : sticker,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trip Moodboard</h2>
        <p className="text-muted-foreground">Create a visual collage of your travel inspiration</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Your Moodboard</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
              <CardDescription>Drag items to arrange your perfect trip</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={boardRef}
                className="relative w-full h-[500px] overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}
              >
                {stickers.map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    className={`absolute cursor-move ${selectedSticker === sticker.id ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}
                    style={{
                      left: sticker.x,
                      top: sticker.y,
                      transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                      zIndex: selectedSticker === sticker.id ? 10 : 1,
                    }}
                    drag
                    dragMomentum={false}
                    onDrag={(_, info) => handleStickerDrag(sticker.id, info.point.x, info.point.y)}
                    onClick={() => setSelectedSticker(sticker.id)}
                    whileDrag={{ scale: 1.05 }}
                  >
                    {sticker.type === "image" && (
                      <img
                        src={sticker.content || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1642&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                        alt="Moodboard item"
                        className="max-w-[200px] rounded-md shadow-md"
                      />
                    )}
                    {sticker.type === "text" && (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-md max-w-[200px]">
                        <p className="font-bold">{sticker.content}</p>
                        {sticker.time && <p className="text-xs text-muted-foreground mt-1">{sticker.time}</p>}
                      </div>
                    )}
                    {sticker.type === "sticker" && (
                      <div className="relative">
                        <span className="text-4xl">{sticker.content}</span>
                        {sticker.time && (
                          <span className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 text-xs px-1 rounded-full shadow-sm">
                            {sticker.time}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Add Elements</CardTitle>
              <CardDescription>Customize your moodboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "images" | "stickers" | "text")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="images" className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="stickers" className="flex items-center gap-1">
                    <Sticker className="h-4 w-4" />
                    Stickers
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-1">
                    <span className="font-serif">T</span>
                    Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {travelImages.map((image, index) => (
                      <div
                        key={index}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => addSticker(image.src, "image")}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="rounded-md w-full aspect-video object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Background</h4>
                    <div className="flex overflow-x-auto gap-2 pb-2">
                      {backgroundImages.map((image, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer flex-shrink-0 ${backgroundImage === image ? "ring-2 ring-indigo-500" : ""}`}
                          onClick={() => setBackgroundImage(image)}
                        >
                          <img
                            src={image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1642&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            alt={`Background ${index + 1}`}
                            className="w-16 h-12 object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stickers" className="space-y-4 pt-4">
                  <div className="grid grid-cols-4 gap-2">
                    {stickerEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12 text-2xl"
                        onClick={() => addSticker(emoji, "sticker")}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Time Label (optional)</h4>
                    <Input
                      placeholder="e.g. Day 1, Morning, etc."
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Add Text</h4>
                    <Input placeholder="Enter your text" value={newText} onChange={(e) => setNewText(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Time Label (optional)</h4>
                    <Input
                      placeholder="e.g. Day 1, Morning, etc."
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={() => addSticker("", "text")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                </TabsContent>
              </Tabs>

              {selectedSticker && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Edit Selected Item</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Size</span>
                      <span>{stickers.find((s) => s.id === selectedSticker)?.scale.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[stickers.find((s) => s.id === selectedSticker)?.scale || 1]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => scaleSticker(selectedSticker, value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => rotateSticker(selectedSticker, "left")}
                    >
                      Rotate Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => rotateSticker(selectedSticker, "right")}
                    >
                      Rotate Right
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => removeSticker(selectedSticker)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <Palette className="h-4 w-4" />
                Change Theme
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
