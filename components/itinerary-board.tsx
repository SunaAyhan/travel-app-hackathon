"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Check, Plus, Sparkles } from "lucide-react"

type ItineraryItem = {
  id: string
  time: string
  activity: string
  location: string
  notes: string
  category: "sightseeing" | "food" | "transportation" | "accommodation" | "other"
  duration: number // Added duration in minutes
}

type DayPlan = {
  id: string
  date: string
  items: ItineraryItem[]
  maxCapacity: number // Maximum minutes in a day
  currentCapacity: number // Current used minutes
}

// Renk şemasını projede kullanılan ana renge göre güncelliyoruz
const categoryColors = {
  sightseeing: "bg-[#ecd8e1] text-[#9e2761] border-[#d6adbc] dark:bg-[#9e2761]/20 dark:text-[#f5d0de]",
  food: "bg-[#f3e6bc] text-[#8a6c00] border-[#e1cc75] dark:bg-[#8a6c00]/20 dark:text-[#f3e6bc]",
  transportation: "bg-[#d6e2f5] text-[#2c4e8a] border-[#a8c0e9] dark:bg-[#2c4e8a]/20 dark:text-[#d6e2f5]",
  accommodation: "bg-[#e5d8f0] text-[#6a3494] border-[#c9b0dd] dark:bg-[#6a3494]/20 dark:text-[#e5d8f0]",
  other: "bg-[#e0e0e0] text-[#505050] border-[#c5c5c5] dark:bg-[#505050]/20 dark:text-[#e0e0e0]",
}

// Duration estimate based on category (in minutes)
const categoryDurations = {
  sightseeing: 120, // 2 hours
  food: 90, // 1.5 hours
  transportation: 60, // 1 hour
  accommodation: 30, // 30 minutes
  other: 60, // 1 hour
}

const initialDays: DayPlan[] = [
  {
    id: "day-1",
    date: "June 10, 2023",
    maxCapacity: 720, // 12 hours
    currentCapacity: 390, // Initial calculated capacity
    items: [
      {
        id: "item-1-1",
        time: "09:00",
        activity: "Breakfast at hotel",
        location: "Hotel restaurant",
        notes: "Continental breakfast included with stay",
        category: "food",
        duration: 60, // 1 hour
      },
      {
        id: "item-1-2",
        time: "10:30",
        activity: "Visit Eiffel Tower",
        location: "Champ de Mars, 5 Avenue Anatole France",
        notes: "Pre-booked tickets for observation deck",
        category: "sightseeing",
        duration: 120, // 2 hours
      },
      {
        id: "item-1-3",
        time: "13:00",
        activity: "Lunch at Le Jules Verne",
        location: "Eiffel Tower, 2nd floor",
        notes: "Reservation under Smith",
        category: "food",
        duration: 90, // 1.5 hours
      },
      {
        id: "item-1-4",
        time: "15:30",
        activity: "Seine River Cruise",
        location: "Bateaux Parisiens, Port de la Bourdonnais",
        notes: "1-hour cruise, bring camera",
        category: "sightseeing",
        duration: 60, // 1 hour
      },
      {
        id: "item-1-5",
        time: "19:00",
        activity: "Dinner at Le Comptoir",
        location: "9 Carrefour de l'Odéon",
        notes: "Famous for traditional French cuisine",
        category: "food",
        duration: 90, // 1.5 hours
      },
    ],
  },
  {
    id: "day-2",
    date: "June 11, 2023",
    maxCapacity: 720, // 12 hours
    currentCapacity: 510, // Initial calculated capacity
    items: [
      {
        id: "item-2-1",
        time: "08:30",
        activity: "Breakfast at local café",
        location: "Café de Flore",
        notes: "Try the croissants",
        category: "food",
        duration: 60, // 1 hour
      },
      {
        id: "item-2-2",
        time: "10:00",
        activity: "Louvre Museum",
        location: "Rue de Rivoli",
        notes: "Focus on Mona Lisa and Venus de Milo",
        category: "sightseeing",
        duration: 180, // 3 hours
      },
      {
        id: "item-2-3",
        time: "14:00",
        activity: "Lunch in Le Marais",
        location: "L'As du Fallafel",
        notes: "Famous street food",
        category: "food",
        duration: 90, // 1.5 hours
      },
      {
        id: "item-2-4",
        time: "16:00",
        activity: "Shopping at Galeries Lafayette",
        location: "40 Boulevard Haussmann",
        notes: "Souvenir shopping",
        category: "other",
        duration: 120, // 2 hours
      },
      {
        id: "item-2-5",
        time: "20:00",
        activity: "Dinner and show at Moulin Rouge",
        location: "82 Boulevard de Clichy",
        notes: "Dress code: Smart casual",
        category: "other",
        duration: 180, // 3 hours
      },
    ],
  },
]

