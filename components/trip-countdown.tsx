"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays, differenceInSeconds } from "date-fns"
import { CalendarIcon, Edit2, Save, Image, Smile, ChevronLeft, ChevronRight, Edit3, PenTool, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DayPlan = {
  id: string
  date: Date
  notes: string
  photos: string[]
  stickers: string[]
}

type TimeDigit = {
  current: string
  next: string
  flipped: boolean
}

// Mock stickers and handwriting fonts
const STICKERS = [
  "🌴", "🏖️", "✈️", "🧳", "🗺️", "🏝️", "🚗", "🚢", "🚆", "🏞️", "🌅", "🌄", 
  "🍽️", "🥂", "📸", "🎡", "🏰", "🏛️", "⛱️", "🚶", "🏊", "🏄", "📍", "❤️"
];

const HANDWRITING_STYLES = [
  { name: "Regular", className: "" },
  { name: "Casual", className: "font-handwriting-casual" },
  { name: "Elegant", className: "font-handwriting-elegant" },
  { name: "Bold", className: "font-handwriting-bold" }
];

export default function TripCountdown() {
  const [tripName, setTripName] = useState<string>("Summer Vacation in Bali")
  const [departureDate, setDepartureDate] = useState<Date>(addDays(new Date(), 45))
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 59))
  const [daysLeft, setDaysLeft] = useState<number>(0)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null)
  const [editingNotes, setEditingNotes] = useState<string>("")
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [isFlipping, setIsFlipping] = useState<boolean>(false)
  const [selectedFont, setSelectedFont] = useState<string>("font-handwriting-casual") // Set a default handwriting font
  const [selectedTab, setSelectedTab] = useState<string>("text")
  
  // New state for countdown timer
  const [daysDigit1, setDaysDigit1] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [daysDigit2, setDaysDigit2] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [daysDigit3, setDaysDigit3] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [hoursDigit1, setHoursDigit1] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [hoursDigit2, setHoursDigit2] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [minutesDigit1, setMinutesDigit1] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [minutesDigit2, setMinutesDigit2] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [secondsDigit1, setSecondsDigit1] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })
  const [secondsDigit2, setSecondsDigit2] = useState<TimeDigit>({ current: '0', next: '0', flipped: false })

  // Add a reference for the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Calculate days left
    const today = new Date()
    const daysToTrip = differenceInDays(departureDate, today)
    setDaysLeft(daysToTrip)

    // Initialize day plans if empty
    if (dayPlans.length === 0 && departureDate && returnDate) {
      const days = differenceInDays(returnDate, departureDate) + 1
      const initialPlans: DayPlan[] = []

      for (let i = 0; i < days; i++) {
        const date = addDays(departureDate, i)
        initialPlans.push({
          id: `day-${i + 1}`,
          date,
          notes:
            i === 0
              ? "Arrival day - Check in to hotel"
              : i === days - 1
                ? "Departure day - Check out and head to airport"
                : "",
          photos: [],
          stickers: []
        })
      }

      setDayPlans(initialPlans)
      setSelectedDay(initialPlans[0])
      setEditingNotes(initialPlans[0].notes)
    }
  }, [departureDate, returnDate])

  // New useEffect for detailed countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const totalSeconds = Math.max(0, Math.floor(differenceInSeconds(departureDate, now)));
      
      const days = Math.floor(totalSeconds / 86400); // seconds in a day
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      // Format with padding
      const daysStr = days.toString().padStart(3, '0');
      const hoursStr = hours.toString().padStart(2, '0');
      const minutesStr = minutes.toString().padStart(2, '0');
      const secondsStr = seconds.toString().padStart(2, '0');
      
      // Update days digits
      if (daysDigit1.current !== daysStr[0]) {
        setDaysDigit1({ current: daysStr[0], next: daysStr[0], flipped: !daysDigit1.flipped });
      }
      if (daysDigit2.current !== daysStr[1]) {
        setDaysDigit2({ current: daysStr[1], next: daysStr[1], flipped: !daysDigit2.flipped });
      }
      if (daysDigit3.current !== daysStr[2]) {
        setDaysDigit3({ current: daysStr[2], next: daysStr[2], flipped: !daysDigit3.flipped });
      }
      
      // Update hours digits
      if (hoursDigit1.current !== hoursStr[0]) {
        setHoursDigit1({ current: hoursStr[0], next: hoursStr[0], flipped: !hoursDigit1.flipped });
      }
      if (hoursDigit2.current !== hoursStr[1]) {
        setHoursDigit2({ current: hoursStr[1], next: hoursStr[1], flipped: !hoursDigit2.flipped });
      }
      
      // Update minutes digits
      if (minutesDigit1.current !== minutesStr[0]) {
        setMinutesDigit1({ current: minutesStr[0], next: minutesStr[0], flipped: !minutesDigit1.flipped });
      }
      if (minutesDigit2.current !== minutesStr[1]) {
        setMinutesDigit2({ current: minutesStr[1], next: minutesStr[1], flipped: !minutesDigit2.flipped });
      }
      
      // Update seconds digits
      if (secondsDigit1.current !== secondsStr[0]) {
        setSecondsDigit1({ current: secondsStr[0], next: secondsStr[0], flipped: !secondsDigit1.flipped });
      }
      if (secondsDigit2.current !== secondsStr[1]) {
        setSecondsDigit2({ current: secondsStr[1], next: secondsStr[1], flipped: !secondsDigit2.flipped });
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Set interval for countdown
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [departureDate, daysDigit1, daysDigit2, daysDigit3, hoursDigit1, hoursDigit2, minutesDigit1, minutesDigit2, secondsDigit1, secondsDigit2]);

  // Handle date change in calendar
  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      setDepartureDate(date);
      
      // Force-reset the countdown digits to trigger animation
      const now = new Date();
      const totalSeconds = Math.max(0, Math.floor(differenceInSeconds(date, now)));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      const daysStr = days.toString().padStart(3, '0');
      const hoursStr = hours.toString().padStart(2, '0');
      const minutesStr = minutes.toString().padStart(2, '0');
      const secondsStr = seconds.toString().padStart(2, '0');
      
      setDaysDigit1({ current: daysStr[0], next: daysStr[0], flipped: true });
      setDaysDigit2({ current: daysStr[1], next: daysStr[1], flipped: true });
      setDaysDigit3({ current: daysStr[2], next: daysStr[2], flipped: true });
      setHoursDigit1({ current: hoursStr[0], next: hoursStr[0], flipped: true });
      setHoursDigit2({ current: hoursStr[1], next: hoursStr[1], flipped: true });
      setMinutesDigit1({ current: minutesStr[0], next: minutesStr[0], flipped: true });
      setMinutesDigit2({ current: minutesStr[1], next: minutesStr[1], flipped: true });
      setSecondsDigit1({ current: secondsStr[0], next: secondsStr[0], flipped: true });
      setSecondsDigit2({ current: secondsStr[1], next: secondsStr[1], flipped: true });
    }
  };

  const saveNotes = () => {
    if (selectedDay) {
      setDayPlans(dayPlans.map((day) => (day.id === selectedDay.id ? { ...day, notes: editingNotes } : day)))
    }
  }

  const selectDay = (day: DayPlan) => {
    saveNotes() // Save current notes before switching
    setSelectedDay(day)
    setEditingNotes(day.notes)
  }

  const getDayNumber = (date: Date) => {
    return differenceInDays(date, departureDate) + 1
  }

  const flipToNextDay = () => {
    if (currentPageIndex < dayPlans.length - 1) {
      saveNotes();
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex + 1);
        setSelectedDay(dayPlans[currentPageIndex + 1]);
        setEditingNotes(dayPlans[currentPageIndex + 1].notes);
        setIsFlipping(false);
      }, 300);
    }
  }

  const flipToPrevDay = () => {
    if (currentPageIndex > 0) {
      saveNotes();
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex - 1);
        setSelectedDay(dayPlans[currentPageIndex - 1]);
        setEditingNotes(dayPlans[currentPageIndex - 1].notes);
        setIsFlipping(false);
      }, 300);
    }
  }

  const addSticker = (sticker: string) => {
    if (selectedDay) {
      const updatedStickers = [...selectedDay.stickers, sticker];
      const updatedDay = { ...selectedDay, stickers: updatedStickers };
      setSelectedDay(updatedDay);
      setDayPlans(dayPlans.map(day => day.id === selectedDay.id ? updatedDay : day));
    }
  }

  const addPhoto = () => {
    // Trigger the hidden file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  
  // New handler function for when a file is selected
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && selectedDay) {
      const file = event.target.files[0];
      
      // Only process image files
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Read the file and convert to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result && selectedDay) {
          // Add the data URL to the photos array
          const photoUrl = e.target.result.toString();
          const updatedPhotos = [...selectedDay.photos, photoUrl];
          const updatedDay = { ...selectedDay, photos: updatedPhotos };
          
          setSelectedDay(updatedDay);
          setDayPlans(dayPlans.map(day => day.id === selectedDay.id ? updatedDay : day));
        }
      };
      
      // Read the file as data URL
      reader.readAsDataURL(file);
      
      // Reset the file input
      event.target.value = '';
    }
  };

  // Component for a simplified digit display
  const FlipDigit = ({ digit }: { digit: TimeDigit }) => {
    return (
      <div className="figure relative float-left h-16 w-12 mr-1 rounded-md overflow-hidden bg-white shadow-md">
        {/* Simplified to show a single digit with the requested color */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-[#9e2761]">{digit.current}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for photo selection */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      <div>
        <h2 className="text-2xl font-bold">Trip Planner</h2>
        <p className="text-muted-foreground">Count down to your adventure and plan each day</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trip Countdown</CardTitle>
            <CardDescription>The excitement is building!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trip Name</label>
              <Input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter your trip name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Departure Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={handleDepartureDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Return Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => date && setReturnDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="pt-4">
              {/* Replaced the static day counter with the full animated countdown */}
              <div className="text-center">
                {/* Complete Countdown Display */}
                <div className="flex justify-center mb-4">
                  <div className="countdown flex flex-wrap justify-center gap-4">
                    <div className="bloc-time days">
                      <span className="count-title text-sm font-medium text-[#9e2761]">Days</span>
                      <div className="flex">
                        <FlipDigit digit={daysDigit1} />
                        <FlipDigit digit={daysDigit2} />
                        <FlipDigit digit={daysDigit3} />
                      </div>
                    </div>

                    <div className="bloc-time hours">
                      <span className="count-title text-sm font-medium text-[#9e2761]">Hours</span>
                      <div className="flex">
                        <FlipDigit digit={hoursDigit1} />
                        <FlipDigit digit={hoursDigit2} />
                      </div>
                    </div>
                    
                    <div className="bloc-time min">
                      <span className="count-title text-sm font-medium text-[#9e2761]">Minutes</span>
                      <div className="flex">
                        <FlipDigit digit={minutesDigit1} />
                        <FlipDigit digit={minutesDigit2} />
                      </div>
                    </div>
                    
                    <div className="bloc-time sec">
                      <span className="count-title text-sm font-medium text-[#9e2761]">Seconds</span>
                      <div className="flex">
                        <FlipDigit digit={secondsDigit1} />
                        <FlipDigit digit={secondsDigit2} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">until your adventure begins</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="text-lg font-bold">{differenceInDays(returnDate, departureDate) + 1}</h4>
                  <p className="text-xs text-muted-foreground">Days of travel</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="text-lg font-bold">{format(departureDate, "MMM")}</h4>
                  <p className="text-xs text-muted-foreground">Travel month</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="text-lg font-bold">{format(departureDate, "E")}</h4>
                  <p className="text-xs text-muted-foreground">Departure day</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Journal Style Daily Planner */}
        <Card className="overflow-hidden bg-[#f8f6f1] border-amber-200">
          <CardHeader className="bg-amber-100 border-b border-amber-200">
            <div className="flex justify-between items-center">
              <CardTitle className="font-serif">Travel Journal</CardTitle>
              <CardDescription className="font-handwriting-casual">Capture your memories</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Journal navigation */}
            <div className="flex justify-between items-center p-3 bg-amber-50 border-b border-amber-200">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={flipToPrevDay}
                disabled={currentPageIndex === 0}
                className="text-amber-800"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
              
              <div className="text-center font-serif text-amber-800">
                {selectedDay && (
                  <>
                    <div className="text-sm">Day {getDayNumber(selectedDay.date)}</div>
                    <div className="text-xs opacity-70">{format(selectedDay.date, "EEEE, MMMM d, yyyy")}</div>
                  </>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={flipToNextDay}
                disabled={currentPageIndex === dayPlans.length - 1}
                className="text-amber-800"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Journal page with flip animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay?.id}
                initial={isFlipping ? { rotateY: -90, opacity: 0 } : { rotateY: 0, opacity: 1 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="journal-page relative min-h-[400px] p-6 bg-[url('/paper-texture.png')] bg-repeat"
                style={{
                  boxShadow: "inset 0 0 30px rgba(0,0,0,0.05)",
                  backgroundSize: "200px",
                }}
              >
                {selectedDay && (
                  <>
                    {/* Journal content */}
                    <div className="grid gap-4">
                      {/* Tabs for different content types */}
                      <Tabs 
                        value={selectedTab} 
                        onValueChange={setSelectedTab}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-4 bg-amber-50/80">
                          <TabsTrigger value="text" onClick={() => setSelectedTab("text")}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Text
                          </TabsTrigger>
                          <TabsTrigger value="photos" onClick={() => setSelectedTab("photos")}>
                            <Image className="h-4 w-4 mr-2" />
                            Photos
                          </TabsTrigger>
                          <TabsTrigger value="stickers" onClick={() => setSelectedTab("stickers")}>
                            <Smile className="h-4 w-4 mr-2" />
                            Stickers
                          </TabsTrigger>
                          <TabsTrigger value="styles" onClick={() => setSelectedTab("styles")}>
                            <PenTool className="h-4 w-4 mr-2" />
                            Style
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="text" className="mt-4">
                          <Textarea
                            value={editingNotes}
                            onChange={(e) => setEditingNotes(e.target.value)}
                            placeholder="Write your memories and plans for this day..."
                            className={`min-h-[200px] bg-transparent border-amber-200 border-opacity-50 ${selectedFont} journal-text handwriting-input`}
                            style={{
                              backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5d6bc 31px, #e5d6bc 32px)",
                              lineHeight: "32px",
                              padding: "8px 10px",
                              color: "#3a3124",
                              textShadow: "1px 1px 1px rgba(0,0,0,0.05)"
                            }}
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={saveNotes}
                            className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Entry
                          </Button>
                        </TabsContent>
                        
                        <TabsContent value="photos" className="mt-4">
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {selectedDay.photos.map((photo, idx) => (
                                <div 
                                  key={idx} 
                                  className="w-24 h-24 border border-amber-200 overflow-hidden relative rotate-1 shadow-md"
                                  style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                                >
                                  <img src={photo} alt="Travel memory" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={addPhoto}
                              className="border-amber-300 text-amber-800 hover:bg-amber-100"
                            >
                              <Image className="h-4 w-4 mr-2" />
                              Add Photo
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="stickers" className="mt-4">
                          <div className="space-y-4">
                            {/* Display added stickers */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {selectedDay.stickers.map((sticker, idx) => (
                                <div 
                                  key={idx}
                                  className="text-3xl transform rotate-3 sticker-shadow"
                                  style={{ transform: `rotate(${Math.random() * 20 - 10}deg)` }}
                                >
                                  {sticker}
                                </div>
                              ))}
                            </div>
                            
                            {/* Sticker selector */}
                            <div className="grid grid-cols-8 gap-2 p-2 bg-amber-50/50 rounded border border-amber-100">
                              {STICKERS.map((sticker, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => addSticker(sticker)}
                                  className="text-2xl p-1 hover:bg-amber-100 rounded transform transition-transform hover:scale-125"
                                >
                                  {sticker}
                                </button>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="styles" className="mt-4">
                          <div className="space-y-4">
                            <p className="text-sm text-amber-800">Choose your handwriting style:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {HANDWRITING_STYLES.map((style, idx) => (
                                <Button
                                  key={idx}
                                  variant={selectedFont === style.className ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedFont(style.className)}
                                  className={`border-amber-300 ${style.className}`}
                                >
                                  {style.name}
                                  {selectedFont === style.className && (
                                    <CheckCircle className="h-3 w-3 ml-2" />
                                  )}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    {/* Page number */}
                    <div className="absolute bottom-2 right-2 font-serif italic text-xs text-amber-800/60">
                      Page {currentPageIndex + 1} of {dayPlans.length}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
      
      {/* Add these CSS styles to your global stylesheet or use styled-components */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat&family=Dancing+Script&family=Indie+Flower&display=swap');
        
        .font-handwriting-casual {
          font-family: 'Indie Flower', cursive;
        }
        
        .font-handwriting-elegant {
          font-family: 'Dancing Script', cursive;
        }
        
        .font-handwriting-bold {
          font-family: 'Caveat', cursive;
          font-weight: bold;
        }
        
        .journal-text {
          font-size: 1.1rem;
        }
        
        .sticker-shadow {
          filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));
        }
        
        /* Enhanced handwriting styles */
        .handwriting-input {
          cursor: url('/pen-cursor.svg') 2 22, auto; 
          transition: transform 0.1s ease-out;
          letter-spacing: 0.5px;
        }

        /* Show a "writing" feedback when text is being entered */
        .handwriting-input:active {
          cursor: url('/pen-cursor.svg') 2 22, auto;
          animation: writing-motion 0.1s ease-in-out;
        }

        @keyframes writing-motion {
          0% { transform: translate(0px, 0px); }
          25% { transform: translate(1px, 1px); }
          50% { transform: translate(0px, 0px); }
          75% { transform: translate(-1px, 1px); }
          100% { transform: translate(0px, 0px); }
        }

        /* Dynamic ink effect */
        .journal-text-ink {
          position: relative;
        }

        .journal-text-ink::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 100%;
          width: 0;
          background: linear-gradient(to right, rgba(58, 49, 36, 0.1), transparent);
          animation: ink-flow 2s forwards;
          pointer-events: none;
        }

        @keyframes ink-flow {
          0% { width: 0; opacity: 0.3; }
          100% { width: 100%; opacity: 0; }
        }
        
        /* Make each character appear as if being written */
        .handwriting-input:focus::after {
          content: '|';
          animation: blink 1s infinite;
        }
        
        /* Text animation as typing */
        .handwriting-input:focus + * {
          animation: ink-write 0.3s ease-out;
        }
        
        /* Make the writing flow a bit irregularly like real handwriting */
        .font-handwriting-casual, .font-handwriting-elegant, .font-handwriting-bold {
          word-spacing: 2px;
          letter-spacing: 0.5px;
          font-kerning: none;
          text-rendering: optimizeLegibility;
          line-height: 1.5;
          font-variant-ligatures: contextual;
        }
      `}</style>
    </div>
  )
}
