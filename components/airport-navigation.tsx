"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plane, Search, Clock, Coffee, ShoppingBag, Utensils, Map, Info, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"

type Gate = {
  id: string
  number: string
  terminal: string
  airline: string
  destination: string
  departureTime: string
  status: "On Time" | "Delayed" | "Boarding" | "Departed" | "Cancelled"
  walkingTime: number
}

type Amenity = {
  id: string
  name: string
  type: "restaurant" | "shop" | "service"
  location: string
  terminal: string
  description: string
  icon: React.ReactNode
}

const gates: Gate[] = [
  {
    id: "g1",
    number: "A12",
    terminal: "1",
    airline: "Air France",
    destination: "Paris",
    departureTime: "10:30",
    status: "On Time",
    walkingTime: 8,
  },
  {
    id: "g2",
    number: "B05",
    terminal: "1",
    airline: "Lufthansa",
    destination: "Frankfurt",
    departureTime: "11:15",
    status: "Boarding",
    walkingTime: 12,
  },
  {
    id: "g3",
    number: "C22",
    terminal: "2",
    airline: "British Airways",
    destination: "London",
    departureTime: "12:45",
    status: "Delayed",
    walkingTime: 15,
  },
  {
    id: "g4",
    number: "A08",
    terminal: "1",
    airline: "KLM",
    destination: "Amsterdam",
    departureTime: "13:20",
    status: "On Time",
    walkingTime: 6,
  },
  {
    id: "g5",
    number: "D17",
    terminal: "3",
    airline: "Emirates",
    destination: "Dubai",
    departureTime: "14:50",
    status: "On Time",
    walkingTime: 20,
  },
  {
    id: "g6",
    number: "B12",
    terminal: "1",
    airline: "Delta",
    destination: "New York",
    departureTime: "16:30",
    status: "On Time",
    walkingTime: 10,
  },
  {
    id: "g7",
    number: "C09",
    terminal: "2",
    airline: "Singapore Airlines",
    destination: "Singapore",
    departureTime: "23:45",
    status: "On Time",
    walkingTime: 18,
  },
  {
    id: "g8",
    number: "D03",
    terminal: "3",
    airline: "Qantas",
    destination: "Sydney",
    departureTime: "22:15",
    status: "Delayed",
    walkingTime: 22,
  },
]

const amenities: Amenity[] = [
  {
    id: "a1",
    name: "Café Altitude",
    type: "restaurant",
    location: "Near Gate A10",
    terminal: "1",
    description: "Coffee, pastries, and light meals",
    icon: <Coffee className="h-4 w-4" />,
  },
  {
    id: "a2",
    name: "Duty Free Zone",
    type: "shop",
    location: "Terminal 1 Main Hall",
    terminal: "1",
    description: "Tax-free luxury goods and souvenirs",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    id: "a3",
    name: "Sky Bistro",
    type: "restaurant",
    location: "Near Gate B08",
    terminal: "1",
    description: "Full-service restaurant with international cuisine",
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    id: "a4",
    name: "Travel Essentials",
    type: "shop",
    location: "Near Gate C15",
    terminal: "2",
    description: "Books, electronics, and travel necessities",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    id: "a5",
    name: "Express Spa",
    type: "service",
    location: "Terminal 2 Upper Level",
    terminal: "2",
    description: "Quick massages and beauty treatments",
    icon: <Coffee className="h-4 w-4" />,
  },
  {
    id: "a6",
    name: "Global Cuisine",
    type: "restaurant",
    location: "Food Court, Terminal 3",
    terminal: "3",
    description: "Food court with multiple international options",
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    id: "a7",
    name: "Tech Stop",
    type: "shop",
    location: "Near Gate D10",
    terminal: "3",
    description: "Electronics, adapters, and gadgets",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    id: "a8",
    name: "Lounge Access",
    type: "service",
    location: "Terminal 3 Upper Level",
    terminal: "3",
    description: "Premium lounge with complimentary refreshments",
    icon: <Coffee className="h-4 w-4" />,
  },
]

