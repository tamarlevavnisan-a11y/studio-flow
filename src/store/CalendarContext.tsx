import { createContext, useContext, useState, ReactNode } from 'react'
import type { CalendarEvent } from '../types'
import { mockCalendarEvents } from '../data/calendarMockData'

interface CalendarContextType {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  getEventsForDate: (date: string) => CalendarEvent[]
}

const CalendarContext = createContext<CalendarContextType | null>(null)

let nextId = 200

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents)

  const ctx: CalendarContextType = {
    events,

    addEvent: (event) => {
      setEvents(es => [...es, { ...event, id: `c${++nextId}` }])
    },

    updateEvent: (id, updates) => {
      setEvents(es => es.map(e => e.id === id ? { ...e, ...updates } : e))
    },

    deleteEvent: (id) => {
      setEvents(es => es.filter(e => e.id !== id))
    },

    getEventsForDate: (date) => events.filter(e => e.date === date),
  }

  return <CalendarContext.Provider value={ctx}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider')
  return ctx
}
