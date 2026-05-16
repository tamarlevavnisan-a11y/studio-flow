import type { QuickEvent, ClientDetail, Task, Notification, HealthData } from '../types'

export const mockEvents: QuickEvent[] = [
  { id: '1', title: 'פגישת לקוח – נועה כהן', date: 'היום', time: '14:00', color: 'violet' },
  { id: '2', title: 'צילום תוכן לאינסטגרם', date: 'היום', time: '17:30', color: 'pink' },
  { id: '3', title: 'שיחת אסטרטגיה – TikTok', date: 'מחר', time: '10:00', color: 'emerald' },
  { id: '4', title: 'הגשת דוח חודשי', date: 'מחר', time: '12:00', color: 'orange' },
]

export const mockClientDetails: ClientDetail[] = [
  {
    id: '1',
    name: 'נועה כהן',
    platform: 'Instagram',
    status: 'pending',
    avatar: 'נ',
    email: 'noa@gmail.com',
    phone: '050-1234567',
    notes: 'מותג אופנה – סגנון בוהו שיק. מעדיפה תוכן אורגני ומינימליסטי.',
    createdAt: '2026-04-10',
    scripts: [
      {
        id: 's1', title: 'פוסט קולקציית קיץ', platform: 'Instagram', type: 'caption',
        status: 'ready', createdAt: '2026-05-10',
        content: '☀️ הקיץ הגיע ואיתו הקולקציה שכולכן חיכיתן לה\n\nשמלות קלות, צבעים חיים ותחושה של חופש – כל פריט מהקולקציה תוכנן במחשבה עליכן 🌸\n\nקישור בביו | משלוח חינם מעל 300₪'
      },
      {
        id: 's2', title: 'סטורי מכירה – שישי שחור', platform: 'Instagram', type: 'story',
        status: 'draft', createdAt: '2026-05-12',
        content: 'סלייד 1: "הכנו לכן סורפרייז 🖤"\nסלייד 2: "40% הנחה על כל הקולקציה"\nסלייד 3: "48 שעות בלבד – לחצו על הקישור"'
      },
      {
        id: 's3', title: 'תסריט ריל טרנד', platform: 'Instagram', type: 'script',
        status: 'sent', createdAt: '2026-05-08',
        content: '[0:00-0:03] ז\'ום-אין על הפריט\n[0:03-0:08] הופעה עם בגד + תנועה קצבית\n[0:08-0:15] תקריב ופרטים + טקסט "הפריט שחייבת בארון"'
      },
    ],
    videos: [
      { id: 'v1', title: 'ריל קולקציית קיץ', type: 'reel', status: 'editing', notes: 'טרנד הסיבוב – להוסיף מוזיקה של Doja Cat', duration: '0:15', createdAt: '2026-05-11' },
      { id: 'v2', title: 'Behind the scenes צילום', type: 'story', status: 'ready', notes: 'BTS מהצילום אצל הצלמת. נראה טוב!', duration: '0:30', createdAt: '2026-05-13' },
    ],
    files: [
      { id: 'f1', name: 'ברושור מותג 2026.pdf', fileType: 'pdf', size: '2.4 MB', uploadedAt: '2026-04-15' },
      { id: 'f2', name: 'לוגו נועה כהן.png', fileType: 'image', size: '340 KB', uploadedAt: '2026-04-15' },
    ],
    posts: [
      { id: 'p1', title: 'פוסט קולקציית קיץ', platform: 'Instagram', date: '2026-05-18', time: '09:00', status: 'ready', type: 'image' },
      { id: 'p2', title: 'ריל טרנד', platform: 'Instagram', date: '2026-05-21', time: '18:00', status: 'planned', type: 'reel' },
      { id: 'p3', title: 'סטורי מכירה', platform: 'Instagram', date: '2026-05-24', time: '12:00', status: 'planned', type: 'story' },
      { id: 'p4', title: 'BTS פוסט', platform: 'Instagram', date: '2026-05-14', time: '10:00', status: 'published', type: 'image' },
      { id: 'p5', title: 'ריל behind the scenes', platform: 'Instagram', date: '2026-05-28', time: '17:00', status: 'planned', type: 'reel' },
    ],
  },
  {
    id: '2',
    name: 'מיה לוי',
    platform: 'TikTok',
    status: 'active',
    avatar: 'מ',
    email: 'mia.levi@gmail.com',
    phone: '052-9876543',
    notes: 'קואצ\'ינג לנשים – תוכן מעצים ואותנטי. לייקים גבוהים על סרטוני שאלות-תשובות.',
    createdAt: '2026-03-20',
    scripts: [
      {
        id: 's1', title: 'תסריט "5 הרגלים של נשים מצליחות"', platform: 'TikTok', type: 'script',
        status: 'ready', createdAt: '2026-05-05',
        content: '[HOOK 0:00-0:03]: "5 הרגלים שמפרידים נשים מצליחות מכולן"\n[0:03-0:08]: הרגל 1 – קימה מוקדמת\n[0:08-0:13]: הרגל 2 – ג\'ורנלינג\n[0:13-0:18]: הרגל 3 – תנועה יומית\n[0:18-0:23]: הרגל 4 – לא לגלילה בבוקר\n[0:23-0:30]: הרגל 5 – כוונה יומית + CTA'
      },
      {
        id: 's2', title: 'קפשן – פוסט מוטיבציה שני', platform: 'TikTok', type: 'caption',
        status: 'draft', createdAt: '2026-05-14',
        content: 'הצלחה היא לא מזל. היא תוצאה של החלטות קטנות שאת עושה כל יום 💪\n\nאיזו החלטה קטנה תעשי היום?\n\n#קואצ\'ינג #נשיםמובילות #הצלחה'
      },
    ],
    videos: [
      { id: 'v1', title: '5 הרגלים של נשים מצליחות', type: 'tiktok', status: 'filming', notes: 'לצלם בחדר עם תאורה טובה. להלביש לבן.', duration: '0:30', createdAt: '2026-05-06' },
      { id: 'v2', title: 'Q&A – שאלות על קואצ\'ינג', type: 'tiktok', status: 'published', notes: 'יצא מעולה! 50K צפיות', duration: '1:00', createdAt: '2026-05-01' },
      { id: 'v3', title: 'Day in my life', type: 'tiktok', status: 'idea', notes: 'לעשות יום בחיי כקואצ\'ית – מהקימה עד השינה', createdAt: '2026-05-15' },
    ],
    files: [
      { id: 'f1', name: 'תוכנית תוכן מאי 2026.docx', fileType: 'doc', size: '128 KB', uploadedAt: '2026-05-01' },
    ],
    posts: [
      { id: 'p1', title: '5 הרגלים', platform: 'TikTok', date: '2026-05-16', time: '18:00', status: 'planned', type: 'video' },
      { id: 'p2', title: 'פוסט מוטיבציה', platform: 'TikTok', date: '2026-05-19', time: '12:00', status: 'planned', type: 'video' },
      { id: 'p3', title: 'Q&A פרק 2', platform: 'TikTok', date: '2026-05-23', time: '20:00', status: 'planned', type: 'video' },
      { id: 'p4', title: 'Q&A פרק 1', platform: 'TikTok', date: '2026-05-08', time: '18:00', status: 'published', type: 'video' },
    ],
  },
  {
    id: '3',
    name: 'רותם אבני',
    platform: 'Facebook',
    status: 'active',
    avatar: 'ר',
    email: 'rotem.avni@business.co.il',
    phone: '054-3344556',
    notes: 'עסק משפחתי – קייטרינג ואירועים. קהל יעד מבוגר יותר. מתמקד בפייסבוק ובוואטסאפ.',
    createdAt: '2026-02-01',
    scripts: [
      {
        id: 's1', title: 'פוסט חגיגת 10 שנים לעסק', platform: 'Facebook', type: 'caption',
        status: 'sent', createdAt: '2026-05-01',
        content: '10 שנים של אהבה, טעם וזכרות שלא נשכחות 🎊\n\nלפני עשור התחלנו מהמטבח הביתי עם חלום אחד – לגרום לכל ארוע להרגיש כמו משפחה.\n\nהיום אנחנו כאן, עם אלפי לקוחות מרוצים ואינספור רגעים שצלחנו יחד.\n\nתודה לכם על האמון ❤️'
      },
      {
        id: 's2', title: 'מבצע חודש יולי – קייטרינג קיצי', platform: 'Facebook', type: 'caption',
        status: 'draft', createdAt: '2026-05-13',
        content: '☀️ קיץ = אירועים!\n\nהזמינו קייטרינג קיצי לאירוע שלכם ותקבלו:\n✅ 10% הנחה על כל תפריט קיץ\n✅ שתייה קרה ללא עלות נוספת\n✅ עיצוב שולחן מתנה\n\nמהרו – ספירה לאחור לחופשה! 📞'
      },
    ],
    videos: [
      { id: 'v1', title: 'סרטון אירוע בת מצווה – יוני 2026', type: 'regular', status: 'editing', notes: 'חומר גולמי התקבל. עריכה אצל עדי.', duration: '3:00', createdAt: '2026-05-10' },
    ],
    files: [
      { id: 'f1', name: 'תפריט קייטרינג קיץ 2026.pdf', fileType: 'pdf', size: '1.8 MB', uploadedAt: '2026-04-20' },
      { id: 'f2', name: 'תמונות אירועים מאי.zip', fileType: 'other', size: '45 MB', uploadedAt: '2026-05-05' },
      { id: 'f3', name: 'חוזה שיתוף פעולה.pdf', fileType: 'pdf', size: '256 KB', uploadedAt: '2026-02-01' },
    ],
    posts: [
      { id: 'p1', title: '10 שנים לעסק', platform: 'Facebook', date: '2026-05-05', time: '10:00', status: 'published', type: 'image' },
      { id: 'p2', title: 'תפריט קיץ חדש', platform: 'Facebook', date: '2026-05-12', time: '11:00', status: 'published', type: 'image' },
      { id: 'p3', title: 'מבצע יולי', platform: 'Facebook', date: '2026-05-20', time: '09:00', status: 'ready', type: 'image' },
      { id: 'p4', title: 'סרטון בת מצווה', platform: 'Facebook', date: '2026-05-27', time: '18:00', status: 'planned', type: 'video' },
    ],
  },
  {
    id: '4',
    name: 'שירה מזרחי',
    platform: 'Instagram',
    status: 'paused',
    avatar: 'ש',
    email: 'shira.m@gmail.com',
    phone: '053-7788990',
    notes: 'מאמנת כושר – בהשהיה זמנית עד יוני. לחזור אליה בתחילת יוני לתכנון תוכן.',
    createdAt: '2026-01-15',
    scripts: [
      {
        id: 's1', title: 'פוסט חזרה לשגרה – יוני', platform: 'Instagram', type: 'caption',
        status: 'draft', createdAt: '2026-05-14',
        content: 'יוני הולך להיות חזק 💪\nחוזרים לשגרה, חוזרים לאנרגיה, חוזרים לעצמנו.\nמי מוכנה?\n#כושר #חיים_בריאים #חזרה_לשגרה'
      },
    ],
    videos: [
      { id: 'v1', title: 'אימון HIIT 20 דקות', type: 'reel', status: 'idea', notes: 'לצלם בפארק עם תאורת שמש. להוסיף טימר על המסך.', createdAt: '2026-05-14' },
      { id: 'v2', title: 'טיפ תזונה – ארוחת בוקר', type: 'reel', status: 'ready', notes: 'מוכן לעלייה', duration: '0:20', createdAt: '2026-04-28' },
    ],
    files: [
      { id: 'f1', name: 'לוגו שירה מזרחי Fitness.png', fileType: 'image', size: '180 KB', uploadedAt: '2026-01-15' },
    ],
    posts: [
      { id: 'p1', title: 'פוסט חזרה לשגרה', platform: 'Instagram', date: '2026-06-01', time: '09:00', status: 'planned', type: 'image' },
      { id: 'p2', title: 'ריל HIIT', platform: 'Instagram', date: '2026-06-05', time: '18:00', status: 'planned', type: 'reel' },
    ],
  },
]

