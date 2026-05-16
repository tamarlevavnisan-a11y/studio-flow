import type { FoodItem } from '../types'

export const foodDatabase: FoodItem[] = [
  // 🍗 בשר ודגים
  { id: 'fd1',  name: 'שניצל עוף',              unitLabel: 'מנה (150g)',      calories: 310, protein: 28,  carbs: 15,   fat: 14  },
  { id: 'fd2',  name: 'חזה עוף מבושל',           unitLabel: '100g',           calories: 165, protein: 31,  carbs: 0,    fat: 3.6 },
  { id: 'fd3',  name: 'המבורגר בקר',             unitLabel: 'מנה (150g)',      calories: 355, protein: 25,  carbs: 0,    fat: 28  },
  { id: 'fd4',  name: 'סלמון צלוי',              unitLabel: '100g',           calories: 208, protein: 20,  carbs: 0,    fat: 13  },
  { id: 'fd5',  name: 'טונה בשמן (שימורים)',      unitLabel: '100g',           calories: 198, protein: 30,  carbs: 0,    fat: 9   },
  { id: 'fd6',  name: 'טונה במים',               unitLabel: '100g',           calories: 116, protein: 26,  carbs: 0,    fat: 1   },
  { id: 'fd7',  name: 'קציצות בשר',              unitLabel: 'קציצה (60g)',     calories: 165, protein: 12,  carbs: 6,    fat: 11  },
  { id: 'fd8',  name: 'כרעי עוף צלויות',          unitLabel: 'מנה (120g)',      calories: 240, protein: 22,  carbs: 0,    fat: 16  },
  { id: 'fd9',  name: 'אמנון צלוי',              unitLabel: '100g',           calories: 129, protein: 26,  carbs: 0,    fat: 3   },
  { id: 'fd10', name: 'נקניקיית עוף',             unitLabel: 'יחידה (50g)',     calories: 120, protein: 6,   carbs: 3,    fat: 9   },

  // 🥚 ביצים ומוצרי חלב
  { id: 'fd11', name: 'ביצה שלמה',               unitLabel: 'יחידה',          calories: 78,  protein: 6,   carbs: 0.6,  fat: 5   },
  { id: 'fd12', name: 'גבינה לבנה 5%',            unitLabel: '100g',           calories: 97,  protein: 11,  carbs: 3,    fat: 5   },
  { id: 'fd13', name: 'גבינה לבנה 9%',            unitLabel: '100g',           calories: 130, protein: 10,  carbs: 3,    fat: 9   },
  { id: 'fd14', name: 'גבינה צהובה',              unitLabel: 'פרוסה (25g)',     calories: 88,  protein: 5.5, carbs: 0.2,  fat: 7   },
  { id: 'fd15', name: "קוטג'",                    unitLabel: '100g',           calories: 103, protein: 12,  carbs: 3,    fat: 4.5 },
  { id: 'fd16', name: 'יוגורט 3%',               unitLabel: '100g',           calories: 62,  protein: 3.5, carbs: 4.7,  fat: 3   },
  { id: 'fd17', name: 'יוגורט 0%',               unitLabel: '100g',           calories: 35,  protein: 3.5, carbs: 4.7,  fat: 0.1 },
  { id: 'fd18', name: 'חלב 3%',                  unitLabel: 'כוס (240ml)',     calories: 148, protein: 8,   carbs: 11,   fat: 7   },
  { id: 'fd19', name: 'גבינת שמנת',              unitLabel: 'כפית (15g)',      calories: 51,  protein: 1,   carbs: 0.5,  fat: 5   },
  { id: 'fd20', name: 'מוצרלה',                  unitLabel: '30g',            calories: 80,  protein: 6,   carbs: 0.6,  fat: 6   },

  // 🍞 פחמימות ולחם
  { id: 'fd21', name: 'לחם לבן',                 unitLabel: 'פרוסה (30g)',     calories: 80,  protein: 2.7, carbs: 15,   fat: 1   },
  { id: 'fd22', name: 'לחם מלא',                 unitLabel: 'פרוסה (30g)',     calories: 70,  protein: 3,   carbs: 13,   fat: 1   },
  { id: 'fd23', name: 'פיתה לבנה',               unitLabel: 'יחידה (60g)',     calories: 165, protein: 5.5, carbs: 33,   fat: 0.7 },
  { id: 'fd24', name: 'פיתה מלאה',               unitLabel: 'יחידה (60g)',     calories: 155, protein: 6,   carbs: 30,   fat: 1.5 },
  { id: 'fd25', name: 'אורז לבן מבושל',           unitLabel: '100g',           calories: 130, protein: 2.7, carbs: 28,   fat: 0.3 },
  { id: 'fd26', name: 'אורז מלא מבושל',           unitLabel: '100g',           calories: 112, protein: 2.6, carbs: 23,   fat: 0.9 },
  { id: 'fd27', name: 'פסטה מבושלת',              unitLabel: '100g',           calories: 158, protein: 5.8, carbs: 31,   fat: 0.9 },
  { id: 'fd28', name: 'קינואה מבושלת',            unitLabel: '100g',           calories: 120, protein: 4.4, carbs: 21,   fat: 1.9 },
  { id: 'fd29', name: 'בטטה מבושלת',              unitLabel: '100g',           calories: 86,  protein: 1.6, carbs: 20,   fat: 0.1 },
  { id: 'fd30', name: 'תפוח אדמה מבושל',          unitLabel: '100g',           calories: 87,  protein: 1.9, carbs: 20,   fat: 0.1 },
  { id: 'fd31', name: 'קוסקוס מבושל',             unitLabel: '100g',           calories: 112, protein: 3.8, carbs: 23,   fat: 0.2 },
  { id: 'fd32', name: 'גרנולה',                  unitLabel: '30g',            calories: 130, protein: 3,   carbs: 20,   fat: 5   },
  { id: 'fd33', name: 'קורנפלקס',                unitLabel: '30g',            calories: 113, protein: 2,   carbs: 25,   fat: 0.2 },
  { id: 'fd34', name: 'בורגול מבושל',             unitLabel: '100g',           calories: 83,  protein: 3,   carbs: 19,   fat: 0.2 },

  // 🥦 ירקות וקטניות
  { id: 'fd35', name: 'חומוס',                   unitLabel: '100g',           calories: 166, protein: 9,   carbs: 27,   fat: 2.6 },
  { id: 'fd36', name: 'עדשים מבושלות',            unitLabel: '100g',           calories: 116, protein: 9,   carbs: 20,   fat: 0.4 },
  { id: 'fd37', name: 'שעועית מבושלת',            unitLabel: '100g',           calories: 127, protein: 8.7, carbs: 23,   fat: 0.5 },
  { id: 'fd38', name: 'ברוקולי מבושל',            unitLabel: '100g',           calories: 35,  protein: 2.4, carbs: 7,    fat: 0.4 },
  { id: 'fd39', name: 'גזר',                     unitLabel: '100g',           calories: 41,  protein: 0.9, carbs: 10,   fat: 0.2 },
  { id: 'fd40', name: 'עגבנייה',                 unitLabel: 'יחידה (120g)',    calories: 22,  protein: 1.1, carbs: 4.8,  fat: 0.2 },
  { id: 'fd41', name: 'מלפפון',                  unitLabel: 'יחידה (100g)',    calories: 15,  protein: 0.7, carbs: 3.6,  fat: 0.1 },
  { id: 'fd42', name: 'פלפל אדום',               unitLabel: 'יחידה (100g)',    calories: 31,  protein: 1,   carbs: 7.5,  fat: 0.3 },
  { id: 'fd43', name: 'תירס מבושל',              unitLabel: 'קלח (80g)',       calories: 88,  protein: 3.3, carbs: 19,   fat: 1.4 },
  { id: 'fd44', name: 'חסה',                     unitLabel: '100g',           calories: 15,  protein: 1.4, carbs: 2.9,  fat: 0.2 },
  { id: 'fd45', name: 'תרד מבושל',               unitLabel: '100g',           calories: 23,  protein: 2.9, carbs: 3.8,  fat: 0.3 },
  { id: 'fd46', name: 'קישוא מבושל',              unitLabel: '100g',           calories: 17,  protein: 1.1, carbs: 3.5,  fat: 0.2 },
  { id: 'fd47', name: 'כרובית מבושלת',            unitLabel: '100g',           calories: 23,  protein: 1.8, carbs: 4.9,  fat: 0.5 },

  // 🍎 פירות
  { id: 'fd48', name: 'תפוח',                    unitLabel: 'יחידה (182g)',    calories: 95,  protein: 0.5, carbs: 25,   fat: 0.3 },
  { id: 'fd49', name: 'בננה',                    unitLabel: 'יחידה (118g)',    calories: 105, protein: 1.3, carbs: 27,   fat: 0.4 },
  { id: 'fd50', name: 'תפוז',                    unitLabel: 'יחידה (131g)',    calories: 62,  protein: 1.2, carbs: 15,   fat: 0.2 },
  { id: 'fd51', name: 'ענבים',                   unitLabel: 'כוס (150g)',      calories: 104, protein: 1.1, carbs: 27,   fat: 0.2 },
  { id: 'fd52', name: 'אבטיח',                   unitLabel: '100g',           calories: 30,  protein: 0.6, carbs: 8,    fat: 0.2 },
  { id: 'fd53', name: 'מנגו',                    unitLabel: '100g',           calories: 60,  protein: 0.8, carbs: 15,   fat: 0.4 },
  { id: 'fd54', name: 'תות שדה',                 unitLabel: '100g',           calories: 32,  protein: 0.7, carbs: 7.7,  fat: 0.3 },
  { id: 'fd55', name: 'אפרסק',                   unitLabel: 'יחידה (100g)',    calories: 39,  protein: 0.9, carbs: 10,   fat: 0.3 },

  // 🥑 שומנים ואגוזים
  { id: 'fd56', name: 'אבוקדו',                  unitLabel: 'חצי (75g)',       calories: 120, protein: 1.5, carbs: 6.4,  fat: 11  },
  { id: 'fd57', name: 'שמן זית',                 unitLabel: 'כפית (5ml)',      calories: 40,  protein: 0,   carbs: 0,    fat: 4.5 },
  { id: 'fd58', name: 'חמאת בוטנים',             unitLabel: 'כפית (15g)',      calories: 88,  protein: 4,   carbs: 3,    fat: 7.5 },
  { id: 'fd59', name: 'אגוזי מלך',               unitLabel: 'קומץ (28g)',      calories: 185, protein: 4.3, carbs: 4,    fat: 18  },
  { id: 'fd60', name: 'שקדים',                   unitLabel: 'קומץ (28g)',      calories: 160, protein: 6,   carbs: 6,    fat: 14  },
  { id: 'fd61', name: 'טחינה גולמית',             unitLabel: 'כפית (15g)',      calories: 88,  protein: 2.6, carbs: 3,    fat: 8   },
  { id: 'fd62', name: 'גרעיני חמנייה',            unitLabel: 'כפית (15g)',      calories: 87,  protein: 3,   carbs: 3,    fat: 7.6 },

  // 🍫 חטיפים ומשקאות
  { id: 'fd63', name: 'שוקולד מריר 70%',          unitLabel: 'קוביות (20g)',    calories: 110, protein: 1.7, carbs: 8,    fat: 8   },
  { id: 'fd64', name: "עוגיית אוריאו",            unitLabel: 'יחידה (11g)',     calories: 53,  protein: 0.5, carbs: 7.5,  fat: 2.3 },
  { id: 'fd65', name: 'חטיף במבה',               unitLabel: "שקית (25g)",     calories: 134, protein: 3,   carbs: 11,   fat: 8.5 },
  { id: 'fd66', name: 'מיץ תפוזים טבעי',          unitLabel: 'כוס (240ml)',     calories: 110, protein: 1.7, carbs: 26,   fat: 0.5 },
  { id: 'fd67', name: 'קפה שחור',                unitLabel: 'כוס (240ml)',     calories: 2,   protein: 0.3, carbs: 0,    fat: 0   },
  { id: 'fd68', name: 'קפה עם חלב',              unitLabel: 'כוס (240ml)',     calories: 50,  protein: 2.5, carbs: 5,    fat: 2   },
]
