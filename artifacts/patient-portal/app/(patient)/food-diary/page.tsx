'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Circle, Save, UtensilsCrossed, Send } from 'lucide-react'

const LOCATIONS = [
  { value: 'at_home', label: 'At Home' },
  { value: 'restaurant', label: 'Restaurant/Caf\u00e9' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'at_desk', label: 'At Desk' },
  { value: 'other', label: 'Other' },
]

interface MealData {
  time: string
  food: string
  amount: string
  location: string
}

interface DayData {
  meals: Record<string, MealData>
  skippedSnacks: Record<string, boolean>
  drinks: string
  symptoms: string
  completed: boolean
}

function getStartDate() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1)
  return d
}

function formatDayLabel(dayIndex: number) {
  const start = getStartDate()
  const date = new Date(start)
  date.setDate(start.getDate() + dayIndex)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  return `Day ${dayIndex + 1} \u2014 ${weekday} ${day} ${month}`
}

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', skippable: false },
  { key: 'snack_1', label: 'Morning Snack', skippable: true },
  { key: 'lunch', label: 'Lunch', skippable: false },
  { key: 'snack_2', label: 'Afternoon Snack', skippable: true },
  { key: 'dinner', label: 'Dinner', skippable: false },
  { key: 'snack_3', label: 'Evening Snack', skippable: true },
]

const emptyMeal = (): MealData => ({ time: '', food: '', amount: '', location: '' })

const emptyDay = (): DayData => ({
  meals: Object.fromEntries(MEAL_SLOTS.map(s => [s.key, emptyMeal()])),
  skippedSnacks: {},
  drinks: '',
  symptoms: '',
  completed: false,
})

