"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CalendarDays, Clock, Plus, X, Sparkles } from "lucide-react"

// Types for our puzzle interface
type Activity = {
  id: string
  title: string
  duration: number // in minutes
  color: string
  icon?: string
  description?: string
}

type DaySchedule = {
  id: string
  date: string
  dayName: string
  activities: Activity[]
  maxCapacity: number // Maximum minutes per day
  currentCapacity: number // Current used minutes
}

// Sample data
const sampleActivities: Activity[] = [
  { 
    id: "act-1", 
    title: "Museum Visit", 
    duration: 120, 
    color: "bg-blue-100 border-blue-300",
    icon: "🏛️",
    description: "Visit the National Museum of Art"
  },
  { 
    id: "act-2", 
    title: "City Tour", 
    duration: 180, 
    color: "bg-green-100 border-green-300",
    icon: "🚶",
    description: "Walking tour of historic downtown"
  },
  { 
    id: "act-3", 
    title: "Lunch", 
    duration: 90, 
    color: "bg-yellow-100 border-yellow-300",
    icon: "🍽️",
    description: "Lunch at local restaurant" 
  },
  { 
    id: "act-4", 
    title: "Beach", 
    duration: 240, 
    color: "bg-cyan-100 border-cyan-300",
    icon: "🏖️",
    description: "Relaxing time at the beach" 
  },
  { 
    id: "act-5", 
    title: "Shopping", 
    duration: 120, 
    color: "bg-purple-100 border-purple-300",
    icon: "🛍️",
    description: "Shopping at local markets" 
  },
  { 
    id: "act-6", 
    title: "Dinner", 
    duration: 120, 
    color: "bg-red-100 border-red-300",
    icon: "🍷",
    description: "Dinner at recommended restaurant" 
  }
];

const initialDays: DaySchedule[] = [
  { 
    id: "day-1", 
    date: "2023-10-15", 
    dayName: "Monday",
    activities: [], 
    maxCapacity: 720, // 12 hours 
    currentCapacity: 0
  },
  { 
    id: "day-2", 
    date: "2023-10-16", 
    dayName: "Tuesday",
    activities: [], 
    maxCapacity: 720,
    currentCapacity: 0
  },
  { 
    id: "day-3", 
    date: "2023-10-17", 
    dayName: "Wednesday",
    activities: [], 
    maxCapacity: 720,
    currentCapacity: 0
  },
  { 
    id: "day-4", 
    date: "2023-10-18", 
    dayName: "Thursday",
    activities: [], 
    maxCapacity: 720,
    currentCapacity: 0
  },
];

