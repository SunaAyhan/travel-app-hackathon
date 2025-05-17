"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays, differenceInSeconds } from "date-fns"
import { CalendarIcon, Edit2, Save } from "lucide-react"

type DayPlan = {
  id: string
  date: Date
  notes: string
}

type TimeDigit = {
  current: string
  next: string
  flipped: boolean
}

export default function TripCountdown() {
  const [tripName, setTripName] = useState<string>("Summer Vacation in Bali")
  const [departureDate, setDepartureDate] = useState<Date>(addDays(new Date(), 45))
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 59))
  const [daysLeft, setDaysLeft] = useState<number>(0)
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null)
  const [editingNotes, setEditingNotes] = useState<string>("")
  
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

        <Card>
          <CardHeader>
            <CardTitle>Daily Planner</CardTitle>
            <CardDescription>Plan activities for each day of your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dayPlans.map((day) => (
                <Button
                  key={day.id}
                  variant={selectedDay?.id === day.id ? "default" : "outline"}
                  className="flex-shrink-0"
                  onClick={() => selectDay(day)}
                >
                  Day {getDayNumber(day.date)}
                </Button>
              ))}
            </div>

            {selectedDay && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Day {getDayNumber(selectedDay.date)} - {format(selectedDay.date, "EEEE")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{format(selectedDay.date, "MMMM d, yyyy")}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={saveNotes}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Notes & Activities
                  </label>
                  <Textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="What are your plans for this day?"
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
