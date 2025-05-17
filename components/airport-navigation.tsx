"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plane, Search, Clock, Coffee, ShoppingBag, Utensils, Map, Info } from "lucide-react"

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

export default function AirportNavigation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [terminalFilter, setTerminalFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"gates" | "amenities">("gates")

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
                    <Button variant="outline" className="w-full gap-2">
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
                    <Button variant="outline" className="w-full gap-2">
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
    </div>
  )
}
