"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Globe, MessageSquare, Search, VolumeX, Volume2 } from "lucide-react"

type TravelType = "business" | "leisure" | "adventure" | "foodie" | "cultural"

type Language = {
  code: string
  name: string
  flag: string
}

type Phrase = {
  category: string
  english: string
  translation: string
  pronunciation: string
  example?: string
}

const languages: Language[] = [
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
]

const travelTypes: Record<TravelType, string> = {
  business: "Business",
  leisure: "Leisure",
  adventure: "Adventure",
  foodie: "Food & Dining",
  cultural: "Cultural",
}

// Add example sentences to the phrases
const phrasesData: Record<string, Phrase[]> = {
  fr: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Bonjour", 
      pronunciation: "bohn-zhoor",
      example: "Bonjour, comment allez-vous?" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "Au revoir", 
      pronunciation: "oh ruh-vwahr",
      example: "Au revoir, à bientôt!" 
    },
    { category: "greetings", english: "Thank you", translation: "Merci", pronunciation: "mehr-see" },
    { category: "greetings", english: "Please", translation: "S'il vous plaît", pronunciation: "seel voo pleh" },
    { category: "greetings", english: "Excuse me", translation: "Excusez-moi", pronunciation: "ex-koo-zay mwah" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "L'addition, s'il vous plaît",
      pronunciation: "lah-dee-see-ohn seel voo pleh",
    },
    { category: "dining", english: "I would like...", translation: "Je voudrais...", pronunciation: "zhuh voo-dreh" },
    { category: "dining", english: "Delicious!", translation: "Délicieux!", pronunciation: "day-lee-syuh" },
    { category: "transportation", english: "Where is...?", translation: "Où est...?", pronunciation: "oo eh" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "Combien ça coûte?",
      pronunciation: "kohm-bee-ehn sah koot",
    },
    { category: "emergency", english: "Help!", translation: "Au secours!", pronunciation: "oh suh-koor" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "J'ai besoin d'un médecin",
      pronunciation: "zhay buh-zwahn dun may-duh-san",
    },
  ],
  es: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Hola", 
      pronunciation: "oh-lah",
      example: "¡Hola! ¿Cómo estás?"
    },
    { category: "greetings", english: "Goodbye", translation: "Adiós", pronunciation: "ah-dee-ohs" },
    { category: "greetings", english: "Thank you", translation: "Gracias", pronunciation: "grah-see-ahs" },
    { category: "greetings", english: "Please", translation: "Por favor", pronunciation: "por fah-vor" },
    { category: "greetings", english: "Excuse me", translation: "Disculpe", pronunciation: "dees-kool-peh" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "La cuenta, por favor",
      pronunciation: "lah kwen-tah por fah-vor",
    },
    { category: "dining", english: "I would like...", translation: "Quisiera...", pronunciation: "kee-see-eh-rah" },
    { category: "dining", english: "Delicious!", translation: "¡Delicioso!", pronunciation: "deh-lee-see-oh-soh" },
    {
      category: "transportation",
      english: "Where is...?",
      translation: "¿Dónde está...?",
      pronunciation: "don-deh es-tah",
    },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "¿Cuánto cuesta?",
      pronunciation: "kwan-toh kwes-tah",
    },
    { category: "emergency", english: "Help!", translation: "¡Ayuda!", pronunciation: "ah-yoo-dah" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "Necesito un médico",
      pronunciation: "neh-seh-see-toh oon meh-dee-koh",
    },
  ],
}

