"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

type ItineraryItem = {
  id: string
  time: string
  activity: string
  location: string
  notes: string
  category: "sightseeing" | "food" | "transportation" | "accommodation" | "other"
}

type DayPlan = {
  id: string
  date: string
  items: ItineraryItem[]
}

const categoryColors = {
  sightseeing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  food: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  transportation: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  accommodation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  other: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
}

const initialDays: DayPlan[] = [
  {
    id: "day-1",
    date: "June 10, 2023",
    items: [
      {
        id: "item-1-1",
        time: "09:00",
        activity: "Breakfast at hotel",
        location: "Hotel restaurant",
        notes: "Continental breakfast included with stay",
        category: "food",
      },
      {
        id: "item-1-2",
        time: "10:30",
        activity: "Visit Eiffel Tower",
        location: "Champ de Mars, 5 Avenue Anatole France",
        notes: "Pre-booked tickets for observation deck",
        category: "sightseeing",
      },
      {
        id: "item-1-3",
        time: "13:00",
        activity: "Lunch at Le Jules Verne",
        location: "Eiffel Tower, 2nd floor",
        notes: "Reservation under Smith",
        category: "food",
      },
      {
        id: "item-1-4",
        time: "15:30",
        activity: "Seine River Cruise",
        location: "Bateaux Parisiens, Port de la Bourdonnais",
        notes: "1-hour cruise, bring camera",
        category: "sightseeing",
      },
      {
        id: "item-1-5",
        time: "19:00",
        activity: "Dinner at Le Comptoir",
        location: "9 Carrefour de l'Odéon",
        notes: "Famous for traditional French cuisine",
        category: "food",
      },
    ],
  },
  {
    id: "day-2",
    date: "June 11, 2023",
    items: [
      {
        id: "item-2-1",
        time: "08:30",
        activity: "Breakfast at local café",
        location: "Café de Flore",
        notes: "Try the croissants",
        category: "food",
      },
      {
        id: "item-2-2",
        time: "10:00",
        activity: "Louvre Museum",
        location: "Rue de Rivoli",
        notes: "Focus on Mona Lisa and Venus de Milo",
        category: "sightseeing",
      },
      {
        id: "item-2-3",
        time: "14:00",
        activity: "Lunch in Le Marais",
        location: "L'As du Fallafel",
        notes: "Famous street food",
        category: "food",
      },
      {
        id: "item-2-4",
        time: "16:00",
        activity: "Shopping at Galeries Lafayette",
        location: "40 Boulevard Haussmann",
        notes: "Souvenir shopping",
        category: "other",
      },
      {
        id: "item-2-5",
        time: "20:00",
        activity: "Dinner and show at Moulin Rouge",
        location: "82 Boulevard de Clichy",
        notes: "Dress code: Smart casual",
        category: "other",
      },
    ],
  },
]

export default function ItineraryBoard() {
  const [days, setDays] = useState<DayPlan[]>(initialDays)
  const [newItemDay, setNewItemDay] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Omit<ItineraryItem, "id">>({
    time: "",
    activity: "",
    location: "",
    notes: "",
    category: "other",
  })

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
      destItems.splice(destination.index, 0, removed)

      const newDays = days.map((day) => {
        if (day.id === source.droppableId) {
          return { ...day, items: sourceItems }
        }
        if (day.id === destination.droppableId) {
          return { ...day, items: destItems }
        }
        return day
      })

      setDays(newDays)
    }
  }

  const addNewItem = () => {
    if (!newItemDay || !newItem.activity || !newItem.time) return

    const newItemWithId: ItineraryItem = {
      id: `item-${Date.now()}`,
      ...newItem,
    }

    const updatedDays = days.map((day) =>
      day.id === newItemDay ? { ...day, items: [...day.items, newItemWithId] } : day,
    )

    setDays(updatedDays)
    setNewItem({
      time: "",
      activity: "",
      location: "",
      notes: "",
      category: "other",
    })
    setNewItemDay(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Interactive Itinerary</h2>
        <p className="text-muted-foreground">Plan and organize your daily activities</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6">
          {days.map((day) => (
            <Card key={day.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      Day {days.findIndex((d) => d.id === day.id) + 1}
                    </CardTitle>
                    <CardDescription>{day.date}</CardDescription>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setNewItemDay(day.id)}>
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={day.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[50px]">
                      {day.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`p-3 rounded-lg border ${
                                snapshot.isDragging ? "bg-muted shadow-lg" : "bg-card"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="text-lg font-medium w-16">{item.time}</div>
                                  <div>
                                    <h4 className="font-medium">{item.activity}</h4>
                                    <p className="text-sm text-muted-foreground">{item.location}</p>
                                  </div>
                                </div>
                                <Badge className={`${categoryColors[item.category]} self-start sm:self-auto`}>
                                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                </Badge>
                              </div>
                              {item.notes && (
                                <div className="mt-2 text-sm text-muted-foreground pl-[76px]">{item.notes}</div>
                              )}
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
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
            <CardHeader>
              <CardTitle>Add New Activity</CardTitle>
              <CardDescription>
                Day {days.findIndex((d) => d.id === newItemDay) + 1} - {days.find((d) => d.id === newItemDay)?.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setNewItemDay(null)}>
                Cancel
              </Button>
              <Button onClick={addNewItem}>Add to Itinerary</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