export default function ItineraryBoard() {
  const [days, setDays] = useState<DayPlan[]>(initialDays)
  const [newItemDay, setNewItemDay] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Omit<ItineraryItem, "id" | "duration">>({
    time: "",
    activity: "",
    location: "",
    notes: "",
    category: "other",
  })
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null);

  // Format minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    const sourceDay = days.find((day) => day.id === source.droppableId)
    const destDay = days.find((day) => day.id === destination.droppableId)

    if (!sourceDay || !destDay) {
      return
    }

    // Same day, reordering
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceDay.items)
      const [removed] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, removed)

      const newDays = days.map((day) => (day.id === source.droppableId ? { ...day, items: newItems } : day))
      setDays(newDays)
    } else {
      // Moving between days
      const sourceItems = Array.from(sourceDay.items)
      const destItems = Array.from(destDay.items)
      const [removed] = sourceItems.splice(source.index, 1)
      
      // Update capacity for source day
      const newSourceCapacity = sourceDay.currentCapacity - removed.duration;
      
      // Check if item fits in destination day
      const newDestCapacity = destDay.currentCapacity + removed.duration;
      if (newDestCapacity > destDay.maxCapacity) {
        // Show some feedback that it doesn't fit
        return;
      }
      
      destItems.splice(destination.index, 0, removed)

      const newDays = days.map((day) => {
        if (day.id === source.droppableId) {
          return { ...day, items: sourceItems, currentCapacity: newSourceCapacity }
        }
        if (day.id === destination.droppableId) {
          // Check if this completes the day
          const wasJustCompleted = 
            newDestCapacity >= destDay.maxCapacity * 0.9 && // 90% full is "complete"
            destDay.currentCapacity < destDay.maxCapacity * 0.9;
          
          if (wasJustCompleted) {
            setRecentlyCompleted(destDay.id);
            setTimeout(() => setRecentlyCompleted(null), 2000);
          }
          
          return { ...day, items: destItems, currentCapacity: newDestCapacity }
        }
        return day
      })

      setDays(newDays)
    }
  }

  const addNewItem = () => {
    // Reset validation error
    setValidationError(null);

    // Validate required fields
    if (!newItem.activity) {
      setValidationError("Please enter an activity name");
      return;
    }

    if (!newItem.time) {
      setValidationError("Please enter a time");
      return;
    }

    if (!newItemDay) {
      setValidationError("No day selected");
      return;
    }

    const day = days.find(d => d.id === newItemDay);
    
    if (!day) {
      setValidationError("Selected day not found");
      return;
    }

    // Calculate duration based on category
    const duration = categoryDurations[newItem.category];
    
    // Check if the new item would exceed the day's capacity
    if (day.currentCapacity + duration > day.maxCapacity) {
      setValidationError(`This activity would exceed the day's capacity. Remaining: ${formatDuration(day.maxCapacity - day.currentCapacity)}`);
      return;
    }
    
    const newItemWithId: ItineraryItem = {
      id: `item-${Date.now()}`,
      ...newItem,
      duration,
    }

    const newCapacity = day.currentCapacity + duration;
    const wasJustCompleted = 
      newCapacity >= day.maxCapacity * 0.9 && 
      day.currentCapacity < day.maxCapacity * 0.9;
    
    if (wasJustCompleted) {
      setRecentlyCompleted(day.id);
      setTimeout(() => setRecentlyCompleted(null), 2000);
    }

    console.log("Adding new item:", newItemWithId);

    // Update days state with the new item
    const updatedDays = days.map((d) =>
      d.id === newItemDay ? { 
        ...d, 
        items: [...d.items, newItemWithId],
        currentCapacity: newCapacity,
      } : d,
    );

    setDays(updatedDays);
    
    // Reset form
    setNewItem({
      time: "",
      activity: "",
      location: "",
      notes: "",
      category: "other",
    });
    
    // Close modal
    setNewItemDay(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#9e2761]">Itinerary Puzzle</h2>
        <p className="text-muted-foreground">Drag activities to complete your perfect daily schedule</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6 md:grid-cols-2">
          {days.map((day) => (
            <Droppable key={day.id} droppableId={day.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="relative"
                >
                  <motion.div
                    className={`puzzle-day relative bg-white dark:bg-slate-900 border-2 ${
                      day.currentCapacity >= day.maxCapacity * 0.9
                        ? "border-[#9e2761] bg-[#f8eaf0] dark:bg-[#9e2761]/10"
                        : "border-gray-300 dark:border-gray-700"
                    } rounded-xl overflow-hidden transition-all duration-300 shadow-md`}
                    animate={{
                      scale: recentlyCompleted === day.id ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Day Header */}
                    <div 
                      className={`
                        p-3 border-b-2 ${
                          day.currentCapacity >= day.maxCapacity * 0.9
                            ? "border-[#d6adbc] bg-[#f8eaf0] dark:border-[#9e2761]/50 dark:bg-[#9e2761]/20"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-800/70"
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#9e2761]" />
                            <h3 className="font-bold">Day {days.findIndex((d) => d.id === day.id) + 1}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{day.date}</p>
                        </div>
                        <div className="text-sm flex items-center gap-1">
                          <span className="text-muted-foreground">
                            {Math.floor((day.currentCapacity / day.maxCapacity) * 100)}% Filled
                          </span>
                          {day.currentCapacity >= day.maxCapacity * 0.9 && (
                            <Check className="h-4 w-4 text-[#9e2761]" />
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            day.currentCapacity >= day.maxCapacity * 0.9
                              ? "bg-[#9e2761]"
                              : "bg-[#c77a9e]"
                          }`}
                          style={{ width: `${(day.currentCapacity / day.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Day Content - Activities */}
                    <div className="p-4 min-h-[300px] space-y-3">
                      {day.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`puzzle-piece relative ${categoryColors[item.category]} border-2 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? "shadow-lg ring-2 ring-[#9e2761]/30" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                  <div className="text-lg font-medium w-16">{item.time}</div>
                                  <div>
                                    <h4 className="font-medium">{item.activity}</h4>
                                    <p className="text-sm text-muted-foreground">{item.location}</p>
                                    {item.notes && (
                                      <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-1 whitespace-nowrap">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDuration(item.duration)}</span>
                                </div>
                              </div>
                              
                              {/* Puzzle konektörleri - görsel efekt */}
                              <div className="absolute top-1/2 -left-2 w-3 h-8 transform -translate-y-1/2 bg-white dark:bg-slate-900 border-2 border-r-0 rounded-l-full"></div>
                              
                              {/* Yeni konektör ekleniyor - sağ */}
                              <div className="absolute top-1/2 -right-2 w-3 h-8 transform -translate-y-1/2 bg-white dark:bg-slate-900 border-2 border-l-0 rounded-r-full"></div>
                              
                              {/* Yeni konektör ekleniyor - üst */}
                              {index === 0 && (
                                <div className="absolute -top-2 left-1/4 w-8 h-4 bg-white dark:bg-slate-900 border-2 border-b-0 rounded-t-full"></div>
                              )}
                              
                              {/* Yeni konektör ekleniyor - alt */}
                              {index === day.items.length - 1 && (
                                <div className="absolute -bottom-2 right-1/4 w-8 h-4 bg-white dark:bg-slate-900 border-2 border-t-0 rounded-b-full"></div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {day.items.length === 0 && (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-[#d6adbc] dark:border-[#9e2761]/40 rounded-lg text-muted-foreground">
                          <p>Drag activities here</p>
                        </div>
                      )}
                    </div>

                    {/* Puzzle konektörleri */}
                    <div className="absolute -right-2 top-1/3 w-3 h-8 transform -translate-y-1/2 bg-white dark:bg-slate-900 border-2 border-l-0 rounded-r-full"></div>
                    <div className="absolute -left-2 top-2/3 w-3 h-8 transform -translate-y-1/2 bg-white dark:bg-slate-900 border-2 border-r-0 rounded-l-full"></div>
                    
                    {/* Yeni üst konektör */}
                    <div className="absolute top-0 left-1/3 w-10 h-5 bg-white dark:bg-slate-900 border-2 border-b-0 rounded-t-full -translate-y-1/2"></div>
                    
                    {/* Yeni alt konektör */}
                    <div className="absolute bottom-0 right-1/3 w-10 h-5 bg-white dark:bg-slate-900 border-2 border-t-0 rounded-b-full translate-y-1/2"></div>
                    
                    {/* Button to add new activity */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/70">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2 border-[#9e2761] text-[#9e2761] hover:bg-[#f8eaf0] hover:text-[#9e2761]"
                        onClick={() => setNewItemDay(day.id)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Activity
                      </Button>
                    </div>
                    
                    {/* Completion effect */}
                    <AnimatePresence>
                      {recentlyCompleted === day.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#9e2761]/20 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="bg-white dark:bg-slate-800 rounded-full p-4 shadow-lg"
                          >
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ repeat: 1, duration: 0.6 }}
                            >
                              <Sparkles className="h-12 w-12 text-[#9e2761]" />
                            </motion.div>
                          </motion.div>
                          
                          {/* Konfeti efekti */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            {Array.from({ length: 20 }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ 
                                  x: 0, 
                                  y: 0,
                                  opacity: 1 
                                }}
                                animate={{ 
                                  x: Math.random() * 300 - 150, 
                                  y: Math.random() * 300 - 150,
                                  opacity: 0,
                                  rotate: Math.random() * 360
                                }}
                                transition={{ duration: 1.5, delay: Math.random() * 0.2 }}
                                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm"
                                style={{ 
                                  backgroundColor: ['#9e2761', '#c77a9e', '#8a6c00', '#2c4e8a', '#6a3494'][Math.floor(Math.random() * 5)]
                                }}
                              />
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {newItemDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setNewItemDay(null)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="border-b border-[#ecd8e1] bg-[#f8eaf0] dark:bg-[#9e2761]/10 dark:border-[#9e2761]/20">
              <CardTitle className="text-[#9e2761]">Add New Activity</CardTitle>
              <CardDescription>
                Day {days.findIndex((d) => d.id === newItemDay) + 1} - {days.find((d) => d.id === newItemDay)?.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity</label>
                <Input
                  value={newItem.activity}
                  onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                  placeholder="What are you planning to do?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="Where is this activity?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Any additional details?"
                  rows={3}
                />
              </div>
              
              <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#9e2761]" />
                <span>Estimated time: {formatDuration(categoryDurations[newItem.category])}</span>
              </div>
              
              {days.find(d => d.id === newItemDay) && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#9e2761]" />
                  <span>
                    Remaining day capacity: {formatDuration(
                      days.find(d => d.id === newItemDay)!.maxCapacity - 
                      days.find(d => d.id === newItemDay)!.currentCapacity
                    )}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[#ecd8e1] dark:border-[#9e2761]/20 pt-4">
              <Button variant="outline" onClick={() => setNewItemDay(null)}>
                Cancel
              </Button>
              <Button 
                onClick={addNewItem}
                className="bg-[#9e2761] hover:bg-[#9e2761]/90"
              >
                Add to Itinerary
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