export default function FoodDiaryPage() {
  const [activeDay, setActiveDay] = useState(0)
  const [days, setDays] = useState<DayData[]>(Array.from({ length: 7 }, () => emptyDay()))
  const [savedField, setSavedField] = useState(false)
  const [allSubmitted, setAllSubmitted] = useState(false)

  const completedCount = days.filter(d => d.completed).length

  function handleFieldBlur() {
    setSavedField(true)
    setTimeout(() => setSavedField(false), 1500)
  }

  function updateMeal(dayIdx: number, mealKey: string, field: keyof MealData, value: string) {
    setDays(prev => {
      const next = [...prev]
      next[dayIdx] = {
        ...next[dayIdx],
        meals: {
          ...next[dayIdx].meals,
          [mealKey]: { ...next[dayIdx].meals[mealKey], [field]: value },
        },
      }
      return next
    })
  }

  function toggleSkip(dayIdx: number, mealKey: string) {
    setDays(prev => {
      const next = [...prev]
      next[dayIdx] = {
        ...next[dayIdx],
        skippedSnacks: {
          ...next[dayIdx].skippedSnacks,
          [mealKey]: !next[dayIdx].skippedSnacks[mealKey],
        },
      }
      return next
    })
  }

  function markComplete(dayIdx: number) {
    setDays(prev => {
      const next = [...prev]
      next[dayIdx] = { ...next[dayIdx], completed: !next[dayIdx].completed }
      return next
    })
  }

  if (allSubmitted) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-heading mb-6">7-Day Food Diary</h1>
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-forest-500" />
            </div>
            <h3 className="text-lg font-semibold font-heading mb-2">Food Diary Submitted!</h3>
            <p className="text-cream-700 text-sm max-w-md mx-auto mb-6">
              Your 7-day food diary has been sent to Dr Sarah. She will review it before your next consultation.
            </p>
            <Button variant="secondary" onClick={() => setAllSubmitted(false)}>View Diary</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const day = days[activeDay]

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-2">7-Day Food Diary</h1>
      <p className="text-sm text-cream-700 mb-6">
        Record your meals, drinks, and symptoms for 7 consecutive days. Be honest — don&apos;t change your diet for the diary! Dr Sarah will review this before your consultation.
      </p>

      {savedField && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <Save className="h-3.5 w-3.5" /> Saved
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
        {Array.from({ length: 7 }, (_, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeDay === i
                ? 'bg-forest-700 text-white'
                : 'bg-cream-300 text-cream-800 hover:bg-cream-400'
            }`}
          >
            {days[i].completed ? (
              <CheckCircle2 className="h-4 w-4 text-forest-300" />
            ) : (
              <Circle className="h-4 w-4 opacity-40" />
            )}
            Day {i + 1}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-cream-600">{formatDayLabel(activeDay)}</p>
        <Badge variant={completedCount === 7 ? 'success' : 'outline'}>
          {completedCount} of 7 days completed
        </Badge>
      </div>

      <div className="mb-4">
        <div className="h-1.5 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {MEAL_SLOTS.map((slot) => {
          const isSkipped = day.skippedSnacks[slot.key]

          if (slot.skippable && isSkipped) {
            return (
              <div
                key={slot.key}
                className="border border-cream-300 rounded-2xl p-4 bg-cream-100 flex items-center justify-between"
              >
                <span className="text-sm text-cream-600">No {slot.label.toLowerCase()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSkip(activeDay, slot.key)}
                >
                  Add {slot.label}
                </Button>
              </div>
            )
          }

          return (
            <Card key={slot.key} className="border-l-4 border-l-forest-500">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-forest-500" />
                    <h3 className="font-semibold text-sm">{slot.label}</h3>
                  </div>
                  {slot.skippable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => toggleSkip(activeDay, slot.key)}
                    >
                      No snack
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Time</Label>
                    <Input
                      type="time"
                      value={day.meals[slot.key]?.time || ''}
                      onChange={(e) => updateMeal(activeDay, slot.key, 'time', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">What did you eat?</Label>
                    <Input
                      placeholder="e.g. Porridge with berries"
                      value={day.meals[slot.key]?.food || ''}
                      onChange={(e) => updateMeal(activeDay, slot.key, 'food', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Approximate amount</Label>
                    <Input
                      placeholder="e.g. 1 bowl, 1 cup"
                      value={day.meals[slot.key]?.amount || ''}
                      onChange={(e) => updateMeal(activeDay, slot.key, 'amount', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Location</Label>
                    <Select
                      value={day.meals[slot.key]?.location || ''}
                      onValueChange={(v) => updateMeal(activeDay, slot.key, 'location', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Where?" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map(loc => (
                          <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <Card>
          <CardContent className="pt-5">
            <h3 className="font-semibold text-sm mb-3">Additional Drinks</h3>
            <Textarea
              placeholder="List any additional drinks throughout the day (water, tea, coffee, juice, alcohol, etc.) with approximate quantities"
              rows={3}
              value={day.drinks}
              onChange={(e) => {
                setDays(prev => {
                  const next = [...prev]
                  next[activeDay] = { ...next[activeDay], drinks: e.target.value }
                  return next
                })
              }}
              onBlur={handleFieldBlur}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <h3 className="font-semibold text-sm mb-3">Symptoms</h3>
            <Textarea
              placeholder="Note any symptoms you experienced today — digestive issues, energy levels, mood, headaches, sleep quality, etc. Brief notes are fine."
              rows={3}
              value={day.symptoms}
              onChange={(e) => {
                setDays(prev => {
                  const next = [...prev]
                  next[activeDay] = { ...next[activeDay], symptoms: e.target.value }
                  return next
                })
              }}
              onBlur={handleFieldBlur}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant={day.completed ? 'secondary' : 'default'}
            onClick={() => markComplete(activeDay)}
          >
            {day.completed ? 'Unmark Day' : `Mark Day ${activeDay + 1} as Complete`}
          </Button>

          {completedCount === 7 && (
            <Button variant="accent" onClick={() => setAllSubmitted(true)} className="gap-2">
              <Send className="h-4 w-4" /> Submit to Dr Sarah
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
