import type { CalendarEvent } from '../types'

export const mockCalendarEvents: CalendarEvent[] = [
  // ── May 10 (this week) ──────────────────────────────
  { id: 'c1',  title: 'אימון כוח בוקר',          date: '2026-05-10', startTime: '07:00', endTime: '08:30', category: 'health' },
  { id: 'c2',  title: 'פגישת אסטרטגיה – שירה מזרחי', date: '2026-05-10', startTime: '15:00', endTime: '16:00', category: 'client',
    zoomLink: 'https://zoom.us/j/12345678', description: 'דיון על חזרה לפעילות ביוני' },
  // ── May 12 ───────────────────────────────────────────
  { id: 'c3',  title: 'יוגה',                     date: '2026-05-12', startTime: '08:00', endTime: '09:00', category: 'health' },
  { id: 'c4',  title: 'סיעור מוחות – תוכן יוני',  date: '2026-05-12', startTime: '11:00', endTime: '12:30', category: 'project',
    description: 'תכנון תוכן לחודש יוני עבור כלל הלקוחות' },
  // ── May 14 ───────────────────────────────────────────
  { id: 'c5',  title: 'שיחת אסטרטגיה – מיה לוי',  date: '2026-05-14', startTime: '09:00', endTime: '10:00', category: 'client',
    zoomLink: 'https://zoom.us/j/87654321', description: 'תכנון קמפיין TikTok לקיץ' },
  { id: 'c6',  title: 'פילטס',                    date: '2026-05-14', startTime: '17:30', endTime: '18:30', category: 'health' },
  // ── May 16 (today) ───────────────────────────────────
  { id: 'c7',  title: 'יוגה בוקר',                date: '2026-05-16', startTime: '08:00', endTime: '09:00', category: 'health' },
  { id: 'c8',  title: 'פגישת לקוח – נועה כהן',    date: '2026-05-16', startTime: '14:00', endTime: '15:00', category: 'client',
    zoomLink: 'https://zoom.us/j/11223344', description: 'סקירת תסריטים לקולקציית קיץ' },
  { id: 'c9',  title: 'ארוחת ערב עם ספי',         date: '2026-05-16', startTime: '19:30', endTime: '21:00', category: 'personal' },
  // ── May 17 ───────────────────────────────────────────
  { id: 'c10', title: 'צילום תוכן – Instagram',    date: '2026-05-17', startTime: '10:00', endTime: '13:00', category: 'client',
    location: 'הוד השרון – סטודיו לייט' },
  // ── May 18 ───────────────────────────────────────────
  { id: 'c11', title: 'רופא – בדיקה שנתית',       date: '2026-05-18', startTime: '11:00', endTime: '12:00', category: 'health',
    location: 'קופת חולים מכבי – רמת גן' },
  { id: 'c12', title: 'עדכון תוכנית שיווק Q3',    date: '2026-05-18', startTime: '14:00', endTime: '15:30', category: 'project' },
  // ── May 19 ───────────────────────────────────────────
  { id: 'c13', title: 'שיחת Zoom – רותם אבני',    date: '2026-05-19', startTime: '10:00', endTime: '11:00', category: 'client',
    zoomLink: 'https://zoom.us/j/55667788', description: 'קייטרינג – פרסום קיץ' },
  // ── May 20 ───────────────────────────────────────────
  { id: 'c14', title: 'ריצה בפארק',               date: '2026-05-20', startTime: '07:00', endTime: '08:00', category: 'health' },
  // ── May 21 ───────────────────────────────────────────
  { id: 'c15', title: 'תכנון פרויקט – Studio Flow', date: '2026-05-21', startTime: '09:00', endTime: '10:30', category: 'project' },
  { id: 'c16', title: 'ספא עם אמא 💆',            date: '2026-05-21', startTime: '13:00', endTime: '16:00', category: 'personal' },
  // ── May 22 (יום הולדת אמא) ───────────────────────────
  { id: 'c17', title: '🎂 יום הולדת לאמא',         date: '2026-05-22', startTime: '00:00', endTime: '00:00', category: 'personal', allDay: true },
  { id: 'c18', title: 'ארוחת ערב משפחתית',         date: '2026-05-22', startTime: '19:00', endTime: '22:00', category: 'personal' },
  // ── May 23 ───────────────────────────────────────────
  { id: 'c19', title: 'הגשת דוח חודשי – מאי',     date: '2026-05-23', startTime: '12:00', endTime: '13:00', category: 'project' },
  // ── May 24 ───────────────────────────────────────────
  { id: 'c20', title: 'פילטס',                    date: '2026-05-24', startTime: '09:00', endTime: '10:00', category: 'health' },
  // ── May 26 ───────────────────────────────────────────
  { id: 'c21', title: 'פגישת Zoom – רותם אבני',   date: '2026-05-26', startTime: '14:00', endTime: '15:00', category: 'client',
    zoomLink: 'https://zoom.us/j/99887766' },
  // ── May 27 ───────────────────────────────────────────
  { id: 'c22', title: 'סקירת יעדים אישיים',        date: '2026-05-27', startTime: '10:00', endTime: '11:00', category: 'personal',
    description: 'סקירת יעדים חודשיים ורבעוניים' },
  // ── May 28 ───────────────────────────────────────────
  { id: 'c23', title: 'צהריים עם שרה',            date: '2026-05-28', startTime: '13:00', endTime: '14:30', category: 'personal' },
]
