"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PackingChecklist from "@/components/packing-checklist"
import DestinationList from "@/components/destination-list"
import CurrencyConverter from "@/components/currency-converter"
import TripCountdown from "@/components/trip-countdown"
import TravelGallery from "@/components/travel-gallery"
import BudgetTracker from "@/components/budget-tracker"
import LanguageCheatSheet from "@/components/language-cheat-sheet"
import ItineraryBoard from "@/components/itinerary-board"
import AirportNavigation from "@/components/airport-navigation"
import TripMoodboard from "@/components/trip-moodboard"
import { Globe, Sparkles, ChevronRight } from "lucide-react"
import ThreeScene from "./HomePage"
import { Button } from "@/components/ui/button"
import AnimatedHeader from "@/components/animated-header"
import "./animatedHeader.css"

export default function Home() {
  const [activeTab, setActiveTab] = useState("destinations")
  const [showApp, setShowApp] = useState(false)

  if (!showApp) {
    return (
      <div className="relative min-h-screen">
        <ThreeScene />
        
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="hide-text pointer-events-auto p-8 text-center bg-white rounded-lg backdrop-blur-sm shadow-lg">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">Welcome to TravelBuddy</h1>
            <Button 
              onClick={() => setShowApp(true)} 
              size="lg"
              className="bg-[#9e2761] text-white hover:bg-[#9e2761]"
            >
              Enter App <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="circle"></div>
        <div className="circle-follow"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e8efff" }}>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <AnimatedHeader />
            </motion.div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowApp(false)}
                className="text-[#9e2761] dark:text-indigo-400"
              >
                Back to Home
              </Button>
            
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-auto pb-2">
            <TabsList className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl">
              <TabsTrigger
                value="destinations"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Destinations
              </TabsTrigger>
              <TabsTrigger
                value="packing"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Packing List
              </TabsTrigger>
              <TabsTrigger
                value="currency"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Currency
              </TabsTrigger>
              <TabsTrigger
                value="countdown"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Trip Planner
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="budget"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Budget
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Language
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger
                value="airport"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Airport
              </TabsTrigger>
              <TabsTrigger
                value="moodboard"
                className="rounded-lg data-[state=active]:bg-[#9e2761] data-[state=active]:text-white"
              >
                Moodboard
              </TabsTrigger>
            </TabsList>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="destinations" className="mt-0">
              <DestinationList />
            </TabsContent>

            <TabsContent value="packing" className="mt-0">
              <PackingChecklist />
            </TabsContent>

            <TabsContent value="currency" className="mt-0">
              <CurrencyConverter />
            </TabsContent>

            <TabsContent value="countdown" className="mt-0">
              <TripCountdown />
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <TravelGallery />
            </TabsContent>

            <TabsContent value="budget" className="mt-0">
              <BudgetTracker />
            </TabsContent>

            <TabsContent value="language" className="mt-0">
              <LanguageCheatSheet />
            </TabsContent>

            <TabsContent value="itinerary" className="mt-0">
              <ItineraryBoard />
            </TabsContent>

            <TabsContent value="airport" className="mt-0">
              <AirportNavigation />
            </TabsContent>

            <TabsContent value="moodboard" className="mt-0">
              <TripMoodboard />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  )
}