export default function LanguageCheatSheet() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr")
  const [selectedTravelType, setSelectedTravelType] = useState<TravelType>("leisure")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [expandedPhraseIndex, setExpandedPhraseIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const phrases = phrasesData[selectedLanguage] || []

  const filteredPhrases = phrases.filter((phrase) => {
    // Filter by category
    if (activeCategory !== "all" && phrase.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return phrase.english.toLowerCase().includes(query) || phrase.translation.toLowerCase().includes(query)
    }

    return true
  })

  // Get unique categories
  const categories = ["all", ...new Set(phrases.map((phrase) => phrase.category))]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleExpand = (index: number) => {
    if (expandedPhraseIndex === index) {
      setExpandedPhraseIndex(null)
    } else {
      setExpandedPhraseIndex(index)
    }
  }

  // Simulated function for speech synthesis
  const playPronunciation = (text: string, language: string) => {
    // In a real app, you would integrate with a text-to-speech API
    // For now, we'll just use browser's built-in speech synthesis if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'es-ES';
      speechSynthesis.speak(utterance);
    }
  }

  // Calculate random rotation for stamps (for visual effect)
  const getRandomRotation = () => Math.random() * 10 - 5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Language Passport</h2>
        <p className="text-muted-foreground">Collect language stamps for your journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-[#f5f3e8] border-4 border-[#9e2761] rounded-lg overflow-hidden">
          <CardHeader className="border-b-2 border-[#9e2761]/30 bg-[#9e2761]/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-[#9e2761] flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Passport
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px] border-[#9e2761]/30 bg-white/80">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center gap-2">
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search phrases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full md:w-[200px] border-[#9e2761]/30 bg-white/80"
                  />
                </div>
              </div>
            </div>
            <CardDescription className="text-[#9e2761]/80">
              {languages.find((l) => l.code === selectedLanguage)?.flag}{" "}
              {languages.find((l) => l.code === selectedLanguage)?.name} phrases for your trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="flex-shrink-0 bg-[#9e2761] text-white hover:bg-[#8a224f]"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="passport-pages min-h-[400px] p-4 bg-[url('/passport-bg.png')] bg-repeat bg-contain relative">
              {/* Decorative passport watermarks */}
              <div className="absolute inset-0 bg-[url('/passport-watermark.png')] bg-no-repeat bg-center opacity-5 pointer-events-none"></div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {filteredPhrases.map((phrase, index) => (
                  <div key={index} className="perspective-500">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: expandedPhraseIndex === index ? 1.05 : 1,
                        zIndex: expandedPhraseIndex === index ? 10 : 1,
                      }}
                      className="relative"
                    >
                      {/* Passport Stamp */}
                      <motion.div
                        className={`passport-stamp cursor-pointer ${
                          expandedPhraseIndex === index ? "z-20" : "z-10"
                        }`}
                        onClick={() => toggleExpand(index)}
                        style={{ rotate: getRandomRotation() }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div 
                          className={`
                            rounded-lg bg-white border-2 border-[#9e2761]/50 p-4 shadow-md
                            ${phrase.category === "greetings" ? "bg-red-100" : ""}
                            ${phrase.category === "dining" ? "bg-green-100" : ""}
                            ${phrase.category === "transportation" ? "bg-yellow-100" : ""}
                            ${phrase.category === "emergency" ? "bg-orange-100" : ""}
                          `}
                        >
                          <div className="stamp-interior flex flex-col items-center text-center">
                            <div className="stamp-border flex items-center justify-center w-full">
                              <span className="text-xl font-bold text-[#9e2761]">{phrase.english}</span>
                            </div>
                            <div className="stamp-icon text-2xl">
                              {phrase.category === "greetings" && "👋"}
                              {phrase.category === "dining" && "🍽️"}
                              {phrase.category === "transportation" && "🚆"}
                              {phrase.category === "emergency" && "🆘"}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Stamp Content */}
                      <AnimatePresence>
                        {expandedPhraseIndex === index && (
                          <motion.div 
                            className="expanded-content absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-lg shadow-xl border-2 border-[#9e2761]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="p-4 bg-[#9e2761]/10">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-[#9e2761]">{phrase.english}</h3>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => copyToClipboard(phrase.translation)}
                                      className="h-8 w-8"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-xl text-[#9e2761] font-medium">{phrase.translation}</p>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>/{phrase.pronunciation}/</span>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => playPronunciation(phrase.translation, selectedLanguage)}
                                    >
                                      <Volume2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {phrase.example && (
                                    <p className="text-sm italic border-t border-[#9e2761]/20 pt-2 mt-2">
                                      "{phrase.example}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ))}

                {filteredPhrases.length === 0 && (
                  <div className="text-center py-8">
                    <VolumeX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No phrases found. Try adjusting your search.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t-2 border-[#9e2761]/30">
            <Button variant="outline" className="w-full gap-2 border-[#9e2761]/30">
              <Download className="h-4 w-4" />
              Download Passport Pages
            </Button>
          </CardFooter>
        </Card>

        {/* Travel type card */}
        <Card className="bg-[#f5f3e8] border-2 border-[#9e2761]">
          <CardHeader className="border-b border-[#9e2761]/30 bg-[#9e2761]/10">
            <CardTitle className="text-[#9e2761]">Travel Type</CardTitle>
            <CardDescription>Customize phrases for your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Travel Type</label>
              <Select value={selectedTravelType} onValueChange={(value) => setSelectedTravelType(value as TravelType)}>
                <SelectTrigger className="border-[#9e2761]/30 bg-white/80">
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(travelTypes) as TravelType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {travelTypes[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="font-medium">Recommended Categories</h4>

              <div className="space-y-2">
                {selectedTravelType === "business" && (
                  <>
                    <p className="text-sm">Focus on professional phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Meeting introductions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Business negotiations</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Formal dining etiquette</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "leisure" && (
                  <>
                    <p className="text-sm">Focus on casual phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Hotel check-in/out</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Ordering at restaurants</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Shopping and bargaining</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "adventure" && (
                  <>
                    <p className="text-sm">Focus on outdoor phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Asking for directions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Emergency situations</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Equipment rental</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "foodie" && (
                  <>
                    <p className="text-sm">Focus on culinary phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Ordering specialties</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Dietary restrictions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Complimenting the chef</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "cultural" && (
                  <>
                    <p className="text-sm">Focus on cultural phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Museum and site visits</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Local customs and etiquette</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                        <span>Asking about traditions</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#9e2761]/30">
            <Button className="w-full gap-2 bg-[#9e2761] hover:bg-[#8a224f]">
              <Globe className="h-4 w-4" />
              Generate Custom Phrasebook
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
