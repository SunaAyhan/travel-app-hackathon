"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Backpack, Briefcase, Shirt, Umbrella, Utensils, Plus, X } from "lucide-react"

type Category = "essentials" | "clothing" | "toiletries" | "electronics" | "misc"

type Item = {
  id: string
  name: string
  packed: boolean
  category: Category
}

type FlyingItem = {
  id: string
  name: string
  startPosition: { x: number; y: number }
}

const categoryIcons = {
  essentials: <Backpack className="h-5 w-5" />,
  clothing: <Shirt className="h-5 w-5" />,
  toiletries: <Umbrella className="h-5 w-5" />,
  electronics: <Briefcase className="h-5 w-5" />,
  misc: <Utensils className="h-5 w-5" />,
}

const categoryColors = {
  essentials: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  clothing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  toiletries: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  electronics: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  misc: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
}

export default function PackingChecklist() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Passport", packed: false, category: "essentials" },
    { id: "2", name: "Phone charger", packed: false, category: "electronics" },
    { id: "3", name: "T-shirts", packed: false, category: "clothing" },
    { id: "4", name: "Toothbrush", packed: false, category: "toiletries" },
    { id: "5", name: "Camera", packed: false, category: "electronics" },
    { id: "6", name: "Sunglasses", packed: false, category: "misc" },
    { id: "7", name: "Medications", packed: false, category: "essentials" },
    { id: "8", name: "Travel insurance", packed: false, category: "essentials" },
    { id: "9", name: "Swimwear", packed: false, category: "clothing" },
    { id: "10", name: "Headphones", packed: false, category: "electronics" },
  ])

  const [newItem, setNewItem] = useState("")
  const [newCategory, setNewCategory] = useState<Category>("essentials")
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all")
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([])

  const bagRef = useRef<HTMLDivElement>(null)

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItem,
          packed: false,
          category: newCategory,
        },
      ])
      setNewItem("")
    }
  }

  const toggleItem = (id: string, element: HTMLElement | null = null) => {
    const item = items.find(i => i.id === id)
    if (item && !item.packed && element) {
      const rect = element.getBoundingClientRect()
      const startPosition = { x: rect.left, y: rect.top }
  
      const flyId = `flying-${id}-${Date.now()}`      // tek sefer üret
      setFlyingItems(prev => [
        ...prev,
        { id: flyId, name: item.name, startPosition }
      ])
  
      /* animasyon süresiyle senkron */
      setTimeout(() => {
        setFlyingItems(prev => prev.filter(i => i.id !== flyId))
      }, 1400)                                        // 1.4 sn
    }
  
    setItems(items.map(i =>
      i.id === id ? { ...i, packed: !i.packed } : i
    ))
  }
  

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory)

  const packedCount = items.filter((item) => item.packed).length
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Packing Checklist</h2>
          <p className="text-muted-foreground">Keep track of everything you need for your trip</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              activeCategory === "all" ? "bg-[#9e2761] text-white" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            All
          </motion.button>

          {(Object.keys(categoryIcons) as Category[]).map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`p-1.5 rounded-full ${
                activeCategory === category ? "bg-[#9e2761] text-white" : "text-slate-600 dark:text-slate-300"
              }`}
              title={category.charAt(0).toUpperCase() + category.slice(1)}
            >
              {categoryIcons[category]}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              Packing Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-[#9e2761] dark:text-indigo-400">
              {packedCount}/{items.length} items packed
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-200 dark:bg-indigo-900/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#9e2761]"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add new item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="bg-white dark:bg-slate-800"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as Category)}
          className="px-3 py-2 rounded-md border border-input bg-white dark:bg-slate-800 text-sm"
        >
          {(Object.keys(categoryIcons) as Category[]).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <Button onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Card
                className={`overflow-hidden transition-all duration-300 ${
                  item.packed
                    ? "bg-slate-50 dark:bg-slate-800/50 border-green-200 dark:border-green-900"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.packed}
                        onCheckedChange={() => toggleItem(item.id, document.getElementById(`item-${item.id}`))}
                        className={item.packed ? "border-green-500 data-[state=checked]:bg-green-500" : ""}
                        id={`item-${item.id}`}
                      />
                      <span className={`${item.packed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${categoryColors[item.category]} flex items-center gap-1`}>
                        {categoryIcons[item.category]}
                        <span className="hidden sm:inline">{item.category}</span>
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items in this category. Add some items to get started!</p>
        </div>
      )}

      {/* Briefcase icon that receives packed items */}
      <div className="fixed bottom-10 right-10 z-50" ref={bagRef}>
        <div className="relative">
          <div className="bg-[#9e2761] text-white p-6 rounded-lg shadow-lg flex items-center justify-center">
            <Briefcase className="h-14 w-14" />
          </div>
          <div className="absolute -top-3 -right-3 bg-[#9e2761] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white dark:border-slate-800">
            {packedCount}
          </div>
        </div>
      </div>

      {/* Flying items animation */}
      <AnimatePresence>
  {flyingItems.map((item) => (
    <motion.div
      key={item.id}
      initial={{
        position: "fixed",
        zIndex: 100,
        top: item.startPosition.y,
        left: item.startPosition.x,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        top: bagRef.current
          ? bagRef.current.getBoundingClientRect().top + 60
          : window.innerHeight - 60,
        left: bagRef.current
          ? bagRef.current.getBoundingClientRect().left + 60
          : window.innerWidth - 60,
        opacity: 0,
        scale: 0.5,
      }}
      exit={{ opacity: 0 }}
      /** ⬇️ Daha yavaş & smooth */
      transition={{
        type: "tween",
        duration: 1.4,          // 0.8 → 1.4 sn
        ease: "easeInOut",      // klasik ease-in-out eğrisi
      }}
      className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 shadow-md pointer-events-none"
    >
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
    </div>
  )
}
