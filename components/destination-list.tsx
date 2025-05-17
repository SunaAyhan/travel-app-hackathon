"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, Star, Search, Globe, Plane, Calendar, Users, Landmark, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type Region = "all" | "europe" | "asia" | "americas" | "africa" | "oceania"

type Destination = {
  id: string
  name: string
  country: string
  region: Exclude<Region, "all">
  emoji: string
  description: string
  rating: number
  imageUrl: string
  favorite: boolean
}

const destinations: Destination[] = [
  {
    id: "1",
    name: "Paris",
    country: "France",
    region: "europe",
    emoji: "🇫🇷",
    description: "The City of Light with iconic landmarks like the Eiffel Tower and Louvre Museum.",
    rating: 4.7,
    imageUrl: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    region: "asia",
    emoji: "🇯🇵",
    description: "A fascinating blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "3",
    name: "New York",
    country: "USA",
    region: "americas",
    emoji: "🇺🇸",
    description: "The Big Apple offers world-class dining, shopping, and entertainment options.",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "4",
    name: "Cape Town",
    country: "South Africa",
    region: "africa",
    emoji: "🇿🇦",
    description: "A stunning coastal city with Table Mountain as its backdrop.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1496497243327-9dccd845c35f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcGUlMjB0b3dufGVufDB8fDB8fHww",
    favorite: false,
  },
  {
    id: "5",
    name: "Sydney",
    country: "Australia",
    region: "oceania",
    emoji: "🇦🇺",
    description: "Famous for its harbourfront Opera House, beautiful beaches, and vibrant culture.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "6",
    name: "Barcelona",
    country: "Spain",
    region: "europe",
    emoji: "🇪🇸",
    description: "Known for its art and architecture, including Gaudí's Sagrada Família.",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "7",
    name: "Bangkok",
    country: "Thailand",
    region: "asia",
    emoji: "🇹🇭",
    description: "A city of contrasts with ornate shrines and vibrant street life.",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1694824995159-2093477bc337?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
  {
    id: "8",
    name: "Rio de Janeiro",
    country: "Brazil",
    region: "americas",
    emoji: "🇧🇷",
    description: "Famous for its Copacabana beach, Christ the Redeemer statue, and annual carnival.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    favorite: false,
  },
]

// Helper function to get weather icon based on region
const getWeatherIcon = (region: string) => {
  // Simple mapping based on region - in real app, would use actual weather data
  switch(region) {
    case "europe": return "🌦️";
    case "asia": return "☀️";
    case "americas": return "🌤️";
    case "africa": return "☀️";
    case "oceania": return "🌊";
    default: return "☁️";
  }
};

// Helper function to calculate local time in each destination
const getLocalTime = (city: string) => {
  const now = new Date();
  
  // Simple time zone offsets (in hours) - in real app would use proper timezone API
  const timeOffsets: {[key: string]: number} = {
    "Tokyo": 9,
    "Paris": 1,
    "New York": -5,
    "Cape Town": 2,
    "Sydney": 11,
    "Barcelona": 1,
    "Bangkok": 7,
    "Rio de Janeiro": -3,
  };
  
  const cityOffset = timeOffsets[city] || 0;
  const localTime = new Date(now.getTime() + (cityOffset * 60 * 60 * 1000));
  
  return localTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};

export default function DestinationList() {
  const [activeRegion, setActiveRegion] = useState<Region>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations)
  const [listedDestinations, setListedDestinations] = useState<Destination[]>(destinations)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const toggleFavorite = (id: string) => {
    const updated = listedDestinations.map((dest) => (dest.id === id ? { ...dest, favorite: !dest.favorite } : dest))
    setListedDestinations(updated)
  }

  const handleExplore = (destination: Destination) => {
    setSelectedDestination(destination)
    setShowDialog(true)
  }

  useEffect(() => {
    let result = [...listedDestinations]

    // Filter by region
    if (activeRegion !== "all") {
      result = result.filter((dest) => dest.region === activeRegion)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query) ||
          dest.description.toLowerCase().includes(query),
      )
    }

    setFilteredDestinations(result)
  }, [activeRegion, searchQuery, listedDestinations])

  const regionEmojis = {
    all: "🌎",
    europe: "🇪🇺",
    asia: "🌏",
    americas: "🌎",
    africa: "🌍",
    oceania: "🏝️",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Explore Destinations</h2>
          <p className="text-muted-foreground">Discover amazing places around the world</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-800 w-full md:w-[300px]"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2">
        {(Object.keys(regionEmojis) as Region[]).map((region) => (
          <motion.button
            key={region}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap ${
              activeRegion === region
                ? "bg-[#9e2761] text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <span>{regionEmojis[region]}</span>
            <span>{region.charAt(0).toUpperCase() + region.slice(1)}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredDestinations.map((destination) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
              className="group"
              style={{ 
                transformStyle: 'preserve-3d', 
                perspective: '1000px' 
              }}
            >
              <Card 
                className="overflow-hidden h-full flex flex-col bg-white dark:bg-slate-800 border-[8px] border-white dark:border-slate-700 shadow-lg" 
                style={{ 
                  transform: `rotate(${Math.random() * 3 - 1.5}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Postcard header */}
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                      <span>{destination.emoji}</span> {destination.country}
                    </Badge>
                    <Badge variant="secondary" className="ml-2">
                      {getWeatherIcon(destination.region)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Now: {getLocalTime(destination.name)} local
                  </div>
                </div>

                {/* Image with overlays */}
                <div className="relative">
                  <img
                    src={destination.imageUrl || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Greetings text overlay */}
                  <div className="absolute top-4 left-0 right-0 text-center">
                    <div className="inline-block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-md rotate-[-2deg] shadow-sm">
                      <p className="text-lg font-medium" style={{ fontFamily: 'cursive' }}>
                        Greetings from {destination.name}!
                      </p>
                    </div>
                  </div>
                  
                  {/* Stamp */}
                  <div className="absolute top-2 right-2 h-16 w-16 border-2 border-red-500 rounded-md flex items-center justify-center overflow-hidden rotate-12 bg-white/30 backdrop-blur-sm">
                    <div className="text-center text-red-500">
                      <div className="text-xs font-bold">POSTCARD</div>
                      <div className="text-xs">{new Date().getFullYear()}</div>
                    </div>
                  </div>

                  {/* Favorite button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(destination.id)}
                    className="absolute bottom-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full h-8 w-8"
                  >
                    <Heart
                      className={`h-5 w-5 ${destination.favorite ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"}`}
                    />
                  </Button>
                </div>

                {/* Postcard content */}
                <CardContent className="pt-4 pb-2 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{destination.name}</h3>
                    <div className="flex items-center text-amber-500">
                      <span className="mr-1 text-sm font-medium">{destination.rating.toFixed(1)}</span>
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{destination.description}</p>
                </CardContent>
                
                <CardFooter className="pt-0 pb-4">
                  <Button 
                    className="w-full gap-2 bg-[#9e2761] hover:bg-[#9e2761]/90" 
                    onClick={() => handleExplore(destination)}
                  >
                    <Plane className="h-4 w-4" />
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Destination Details Dialog */}
      {selectedDestination && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">{selectedDestination.emoji}</span>
                {selectedDestination.name}, {selectedDestination.country}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <img 
                src={selectedDestination.imageUrl} 
                alt={selectedDestination.name}
                className="w-full h-52 object-cover rounded-md mb-4" 
              />
              
              <div className="space-y-4">
                <p className="text-lg">{selectedDestination.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Region</h4>
                    <p className="font-medium">{selectedDestination.region.charAt(0).toUpperCase() + selectedDestination.region.slice(1)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Rating</h4>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(selectedDestination.rating) ? "fill-current" : "fill-muted stroke-muted-foreground"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{selectedDestination.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Best Time to Visit
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDestination.region === "europe" ? "Spring (April to June) and Fall (September to October)" : 
                    selectedDestination.region === "asia" ? "Spring (March to May) and Fall (September to November)" :
                    selectedDestination.region === "americas" ? "Varies by location, generally Spring or Fall" :
                    selectedDestination.region === "africa" ? "Dry seasons: May to October (varies by region)" :
                    "Summer (December to February)"}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    Popular Attractions
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                    {selectedDestination.name === "Paris" ? (
                      <>
                        <li>Eiffel Tower</li>
                        <li>Louvre Museum</li>
                        <li>Notre-Dame Cathedral</li>
                      </>
                    ) : selectedDestination.name === "Tokyo" ? (
                      <>
                        <li>Tokyo Tower</li>
                        <li>Shibuya Crossing</li>
                        <li>Senso-ji Temple</li>
                      </>
                    ) : selectedDestination.name === "New York" ? (
                      <>
                        <li>Statue of Liberty</li>
                        <li>Central Park</li>
                        <li>Empire State Building</li>
                      </>
                    ) : (
                      <>
                        <li>City Center</li>
                        <li>Local Museums</li>
                        <li>Natural Landmarks</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Local Tips
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDestination.name === "Paris" ? "Try to visit major attractions early in the morning to avoid crowds. Purchase museum passes in advance." : 
                    selectedDestination.name === "Tokyo" ? "Get a Suica/Pasmo card for easy public transportation. Convenience stores (konbini) are great for quick meals." :
                    selectedDestination.name === "New York" ? "Use the subway to get around. Purchase a CityPASS if you plan to visit multiple attractions." :
                    "Learn a few basic phrases in the local language and always respect local customs."}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                className="gap-2 bg-[#9e2761] hover:bg-[#9e2761]/90" 
                onClick={() => setShowDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
