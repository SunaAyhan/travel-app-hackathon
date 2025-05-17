"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight, RefreshCw, TrendingUp } from "lucide-react"

type Currency = {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 150.27 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rate: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rate: 1.37 },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", rate: 0.9 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 7.24 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 83.12 },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽", rate: 16.82 },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [recentRates, setRecentRates] = useState<{ [key: string]: number[] }>({
    EUR: [0.91, 0.92, 0.93, 0.92, 0.92, 0.91, 0.92],
    GBP: [0.78, 0.79, 0.8, 0.79, 0.78, 0.79, 0.79],
    JPY: [149.5, 150.1, 151.2, 150.8, 150.3, 149.9, 150.27],
  })

  const convert = () => {
    setIsConverting(true)

    // Simulate API call
    setTimeout(() => {
      const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1
      const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1
      const result = (Number.parseFloat(amount) / fromRate) * toRate
      setConvertedAmount(result)
      setIsConverting(false)
    }, 500)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  useEffect(() => {
    convert()
  }, [fromCurrency, toCurrency])

  const getFromCurrencySymbol = () => currencies.find((c) => c.code === fromCurrency)?.symbol || "$"
  const getToCurrencySymbol = () => currencies.find((c) => c.code === toCurrency)?.symbol || "€"
  const getFromCurrencyFlag = () => currencies.find((c) => c.code === fromCurrency)?.flag || "🏳️"
  const getToCurrencyFlag = () => currencies.find((c) => c.code === toCurrency)?.flag || "🏳️"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Currency Converter</h2>
        <p className="text-muted-foreground">Convert between different currencies for your trip</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Currency</CardTitle>
            <CardDescription>Get real-time exchange rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">{getFromCurrencySymbol()}</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    if (e.target.value) convert()
                  }}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>
                            {currency.code} - {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="icon" onClick={swapCurrencies} className="mt-6">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>
                            {currency.code} - {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <div className="w-full p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {getFromCurrencyFlag()} {amount} {fromCurrency}
                </div>
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {getToCurrencyFlag()} {convertedAmount.toFixed(2)} {toCurrency}
                </div>
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-2xl font-bold">
                  {getToCurrencySymbol()} {isConverting ? "..." : convertedAmount.toFixed(2)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  1 {fromCurrency} = {(currencies.find((c) => c.code === toCurrency)?.rate || 1).toFixed(4)}{" "}
                  {toCurrency}
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={convert}>
              <RefreshCw className={`h-4 w-4 ${isConverting ? "animate-spin" : ""}`} />
              Refresh Rates
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Rate Trends</CardTitle>
            <CardDescription>7-day historical data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>USD to {toCurrency}</span>
                <span className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  0.3%
                </span>
              </div>

              <div className="h-24 flex items-end gap-1">
                {recentRates[toCurrency]?.map((rate, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(rate / Math.max(...recentRates[toCurrency])) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex-1 bg-[#9e2761] dark:bg-[#9e2761] rounded-t-sm"
                  />
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium">Popular Conversions</h4>

              {currencies.slice(1, 5).map((currency) => {
                const fromRate = currencies.find((c) => c.code === "USD")?.rate || 1
                const toRate = currency.rate
                const convertedValue = (100 / fromRate) * toRate

                return (
                  <div key={currency.code} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currency.flag}</span>
                      <div>
                        <p className="font-medium">{currency.code}</p>
                        <p className="text-xs text-muted-foreground">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {currency.symbol} {convertedValue.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">per $100</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
