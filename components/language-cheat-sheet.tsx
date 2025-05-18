"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Globe, MessageSquare, Search, VolumeX, Volume2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
  it: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Ciao", 
      pronunciation: "chow",
      example: "Ciao, come stai?" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "Arrivederci", 
      pronunciation: "ah-ree-veh-dehr-chee",
      example: "Arrivederci, a presto!" 
    },
    { category: "greetings", english: "Thank you", translation: "Grazie", pronunciation: "grah-tsee-eh" },
    { category: "greetings", english: "Please", translation: "Per favore", pronunciation: "pehr fah-voh-reh" },
    { category: "greetings", english: "Excuse me", translation: "Scusi", pronunciation: "skoo-zee" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "Il conto, per favore",
      pronunciation: "eel kon-toh pehr fah-voh-reh",
    },
    { category: "dining", english: "I would like...", translation: "Vorrei...", pronunciation: "vohr-ray" },
    { category: "dining", english: "Delicious!", translation: "Delizioso!", pronunciation: "deh-lee-tsyoh-soh" },
    { category: "transportation", english: "Where is...?", translation: "Dov'è...?", pronunciation: "doh-veh" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "Quanto costa?",
      pronunciation: "kwan-toh kos-tah",
    },
    { category: "emergency", english: "Help!", translation: "Aiuto!", pronunciation: "ah-yoo-toh" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "Ho bisogno di un medico",
      pronunciation: "oh bee-zoh-nyoh dee oon meh-dee-koh",
    },
  ],
  de: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Hallo", 
      pronunciation: "hah-loh",
      example: "Hallo, wie geht es dir?" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "Auf Wiedersehen", 
      pronunciation: "owf vee-der-zayn",
      example: "Auf Wiedersehen, bis bald!" 
    },
    { category: "greetings", english: "Thank you", translation: "Danke", pronunciation: "dahn-kuh" },
    { category: "greetings", english: "Please", translation: "Bitte", pronunciation: "bit-tuh" },
    { category: "greetings", english: "Excuse me", translation: "Entschuldigung", pronunciation: "ent-shool-dee-goong" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "Die Rechnung, bitte",
      pronunciation: "dee rech-noong bit-tuh",
    },
    { category: "dining", english: "I would like...", translation: "Ich möchte...", pronunciation: "ikh merkh-tuh" },
    { category: "dining", english: "Delicious!", translation: "Köstlich!", pronunciation: "kurst-likh" },
    { category: "transportation", english: "Where is...?", translation: "Wo ist...?", pronunciation: "voh ist" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "Wie viel kostet das?",
      pronunciation: "vee feel kos-tet das",
    },
    { category: "emergency", english: "Help!", translation: "Hilfe!", pronunciation: "hill-fuh" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "Ich brauche einen Arzt",
      pronunciation: "ikh brow-khuh eye-nen artst",
    },
  ],
  ja: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "こんにちは", 
      pronunciation: "kon-ni-chi-wa",
      example: "こんにちは、お元気ですか？" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "さようなら", 
      pronunciation: "sa-yo-na-ra",
      example: "さようなら、また会いましょう！" 
    },
    { category: "greetings", english: "Thank you", translation: "ありがとう", pronunciation: "a-ri-ga-to" },
    { category: "greetings", english: "Please", translation: "お願いします", pronunciation: "o-ne-gai-shi-mas" },
    { category: "greetings", english: "Excuse me", translation: "すみません", pronunciation: "su-mi-ma-sen" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "お会計お願いします",
      pronunciation: "o-kai-kei o-ne-gai-shi-mas",
    },
    { category: "dining", english: "I would like...", translation: "...をください", pronunciation: "o ku-da-sai" },
    { category: "dining", english: "Delicious!", translation: "おいしい！", pronunciation: "o-i-shi" },
    { category: "transportation", english: "Where is...?", translation: "...はどこですか？", pronunciation: "wa do-ko des-ka" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "いくらですか？",
      pronunciation: "i-ku-ra des-ka",
    },
    { category: "emergency", english: "Help!", translation: "助けて！", pronunciation: "ta-su-ke-te" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "医者が必要です",
      pronunciation: "i-sha ga hi-tsu-yo des",
    },
  ],
  zh: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "你好", 
      pronunciation: "nǐ hǎo",
      example: "你好，你好吗？" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "再见", 
      pronunciation: "zài jiàn",
      example: "再见，下次见！" 
    },
    { category: "greetings", english: "Thank you", translation: "谢谢", pronunciation: "xiè xiè" },
    { category: "greetings", english: "Please", translation: "请", pronunciation: "qǐng" },
    { category: "greetings", english: "Excuse me", translation: "对不起", pronunciation: "duì bù qǐ" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "请结账",
      pronunciation: "qǐng jié zhàng",
    },
    { category: "dining", english: "I would like...", translation: "我想要...", pronunciation: "wǒ xiǎng yào" },
    { category: "dining", english: "Delicious!", translation: "好吃！", pronunciation: "hǎo chī" },
    { category: "transportation", english: "Where is...?", translation: "...在哪里？", pronunciation: "zài nǎ lǐ" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "多少钱？",
      pronunciation: "duō shǎo qián",
    },
    { category: "emergency", english: "Help!", translation: "救命！", pronunciation: "jiù mìng" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "我需要医生",
      pronunciation: "wǒ xū yào yī shēng",
    },
  ],
  pt: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Olá", 
      pronunciation: "oh-lah",
      example: "Olá, como vai você?" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "Adeus", 
      pronunciation: "ah-deh-oosh",
      example: "Adeus, até logo!" 
    },
    { category: "greetings", english: "Thank you", translation: "Obrigado/a", pronunciation: "oh-bree-gah-doo/dah" },
    { category: "greetings", english: "Please", translation: "Por favor", pronunciation: "poor fah-vor" },
    { category: "greetings", english: "Excuse me", translation: "Com licença", pronunciation: "com lee-sen-sah" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "A conta, por favor",
      pronunciation: "ah kon-tah poor fah-vor",
    },
    { category: "dining", english: "I would like...", translation: "Eu gostaria...", pronunciation: "eh-oo gos-tah-ree-ah" },
    { category: "dining", english: "Delicious!", translation: "Delicioso!", pronunciation: "deh-lee-see-oh-zoo" },
    { category: "transportation", english: "Where is...?", translation: "Onde está...?", pronunciation: "on-jee es-tah" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "Quanto custa?",
      pronunciation: "kwan-too koos-tah",
    },
    { category: "emergency", english: "Help!", translation: "Socorro!", pronunciation: "so-ko-hoh" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "Preciso de um médico",
      pronunciation: "preh-see-zo jee oom meh-jee-koo",
    },
  ],
  ru: [
    { 
      category: "greetings", 
      english: "Hello", 
      translation: "Здравствуйте", 
      pronunciation: "zdrah-stvooy-tee",
      example: "Здравствуйте, как дела?" 
    },
    { 
      category: "greetings", 
      english: "Goodbye", 
      translation: "До свидания", 
      pronunciation: "do svee-dah-nee-ya",
      example: "До свидания, до встречи!" 
    },
    { category: "greetings", english: "Thank you", translation: "Спасибо", pronunciation: "spah-see-boh" },
    { category: "greetings", english: "Please", translation: "Пожалуйста", pronunciation: "pah-zhal-sta" },
    { category: "greetings", english: "Excuse me", translation: "Извините", pronunciation: "eez-vee-nee-tye" },
    {
      category: "dining",
      english: "The bill, please",
      translation: "Счёт, пожалуйста",
      pronunciation: "schyot, pah-zhal-sta",
    },
    { category: "dining", english: "I would like...", translation: "Я хотел бы...", pronunciation: "ya khah-tyel bee" },
    { category: "dining", english: "Delicious!", translation: "Вкусно!", pronunciation: "vkoos-nah" },
    { category: "transportation", english: "Where is...?", translation: "Где...?", pronunciation: "gdye" },
    {
      category: "transportation",
      english: "How much is it?",
      translation: "Сколько это стоит?",
      pronunciation: "skohl-kuh eh-tuh stoh-eet",
    },
    { category: "emergency", english: "Help!", translation: "Помогите!", pronunciation: "pah-mah-gee-tye" },
    {
      category: "emergency",
      english: "I need a doctor",
      translation: "Мне нужен врач",
      pronunciation: "mnye noo-zhen vratch",
    },
  ],
}

