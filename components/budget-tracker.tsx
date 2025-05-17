"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Plus, Trash2 } from "lucide-react"

type ExpenseCategory = "accommodation" | "food" | "transportation" | "activities" | "shopping" | "other"

type Expense = {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  date: string
}

const categoryIcons = {
  accommodation: "🏨",
  food: "🍔",
  transportation: "🚕",
  activities: "🎭",
  shopping: "🛍️",
  other: "📦",
}

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", description: "Hotel booking", amount: 750, category: "accommodation", date: "2023-06-10" },
    { id: "2", description: "Flight tickets", amount: 450, category: "transportation", date: "2023-06-10" },
    { id: "3", description: "Restaurant dinner", amount: 85, category: "food", date: "2023-06-12" },
    { id: "4", description: "Museum tickets", amount: 40, category: "activities", date: "2023-06-13" },
    { id: "5", description: "Souvenir shopping", amount: 65, category: "shopping", date: "2023-06-14" },
  ])

  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    description: "",
    amount: 0,
    category: "other",
    date: new Date().toISOString().split("T")[0],
  })

  const [budget, setBudget] = useState<number>(2000)
  const [activeTab, setActiveTab] = useState<"expenses" | "summary">("expenses")

  const addExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      setExpenses([
        ...expenses,
        {
          id: Date.now().toString(),
          ...newExpense,
        },
      ])

      setNewExpense({
        description: "",
        amount: 0,
        category: "other",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = budget - totalExpenses
  const budgetPercentage = (totalExpenses / budget) * 100

  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Budget Tracker</h2>
        <p className="text-muted-foreground">Keep track of your travel expenses</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Trip Budget</CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-24 h-8"
                />
              </div>
            </div>
            <CardDescription>Track your expenses against your budget</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "expenses" | "summary")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="expenses" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount || ""}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                      className="w-24"
                    />
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value as ExpenseCategory })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(categoryIcons) as ExpenseCategory[]).map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <span>{categoryIcons[category]}</span>
                              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-32"
                    />
                    <Button onClick={addExpense}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {expenses.map((expense) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{categoryIcons[expense.category]}</div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-xs text-muted-foreground">{expense.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold">${expense.amount.toFixed(2)}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExpense(expense.id)}
                              className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {expenses.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No expenses yet. Add some to get started!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="pt-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Budget Usage</span>
                      <span>
                        ${totalExpenses.toFixed(2)} / ${budget.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${
                          budgetPercentage > 90 ? "bg-red-500" : budgetPercentage > 70 ? "bg-amber-500" : "bg-green-500"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {budgetPercentage > 100 ? "Over budget!" : `${(100 - budgetPercentage).toFixed(0)}% remaining`}
                      </span>
                      <span className={`font-medium ${remainingBudget < 0 ? "text-red-500" : "text-green-500"}`}>
                        ${remainingBudget.toFixed(2)} left
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Expenses by Category</h4>
                    <div className="space-y-3">
                      {(Object.keys(categoryIcons) as ExpenseCategory[]).map((category) => {
                        const amount = expensesByCategory[category] || 0
                        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0

                        return (
                          <div key={category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{categoryIcons[category]}</span>
                                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                              </div>
                              <span>
                                ${amount.toFixed(2)} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-indigo-500"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>Your financial overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold">${budget.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-xl font-bold">${totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{budgetPercentage.toFixed(0)}% of budget</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-xl font-bold ${remainingBudget < 0 ? "text-red-500" : "text-green-500"}`}>
                  ${remainingBudget.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{(100 - budgetPercentage).toFixed(0)}% of budget</p>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-medium text-sm mb-3">Top Expenses</h4>
              <div className="space-y-2">
                {expenses
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <span>{categoryIcons[expense.category]}</span>
                        <span className="font-medium text-sm">{expense.description}</span>
                      </div>
                      <span className="font-bold">${expense.amount.toFixed(2)}</span>
                    </div>
                  ))}

                {expenses.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-2">No expenses yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