const statusColors = {
  "On Time": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Delayed: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Boarding: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Departed: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

type MapItem = {
  id: string;
  name: string;
  location: string;
  terminal: string;
  type: "gate" | "amenity";
}

export default function AirportNavigation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [terminalFilter, setTerminalFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"gates" | "amenities">("gates")
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [selectedMapItem, setSelectedMapItem] = useState<MapItem | null>(null)

  // Function to handle showing an item on the map
  const showOnMap = (item: MapItem) => {
    setSelectedMapItem(item)
    setIsMapOpen(true)
  }

  const filteredGates = gates.filter((gate) => {
    // Filter by terminal
    if (terminalFilter !== "all" && gate.terminal !== terminalFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        gate.number.toLowerCase().includes(query) ||
        gate.airline.toLowerCase().includes(query) ||
        gate.destination.toLowerCase().includes(query)
      )
    }

    return true
  })

  const filteredAmenities = amenities.filter((amenity) => {
    // Filter by terminal
    if (terminalFilter !== "all" && amenity.terminal !== terminalFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        amenity.name.toLowerCase().includes(query) ||
        amenity.type.toLowerCase().includes(query) ||
        amenity.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Add a function to get related amenities for gates
  const getNearbyAmenities = (terminal: string) => {
    return amenities
      .filter(amenity => amenity.terminal === terminal)
      .slice(0, 3); // Just get up to 3 nearby amenities
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Airport Navigation</h2>
        <p className="text-muted-foreground">Find your gate and airport amenities</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={terminalFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTerminalFilter("all")}
          >
            All Terminals
          </Button>
          <Button
            variant={terminalFilter === "1" ? "default" : "outline"}
            size="sm"
            onClick={() => setTerminalFilter("1")}
          >
            Terminal 1
          </Button>
          <Button
            variant={terminalFilter === "2" ? "default" : "outline"}
            size="sm"
            onClick={() => setTerminalFilter("2")}
          >
            Terminal 2
          </Button>
          <Button
            variant={terminalFilter === "3" ? "default" : "outline"}
            size="sm"
            onClick={() => setTerminalFilter("3")}
          >
            Terminal 3
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gates or amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full md:w-[300px]"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "gates" | "amenities")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gates" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Gates
          </TabsTrigger>
          <TabsTrigger value="amenities" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            Amenities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gates" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGates.map((gate) => (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-indigo-500" />
                          Gate {gate.number}
                        </CardTitle>
                        <CardDescription>Terminal {gate.terminal}</CardDescription>
                      </div>
                      <Badge className={statusColors[gate.status]}>{gate.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Airline</span>
                        <span className="font-medium">{gate.airline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Destination</span>
                        <span className="font-medium">{gate.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Departure</span>
                        <span className="font-medium">{gate.departureTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Walking Time</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {gate.walkingTime} min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => showOnMap({
                        id: gate.id,
                        name: `Gate ${gate.number}`,
                        location: `Terminal ${gate.terminal}`,
                        terminal: gate.terminal,
                        type: "gate"
                      })}
                    >
                      <Map className="h-4 w-4" />
                      Show on Map
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredGates.length === 0 && (
            <div className="text-center py-12">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No gates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="amenities" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAmenities.map((amenity) => (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {amenity.icon}
                          {amenity.name}
                        </CardTitle>
                        <CardDescription>Terminal {amenity.terminal}</CardDescription>
                      </div>
                      <Badge variant="outline">{amenity.type.charAt(0).toUpperCase() + amenity.type.slice(1)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="font-medium">{amenity.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{amenity.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => showOnMap({
                        id: amenity.id,
                        name: amenity.name,
                        location: amenity.location,
                        terminal: amenity.terminal,
                        type: "amenity"
                      })}
                    >
                      <Map className="h-4 w-4" />
                      Show on Map
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAmenities.length === 0 && (
            <div className="text-center py-12">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No amenities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedMapItem?.type === "gate" ? (
                <Plane className="h-5 w-5 text-indigo-500" />
              ) : (
                selectedMapItem?.type === "amenity" && 
                (selectedMapItem?.name.toLowerCase().includes("café") || 
                 selectedMapItem?.name.toLowerCase().includes("lounge") ? 
                  <Coffee className="h-5 w-5 text-amber-500" /> : 
                  selectedMapItem?.name.toLowerCase().includes("shop") || 
                  selectedMapItem?.name.toLowerCase().includes("tech") ? 
                    <ShoppingBag className="h-5 w-5 text-blue-500" /> : 
                    <Utensils className="h-5 w-5 text-green-500" />
                )
              )}
              {selectedMapItem?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedMapItem?.location}
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative rounded-md border overflow-hidden h-[350px] bg-slate-100 dark:bg-slate-800">
                {/* Enhanced airport map visualization */}
                <div className="absolute inset-0">
                  {/* Main terminal structure */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[95%] h-[90%] relative bg-white/30 dark:bg-black/20 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-2">
                      {/* Terminal outlines with more details */}
                      <div className="absolute top-0 left-0 w-[30%] h-full border-2 border-gray-300 bg-slate-50/70 dark:bg-slate-700/70 rounded-lg overflow-hidden">
                        <div className="h-8 bg-blue-500/20 border-b-2 border-gray-300 flex items-center justify-center">
                          <div className="text-sm font-medium">Terminal 1</div>
                        </div>
                        
                        {/* Gates layout */}
                        <div className="flex flex-col h-[calc(100%-32px)]">
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Gates A1-A20</div>
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Gates B1-B15</div>
                          <div className="p-1 text-xs text-center">Baggage Claim</div>
                          
                          {/* Shops and restaurants indicators */}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <Coffee className="h-3 w-3 text-amber-500" />
                            <ShoppingBag className="h-3 w-3 text-blue-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-0 left-[35%] w-[30%] h-full border-2 border-gray-300 bg-slate-50/70 dark:bg-slate-700/70 rounded-lg overflow-hidden">
                        <div className="h-8 bg-green-500/20 border-b-2 border-gray-300 flex items-center justify-center">
                          <div className="text-sm font-medium">Terminal 2</div>
                        </div>
                        
                        {/* Gates layout */}
                        <div className="flex flex-col h-[calc(100%-32px)]">
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Gates C1-C25</div>
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Food Court</div>
                          <div className="p-1 text-xs text-center">Security Check</div>
                          
                          {/* Shops and restaurants indicators */}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <Utensils className="h-3 w-3 text-green-500" />
                            <ShoppingBag className="h-3 w-3 text-blue-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-0 right-0 w-[30%] h-full border-2 border-gray-300 bg-slate-50/70 dark:bg-slate-700/70 rounded-lg overflow-hidden">
                        <div className="h-8 bg-purple-500/20 border-b-2 border-gray-300 flex items-center justify-center">
                          <div className="text-sm font-medium">Terminal 3</div>
                        </div>
                        
                        {/* Gates layout */}
                        <div className="flex flex-col h-[calc(100%-32px)]">
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Gates D1-D18</div>
                          <div className="border-b border-gray-300 p-1 text-xs text-center">Premium Lounges</div>
                          <div className="p-1 text-xs text-center">Duty Free</div>
                          
                          {/* Shops and restaurants indicators */}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            <Coffee className="h-3 w-3 text-amber-500" />
                            <Utensils className="h-3 w-3 text-green-500" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Central concourse/connection between terminals */}
                      <div className="absolute top-[25%] left-[29%] w-[42%] h-[15%] bg-gray-200/70 dark:bg-gray-600/50 rounded border border-gray-300">
                        <div className="text-xs font-medium text-center p-1">Main Concourse</div>
                      </div>
                      
                      {/* Walking paths */}
                      {selectedMapItem && (
                        <>
                          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <marker id="arrowhead" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                                <polygon points="0 0, 5 2.5, 0 5" fill="#ef4444" />
                              </marker>
                            </defs>
                            <path 
                              d={`M ${selectedMapItem.terminal === "1" ? "15%" : selectedMapItem.terminal === "2" ? "50%" : "85%"} 50% L 50% 50% L 50% 75%`} 
                              stroke="#ef4444" 
                              strokeWidth="2" 
                              strokeDasharray="4" 
                              fill="none"
                              markerEnd="url(#arrowhead)" 
                            />
                          </svg>
                        
                          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs border border-gray-300 dark:border-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedMapItem.type === "gate" 
                              ? `${gates.find(g => g.id === selectedMapItem.id)?.walkingTime || 5} min walk` 
                              : "5-10 min walk"}
                          </div>
                        </>
                      )}
                      
                      {/* Highlight the selected terminal */}
                      {selectedMapItem && (
                        <motion.div 
                          className={`absolute ${
                            selectedMapItem.terminal === "1" ? "top-0 left-0 w-[30%]" : 
                            selectedMapItem.terminal === "2" ? "top-0 left-[35%] w-[30%]" : 
                            "top-0 right-0 w-[30%]"
                          } h-full border-2 border-indigo-500 bg-indigo-100/30 dark:bg-indigo-900/20 rounded-lg overflow-hidden`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Pulsing location marker */}
                          <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <div className="relative">
                              <div className="absolute -inset-1 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                              <div className="relative bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
                                {selectedMapItem.type === "gate" ? (
                                  <Plane className="h-3 w-3 text-white" />
                                ) : (
                                  selectedMapItem.name.toLowerCase().includes("café") || 
                                  selectedMapItem.name.toLowerCase().includes("lounge") ? 
                                  <Coffee className="h-3 w-3 text-white" /> : 
                                  selectedMapItem.name.toLowerCase().includes("shop") || 
                                  selectedMapItem.name.toLowerCase().includes("tech") ? 
                                  <ShoppingBag className="h-3 w-3 text-white" /> : 
                                  <Utensils className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced legend */}
                  <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-black/70 p-2 rounded-md text-xs border border-gray-200 dark:border-gray-700">
                    <div className="font-medium mb-1">Legend</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Your Location</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="h-3 w-3 text-amber-500" />
                        <span>Café/Lounge</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3 text-blue-500" />
                        <span>Shop</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Utensils className="h-3 w-3 text-green-500" />
                        <span>Restaurant</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Current time */}
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional information panel */}
            <div className="space-y-3">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {selectedMapItem?.type === "gate" && (
                    <div className="space-y-2 text-sm">
                      {gates.filter(gate => gate.id === selectedMapItem.id).map(gate => (
                        <div key={gate.id}>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className={statusColors[gate.status]}>{gate.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Airline</span>
                            <span>{gate.airline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Destination</span>
                            <span>{gate.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Departure</span>
                            <span>{gate.departureTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Walking Time</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {gate.walkingTime} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedMapItem?.type === "amenity" && (
                    <div className="space-y-2 text-sm">
                      {amenities.filter(amenity => amenity.id === selectedMapItem.id).map(amenity => (
                        <div key={amenity.id}>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <Badge variant="outline">{amenity.type.charAt(0).toUpperCase() + amenity.type.slice(1)}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location</span>
                            <span>{amenity.location}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-muted-foreground">Description</span>
                            <p>{amenity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Nearby section */}
              {selectedMapItem && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Nearby</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 pb-3">
                    <div className="space-y-2">
                      {getNearbyAmenities(selectedMapItem.terminal).map((nearbyAmenity) => (
                        <Button 
                          key={nearbyAmenity.id} 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => showOnMap({
                            id: nearbyAmenity.id,
                            name: nearbyAmenity.name,
                            location: nearbyAmenity.location,
                            terminal: nearbyAmenity.terminal,
                            type: "amenity"
                          })}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {nearbyAmenity.icon}
                            <span className="truncate">{nearbyAmenity.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Navigation help */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Navigation Help</CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Follow the red dotted line to reach your destination.
                      Look for digital signage throughout the terminal for additional guidance.
                    </p>
                    <Button className="w-full" size="sm">
                      <span className="flex items-center gap-2 px-2 py-1">
                        <Map className="h-4 w-4" /> 
                        Start Navigation
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsMapOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