export const mockTasks: Task[] = [
  { id: '1', title: 'להכין פוסטים לשבוע הבא', module: 'clients', done: false, priority: 'high' },
  { id: '2', title: 'לשלוח חשבוניות לסוף חודש', module: 'projects', done: false, priority: 'high' },
  { id: '3', title: 'לעדכן לוח שנה של ספטמבר', module: 'calendar', done: false, priority: 'medium' },
  { id: '4', title: 'לקנות ציוד לצילומים', module: 'quick', done: true, priority: 'low' },
  { id: '5', title: 'לשתות 8 כוסות מים', module: 'health', done: false, priority: 'medium' },
]

export const mockNotifications: Notification[] = [
  { id: '1', text: 'נועה כהן שלחה פנייה חדשה', time: 'לפני 10 דקות', type: 'info', read: false },
  { id: '2', text: 'פגישה בעוד שעתיים – תזכורת', time: 'לפני 20 דקות', type: 'warning', read: false },
  { id: '3', text: 'הגעת ל-80% מיעד הקלוריות', time: 'לפני שעה', type: 'success', read: false },
]

export const mockHealth: HealthData = {
  calories: { current: 1450, goal: 1800 },
  water: { current: 5, goal: 8 },
  steps: { current: 6200, goal: 10000 },
}

export const userName = 'תמר'