export default function SchedulePuzzle() {
  const [days, setDays] = useState<DaySchedule[]>(initialDays);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>(sampleActivities);
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Moving from available activities to a day
    if (source.droppableId === 'available-activities' && destination.droppableId.startsWith('day-')) {
      const activityIndex = source.index;
      const activity = availableActivities[activityIndex];
      const dayId = destination.droppableId;
      
      // Find the day
      const dayIndex = days.findIndex(day => day.id === dayId);
      if (dayIndex === -1) return;
      
      const day = days[dayIndex];
      
      // Check if activity fits into the day's capacity
      if (day.currentCapacity + activity.duration > day.maxCapacity) {
        // Show some feedback that it doesn't fit
        return;
      }
      
      // Add activity to the day
      const updatedDay = {
        ...day,
        activities: [...day.activities, activity],
        currentCapacity: day.currentCapacity + activity.duration
      };
      
      // Check if this completes the day
      const wasJustCompleted = 
        updatedDay.currentCapacity >= updatedDay.maxCapacity * 0.9 && // 90% full is "complete"
        day.currentCapacity < day.maxCapacity * 0.9;
      
      if (wasJustCompleted) {
        setRecentlyCompleted(dayId);
        setTimeout(() => setRecentlyCompleted(null), 2000);
      }
      
      // Update days and remove from available activities
      const newDays = [...days];
      newDays[dayIndex] = updatedDay;
      setDays(newDays);
      
      const newAvailableActivities = availableActivities.filter((_, i) => i !== activityIndex);
      setAvailableActivities(newAvailableActivities);
    }
    
    // Moving from a day back to available activities
    if (source.droppableId.startsWith('day-') && destination.droppableId === 'available-activities') {
      const dayId = source.droppableId;
      const dayIndex = days.findIndex(day => day.id === dayId);
      if (dayIndex === -1) return;
      
      const day = days[dayIndex];
      const activityIndex = source.index;
      const activity = day.activities[activityIndex];
      
      // Remove activity from day
      const updatedDay = {
        ...day,
        activities: day.activities.filter((_, i) => i !== activityIndex),
        currentCapacity: day.currentCapacity - activity.duration
      };
      
      // Update days and add back to available activities
      const newDays = [...days];
      newDays[dayIndex] = updatedDay;
      setDays(newDays);
      
      setAvailableActivities([...availableActivities, activity]);
    }
  };

  // Format minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Itinerary Puzzle</h2>
        <p className="text-muted-foreground">
          Drag activities to create your perfect daily schedule
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {/* Available Activities */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <CardHeader className="bg-indigo-100/50 border-b border-indigo-200">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Plus className="h-5 w-5" />
                  Available Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Droppable droppableId="available-activities">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px] space-y-3"
                    >
                      {availableActivities.map((activity, index) => (
                        <Draggable
                          key={activity.id}
                          draggableId={activity.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`puzzle-piece relative ${activity.color} border-2 rounded-lg shadow-sm p-3 cursor-move hover:shadow-md transition-shadow`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{activity.icon}</span>
                                  <span className="font-medium">{activity.title}</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDuration(activity.duration)}</span>
                                </div>
                              </div>
                              {activity.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {activity.description}
                                </p>
                              )}
                              {/* Puzzle connectors for visual effect */}
                              <div className="absolute top-1/2 -right-2 w-3 h-8 transform -translate-y-1/2 bg-white border-2 border-l-0 rounded-r-full"></div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {availableActivities.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>All activities have been scheduled!</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>

          {/* Days as Puzzle Pieces */}
          <div className="lg:col-span-3 grid gap-4 md:grid-cols-2">
            {days.map((day) => (
              <Droppable key={day.id} droppableId={day.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="relative"
                  >
                    <motion.div
                      className={`puzzle-day relative bg-white border-2 ${
                        day.currentCapacity >= day.maxCapacity * 0.9
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      } rounded-xl overflow-hidden transition-all duration-300`}
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
                              ? "border-green-300 bg-green-100"
                              : "border-gray-200 bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-gray-600" />
                            <h3 className="font-bold">{day.dayName}</h3>
                          </div>
                          <div className="text-sm flex items-center gap-1">
                            <span className="text-muted-foreground">
                              {Math.floor((day.currentCapacity / day.maxCapacity) * 100)}% Filled
                            </span>
                            {day.currentCapacity >= day.maxCapacity * 0.9 && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              day.currentCapacity >= day.maxCapacity * 0.9
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${(day.currentCapacity / day.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Day Content - Activities */}
                      <div className="p-4 min-h-[200px] space-y-3">
                        {day.activities.map((activity, index) => (
                          <Draggable
                            key={activity.id}
                            draggableId={`${day.id}-${activity.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${activity.color} border-2 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{activity.icon}</span>
                                    <span className="font-medium">{activity.title}</span>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDuration(activity.duration)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {day.activities.length === 0 && (
                          <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground">
                            <p>Drag activities here</p>
                          </div>
                        )}
                      </div>

                      {/* Puzzle connectors */}
                      <div className="absolute -left-2 top-1/3 w-3 h-8 bg-white border-2 border-r-0 rounded-l-full"></div>
                      <div className="absolute -right-2 top-2/3 w-3 h-8 bg-white border-2 border-l-0 rounded-r-full"></div>
                                          
                      {/* Completion effect */}
                      <AnimatePresence>
                        {recentlyCompleted === day.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className="bg-white rounded-full p-4 shadow-lg"
                            >
                              <Sparkles className="h-12 w-12 text-yellow-500" />
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
        </div>
      </DragDropContext>
    </div>
  )
}