// Define travel type to category mapping
const travelTypeCategories: Record<TravelType, string[]> = {
  business: ["greetings", "transportation"],
  leisure: ["greetings", "dining", "transportation"],
  adventure: ["transportation", "emergency"],
  foodie: ["dining"],
  cultural: ["greetings"],
}

// Kategori renkleri için projenin tema renkleri ile uyum sağlayacak şekilde güncelleme
const categoryStyleMap = {
  "greetings": {
    bg: "bg-[#ecd8e1]", 
    text: "text-[#9e2761]", 
    border: "border-[#d6adbc]",
    icon: "👋"
  },
  "dining": {
    bg: "bg-[#f3e6bc]", 
    text: "text-[#8a6c00]", 
    border: "border-[#e1cc75]",
    icon: "🍽️"
  },
  "transportation": {
    bg: "bg-[#d6e2f5]", 
    text: "text-[#2c4e8a]", 
    border: "border-[#a8c0e9]",
    icon: "🚆"
  },
  "emergency": {
    bg: "bg-[#e5d8f0]", 
    text: "text-[#6a3494]", 
    border: "border-[#c9b0dd]",
    icon: "🆘"
  }
}

export default function LanguageCheatSheet() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr")
  const [selectedTravelType, setSelectedTravelType] = useState<TravelType>("leisure")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [expandedPhraseIndex, setExpandedPhraseIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [customPhrasebook, setCustomPhrasebook] = useState<Phrase[] | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const phrases = phrasesData[selectedLanguage] || []

  const filteredPhrases = phrases.filter((phrase) => {
    // Filter by travel type if not "all" categories
    if (activeCategory === "all" && selectedTravelType) {
      const relevantCategories = travelTypeCategories[selectedTravelType];
      if (!relevantCategories.includes(phrase.category)) {
        return false;
      }
    }
    
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

  // Generate custom phrasebook based on travel type
  const generateCustomPhrasebook = () => {
    setIsGenerating(true);
    
    // Simulate API call or processing time
    setTimeout(() => {
      const relevantCategories = travelTypeCategories[selectedTravelType];
      const customPhrases = phrases.filter(phrase => 
        relevantCategories.includes(phrase.category)
      );
      
      setCustomPhrasebook(customPhrases);
      setIsGenerating(false);
      
      // Show confirmation toast
      toast({
        title: "Custom Phrasebook Generated",
        description: `Created ${customPhrases.length} phrases for ${travelTypes[selectedTravelType]} travel`,
      });
      
      // Update to show filtered phrases matching the travel type
      setActiveCategory("all");
    }, 1000);
  }

  // Calculate random rotation for stamps (for visual effect)
  const getRandomRotation = () => Math.random() * 10 - 5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#9e2761]">Language Passport</h2>
        <p className="text-muted-foreground">Collect language stamps for your journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white dark:bg-slate-900 border-2 border-[#9e2761] rounded-lg overflow-hidden shadow-md">
          <CardHeader className="border-b-2 border-[#d6adbc] bg-[#f8eaf0] dark:bg-[#9e2761]/10 dark:border-[#9e2761]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-[#9e2761] flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language Passport
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px] border-[#d6adbc] bg-white/90">
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
                    className="pl-9 w-full md:w-[200px] border-[#d6adbc] bg-white/90"
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
                  className={`flex-shrink-0 ${
                    activeCategory === category
                      ? "bg-[#9e2761] hover:bg-[#8a224f] text-white"
                      : "border-[#d6adbc] text-[#9e2761] hover:bg-[#f8eaf0] hover:text-[#9e2761]"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="passport-pages min-h-[400px] p-4 bg-[#f8eaf0]/30 rounded-md border border-[#d6adbc] relative">
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
                            rounded-lg bg-white border-2 shadow-md
                            ${categoryStyleMap[phrase.category]?.bg || "bg-[#e0e0e0]"}
                            ${categoryStyleMap[phrase.category]?.border || "border-[#c5c5c5]"}
                          `}
                        >
                          <div className="stamp-interior flex flex-col items-center text-center p-3">
                            <div className="stamp-border flex items-center justify-center w-full">
                              <span className={`text-lg font-bold ${categoryStyleMap[phrase.category]?.text || "text-[#505050]"}`}>
                                {phrase.english}
                              </span>
                            </div>
                            <div className="stamp-icon text-2xl mt-1">
                              {categoryStyleMap[phrase.category]?.icon || "📝"}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Stamp Content */}
                      <AnimatePresence>
                        {expandedPhraseIndex === index && (
                          <motion.div 
                            className="expanded-content absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-slate-900 rounded-lg shadow-xl border-2 border-[#9e2761]"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <div className="p-4 bg-[#f8eaf0] dark:bg-[#9e2761]/10">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-[#9e2761]">{phrase.english}</h3>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => copyToClipboard(phrase.translation)}
                                      className="h-8 w-8 hover:bg-[#f8eaf0] hover:text-[#9e2761]"
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
                                      className="h-6 w-6 rounded-full hover:bg-[#f8eaf0]"
                                      onClick={() => playPronunciation(phrase.translation, selectedLanguage)}
                                    >
                                      <Volume2 className="h-3 w-3 text-[#9e2761]" />
                                    </Button>
                                  </div>
                                  {phrase.example && (
                                    <p className="text-sm italic border-t border-[#d6adbc] pt-2 mt-2">
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
                  <div className="text-center py-8 col-span-3">
                    <VolumeX className="h-12 w-12 mx-auto text-[#9e2761]/30 mb-4" />
                    <p className="text-[#9e2761]/50">No phrases found. Try adjusting your search.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t-2 border-[#d6adbc] bg-[#f8eaf0]/50 dark:bg-[#9e2761]/5 dark:border-[#9e2761]/30">
            <Button 
              variant="outline" 
              className="w-full gap-2 border-[#9e2761] text-[#9e2761] hover:bg-[#f8eaf0] hover:text-[#9e2761]"
            >
              <Download className="h-4 w-4" />
              Download Passport Pages
            </Button>
          </CardFooter>
        </Card>

        {/* Travel type card */}
        <Card className="bg-white dark:bg-slate-900 border-2 border-[#9e2761]">
          <CardHeader className="border-b border-[#d6adbc] bg-[#f8eaf0] dark:bg-[#9e2761]/10 dark:border-[#9e2761]/30">
            <CardTitle className="text-[#9e2761]">Travel Type</CardTitle>
            <CardDescription>Customize phrases for your trip</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Travel Type</label>
              <Select value={selectedTravelType} onValueChange={(value) => setSelectedTravelType(value as TravelType)}>
                <SelectTrigger className="border-[#d6adbc] bg-white/90">
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
              <h4 className="font-medium text-[#9e2761]">Recommended Categories</h4>

              <div className="space-y-2">
                {selectedTravelType === "business" && (
                  <>
                    <p className="text-sm">Focus on professional phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Meeting introductions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Business negotiations</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Formal dining etiquette</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "leisure" && (
                  <>
                    <p className="text-sm">Focus on casual phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Hotel check-in/out</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Ordering at restaurants</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Shopping and bargaining</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "adventure" && (
                  <>
                    <p className="text-sm">Focus on outdoor phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Asking for directions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Emergency situations</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Equipment rental</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "foodie" && (
                  <>
                    <p className="text-sm">Focus on culinary phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Ordering specialties</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Dietary restrictions</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Complimenting the chef</span>
                      </li>
                    </ul>
                  </>
                )}

                {selectedTravelType === "cultural" && (
                  <>
                    <p className="text-sm">Focus on cultural phrases for:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Museum and site visits</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Local customs and etiquette</span>
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-[#f8eaf0] rounded-lg border border-[#d6adbc]">
                        <MessageSquare className="h-4 w-4 text-[#9e2761]" />
                        <span>Asking about traditions</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#d6adbc] bg-[#f8eaf0]/50 dark:bg-[#9e2761]/5 dark:border-[#9e2761]/30">
            <Button 
              className="w-full gap-2 bg-[#9e2761] hover:bg-[#8a224f]"
              onClick={generateCustomPhrasebook}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating...
                </div>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Generate Custom Phrasebook
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {customPhrasebook && customPhrasebook.length > 0 && (
        <Card className="bg-white dark:bg-slate-900 border-2 border-[#9e2761]">
          <CardHeader className="border-b border-[#d6adbc] bg-[#f8eaf0] dark:bg-[#9e2761]/10 dark:border-[#9e2761]/30">
            <CardTitle className="text-[#9e2761]">
              Custom {travelTypes[selectedTravelType]} Phrasebook
            </CardTitle>
            <CardDescription>
              {customPhrasebook.length} essential phrases for your {travelTypes[selectedTravelType].toLowerCase()} trip
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {customPhrasebook.map((phrase, index) => (
                <div key={index} className={`p-3 rounded-lg border ${categoryStyleMap[phrase.category]?.border || "border-[#d6adbc]"} ${categoryStyleMap[phrase.category]?.bg || "bg-[#f8eaf0]/60"}`}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{phrase.english}</p>
                      <p className={`${categoryStyleMap[phrase.category]?.text || "text-[#9e2761]"} font-medium`}>{phrase.translation}</p>
                      <p className="text-xs text-gray-500">/{phrase.pronunciation}/</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-[#f8eaf0]"
                      onClick={() => playPronunciation(phrase.translation, selectedLanguage)}
                    >
                      <Volume2 className="h-4 w-4 text-[#9e2761]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#d6adbc] bg-[#f8eaf0]/50 dark:bg-[#9e2761]/5 dark:border-[#9e2761]/30">
            <Button 
              variant="outline" 
              className="w-full gap-2 border-[#9e2761] text-[#9e2761] hover:bg-[#f8eaf0]"
            >
              <Download className="h-4 w-4" />
              Download Custom Phrasebook
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
