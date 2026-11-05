import type {
  Announcement,
  Category,
  CmsContent,
  CreditTransaction,
  Notification,
  Order,
  PaymentRequest,
  Product,
  User,
} from "../types";

// Categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: { en: "E-Books", fa: "کتاب‌های الکترونیکی", ps: "بریښنایي کتابونه" },
    description: {
      en: "Digital books and guides",
      fa: "کتاب‌ها و راهنماهای دیجیتال",
      ps: "ډیجیټل کتابونه او لارښوونې",
    },
    order: 1,
    active: true,
  },
  {
    id: "cat-2",
    name: { en: "Software Licenses", fa: "لایسنس نرم‌افزار", ps: "د سافټویر لایسنس" },
    description: {
      en: "Premium software and tools",
      fa: "نرم‌افزارها و ابزارهای پریمیوم",
      ps: "پریمیم سافټویر او وسایل",
    },
    order: 2,
    active: true,
  },
  {
    id: "cat-3",
    name: { en: "Online Courses", fa: "دوره‌های آنلاین", ps: "آنلاین کورسونه" },
    description: {
      en: "Video tutorials and learning materials",
      fa: "آموزش‌های ویدیویی و مواد یادگیری",
      ps: "ویډیو زده‌کړې او د زده‌کړې مواد",
    },
    order: 3,
    active: true,
  },
  {
    id: "cat-4",
    name: { en: "Design Assets", fa: "دارایی‌های طراحی", ps: "د ډیزاین شتمنۍ" },
    description: {
      en: "Templates, icons, and graphics",
      fa: "قالب‌ها، آیکون‌ها و گرافیک‌ها",
      ps: "ټیمپلیټونه، آیکونونه او ګرافیکونه",
    },
    order: 4,
    active: true,
  },
  {
    id: "cat-5",
    name: { en: "Music & Audio", fa: "موسیقی و صدا", ps: "موسیقي او غږ" },
    description: {
      en: "Audio samples, music, and sound effects",
      fa: "نمونه‌های صوتی، موسیقی و افکت‌های صوتی",
      ps: "غږیز نمونې، موسیقي او د غږ اغیزې",
    },
    order: 5,
    active: true,
  },
  {
    id: "cat-6",
    name: { en: "Business Tools", fa: "ابزارهای کسب‌وکار", ps: "د سوداګرۍ وسایل" },
    description: {
      en: "Productivity and business solutions",
      fa: "راه‌حل‌های بهره‌وری و کسب‌وکار",
      ps: "د بهره‌ورۍ او سوداګرۍ حلونه",
    },
    order: 6,
    active: true,
  },
];

// Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: { en: "Modern Web Development Guide", fa: "راهنمای توسعه وب مدرن", ps: "د مدرن ویب پراختیا لارښود" },
    description: {
      en: "A complete guide to modern web development covering React, TypeScript, Tailwind, and best practices for building production-ready applications.",
      fa: "راهنمای کامل توسعه وب مدرن شامل React، TypeScript، Tailwind و بهترین روش‌ها برای ساخت برنامه‌های آماده تولید.",
      ps: "د مدرن ویب پراختیا بشپړ لارښود چې React، TypeScript، Tailwind او د تولید لپاره چمتوا غوښتنلیکونو جوړولو غوره طریقې پکې شاملې دي.",
    },
    categoryId: "cat-1",
    price: 120,
    image: "/images/p1.svg",
    available: true,
    stock: 50,
    createdAt: "2025-01-15",
    featured: true,
  },
  {
    id: "prod-2",
    name: { en: "Pro Designer Toolkit", fa: "جعبه ابزار طراح حرفه‌ای", ps: "د مسلکي ډیزاینر وسایل" },
    description: {
      en: "Premium design assets including icons, illustrations, and templates for modern web and mobile apps.",
      fa: "دارایی‌های طراحی پریمیوم شامل آیکون‌ها، تصاویر و قالب‌ها برای برنامه‌های وب و موبایل مدرن.",
      ps: "پریمیم ډیزاین شتمنۍ پکې آیکونونه، انځورونه او د مدرن ویب او موبایل غوښتنلیکونو ټیمپلیټونه شامل دي.",
    },
    categoryId: "cat-4",
    price: 240,
    image: "/images/p2.svg",
    available: true,
    stock: 30,
    createdAt: "2025-02-01",
    featured: true,
  },
  {
    id: "prod-3",
    name: { en: "Full-Stack JavaScript Course", fa: "دوره جاوااسکریپت فول‌استک", ps: "د فول سټیک جاوا اسکریپټ کورس" },
    description: {
      en: "Master JavaScript from fundamentals to advanced concepts including Node.js, Express, databases, and deployment.",
      fa: "جاوااسکریپت را از مفاهیم ابتدایی تا پیشرفته شامل Node.js، Express، پایگاه‌های داده و استقرار فرابگیرید.",
      ps: "د JavaScript له بنسټیزو مفاهیمو څخه تر پرمختللو مفاهیمو پورې چې Node.js، Express، ډیټابیس او ځای پرځای کول پکې شامل دي زده کړئ.",
    },
    categoryId: "cat-3",
    price: 350,
    image: "/images/p3.svg",
    available: true,
    stock: 100,
    createdAt: "2025-02-10",
    featured: true,
  },
  {
    id: "prod-4",
    name: { en: "Audio Production Pack", fa: "بسته تولید صدا", ps: "د غږ تولید بسته" },
    description: {
      en: "A curated library of high-quality samples, loops, and sound effects for music producers and content creators.",
      fa: "کتابخانه‌ای精选 از نمونه‌ها، لوپ‌ها و افکت‌های صوتی با کیفیت بالا برای تولیدکنندگان موسیقی و سازندگان محتوا.",
      ps: "د موسیقۍ جوړونکو او د منځپانګې جوړونکو لپاره د لوړ کیفیت نمونو، لوپونو او د غږ اغیزو غوره کتابتون.",
    },
    categoryId: "cat-5",
    price: 180,
    image: "/images/p4.svg",
    available: true,
    stock: 25,
    createdAt: "2025-02-20",
    featured: false,
  },
  {
    id: "prod-5",
    name: { en: "Productivity Suite License", fa: "لایسنس مجموعه بهره‌وری", ps: "د بهره‌ورۍ سافټویر لایسنس" },
    description: {
      en: "A 1-year license for a complete productivity suite including document editing, spreadsheets, and presentation tools.",
      fa: "لایسنس یک‌ساله برای مجموعه بهره‌وری کامل شامل ویرایش اسناد، صفحات گسترده و ابزارهای ارائه.",
      ps: "د بشپړ بهره‌ورۍ سافټویر لپاره ۱ کاله لایسنس چې د اسنادو سمول، سپریډشیټونه او د وړاندې کولو وسایل پکې شامل دي.",
    },
    categoryId: "cat-2",
    price: 480,
    image: "/images/p5.svg",
    available: true,
    stock: 15,
    createdAt: "2025-03-01",
    featured: true,
  },
  {
    id: "prod-6",
    name: { en: "Mobile App UI Bundle", fa: "بسته UI برنامه موبایل", ps: "د موبایل اپ UI بسته" },
    description: {
      en: "Over 200 beautifully crafted mobile UI screens and components for iOS and Android, fully customizable.",
      fa: "بیش از ۲۰۰ صفحه و کامپوننت UI زیبا برای iOS و Android، کاملاً قابل سفارشی‌سازی.",
      ps: "د iOS او Android لپاره له ۲۰۰ څخه زیاتو ښکلي جوړ شویو موبایل UI سکرینونو او کمپوننټونو، په بشپړه توګه دودیز کولو وړ.",
    },
    categoryId: "cat-4",
    price: 320,
    image: "/images/p6.svg",
    available: true,
    stock: 20,
    createdAt: "2025-03-05",
    featured: false,
  },
  {
    id: "prod-7",
    name: { en: "Business Plan Templates", fa: "قالب‌های طرح کسب‌وکار", ps: "د سوداګرۍ پلان ټیمپلیټونه" },
    description: {
      en: "Professional business plan templates for startups and growing companies, including financial projections.",
      fa: "قالب‌های طرح کسب‌وکار حرفه‌ای برای استارتاپ‌ها و شرکت‌های در حال رشد، شامل پیش‌بینی‌های مالی.",
      ps: "د سټارټ اپونو او وده کوونکو شرکتونو لپاره مسلکي د سوداګرۍ پلان ټیمپلیټونه، چې مالي اټکلونه پکې شامل دي.",
    },
    categoryId: "cat-6",
    price: 90,
    image: "/images/p7.svg",
    available: true,
    stock: 40,
    createdAt: "2025-03-10",
    featured: false,
  },
  {
    id: "prod-8",
    name: { en: "Photography Masterclass", fa: "کلاس استادی عکاسی", ps: "د عکاسي مستري کورس" },
    description: {
      en: "Learn professional photography from basics to advanced techniques, including editing and composition.",
      fa: "عکاسی حرفه‌ای را از مبانی تا تکنیک‌های پیشرفته شامل ویرایش و ترکیب‌بندی بیاموزید.",
      ps: "له بنسټیزو څخه تر پرمختللو تخنیکونو پورې مسلکي عکاسي زده کړئ، پکې سمول او ترکیب شامل دي.",
    },
    categoryId: "cat-3",
    price: 210,
    image: "/images/p8.svg",
    available: true,
    stock: 35,
    createdAt: "2025-03-15",
    featured: false,
  },
];

// Users
export const mockUsers: User[] = [
  {
    id: "u-1",
    fullName: "Ahmad Rahimi",
    email: "ahmad@example.com",
    phone: "+93 700 111 222",
    status: "approved",
    role: "user",
    credit: 1500,
    createdAt: "2025-01-10",
    lastLogin: "2025-04-12",
  },
  {
    id: "u-2",
    fullName: "Sara Mohammadi",
    email: "sara@example.com",
    phone: "+93 700 333 444",
    status: "approved",
    role: "user",
    credit: 800,
    createdAt: "2025-01-15",
    lastLogin: "2025-04-11",
  },
  {
    id: "u-3",
    fullName: "Karim Hassan",
    email: "karim@example.com",
    phone: "+93 700 555 666",
    status: "pending",
    role: "user",
    credit: 0,
    createdAt: "2025-04-10",
  },
  {
    id: "u-4",
    fullName: "Mariam Akbari",
    email: "mariam@example.com",
    phone: "+93 700 777 888",
    status: "pending",
    role: "user",
    credit: 0,
    createdAt: "2025-04-11",
  },
  {
    id: "u-5",
    fullName: "Yususf Karimi",
    email: "yusuf@example.com",
    phone: "+93 700 999 000",
    status: "approved",
    role: "user",
    credit: 2400,
    createdAt: "2025-02-01",
    lastLogin: "2025-04-13",
  },
  {
    id: "u-6",
    fullName: "Layla Noor",
    email: "layla@example.com",
    phone: "+93 700 222 333",
    status: "denied",
    role: "user",
    credit: 0,
    createdAt: "2025-03-05",
  },
  {
    id: "u-7",
    fullName: "Omar Saeed",
    email: "omar@example.com",
    phone: "+93 700 444 555",
    status: "approved",
    role: "user",
    credit: 600,
    createdAt: "2025-02-20",
    lastLogin: "2025-04-10",
  },
  {
    id: "u-8",
    fullName: "Zainab Haidari",
    email: "zainab@example.com",
    phone: "+93 700 666 777",
    status: "suspended",
    role: "user",
    credit: 100,
    createdAt: "2025-02-15",
  },
  {
    id: "u-admin",
    fullName: "Site Administrator",
    email: "admin@rbuffer.io",
    phone: "+93 700 000 000",
    status: "approved",
    role: "admin",
    credit: 0,
    createdAt: "2024-12-01",
    lastLogin: "2025-04-14",
  },
];

// Credit transactions
export const mockCreditTransactions: CreditTransaction[] = [
  {
    id: "ct-1",
    userId: "u-1",
    type: "added",
    amount: 1000,
    description: "Top-up via Bank Transfer",
    createdAt: "2025-01-12",
  },
  {
    id: "ct-2",
    userId: "u-1",
    type: "used",
    amount: 240,
    description: "Order #ORD-1001 — Pro Designer Toolkit",
    createdAt: "2025-02-01",
  },
  {
    id: "ct-3",
    userId: "u-1",
    type: "added",
    amount: 500,
    description: "Top-up via Cash",
    createdAt: "2025-03-15",
  },
  {
    id: "ct-4",
    userId: "u-1",
    type: "used",
    amount: 120,
    description: "Order #ORD-1003 — Modern Web Development Guide",
    createdAt: "2025-03-20",
  },
];

// Payment requests
export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: "pr-1",
    userId: "u-1",
    amount: 1000,
    method: "bank",
    reference: "TX-998812",
    note: "Initial top-up",
    status: "approved",
    createdAt: "2025-01-11",
    reviewedAt: "2025-01-12",
  },
  {
    id: "pr-2",
    userId: "u-2",
    amount: 800,
    method: "card",
    reference: "CR-445522",
    status: "approved",
    createdAt: "2025-01-15",
    reviewedAt: "2025-01-16",
  },
  {
    id: "pr-3",
    userId: "u-1",
    amount: 500,
    method: "cash",
    reference: "CS-112233",
    status: "approved",
    createdAt: "2025-03-14",
    reviewedAt: "2025-03-15",
  },
  {
    id: "pr-4",
    userId: "u-7",
    amount: 600,
    method: "bank",
    reference: "TX-887766",
    status: "pending",
    createdAt: "2025-04-12",
  },
  {
    id: "pr-5",
    userId: "u-5",
    amount: 1500,
    method: "card",
    reference: "CR-554433",
    status: "pending",
    createdAt: "2025-04-13",
  },
  {
    id: "pr-6",
    userId: "u-2",
    amount: 400,
    method: "cash",
    reference: "CS-776655",
    status: "rejected",
    adminNote: "Reference number could not be verified",
    createdAt: "2025-03-22",
    reviewedAt: "2025-03-23",
  },
];

// Orders
export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    userId: "u-1",
    items: [
      {
        productId: "prod-2",
        productName: {
          en: "Pro Designer Toolkit",
          fa: "جعبه ابزار طراح حرفه‌ای",
          ps: "د مسلکي ډیزاینر وسایل",
        },
        quantity: 1,
        unitPrice: 240,
      },
    ],
    total: 240,
    status: "completed",
    createdAt: "2025-02-01",
    timeline: [
      { status: "pending", date: "2025-02-01T10:00:00" },
      { status: "approved", date: "2025-02-01T11:30:00" },
      { status: "processing", date: "2025-02-01T13:00:00" },
      { status: "completed", date: "2025-02-02T09:00:00" },
    ],
  },
  {
    id: "ORD-1002",
    userId: "u-1",
    items: [
      {
        productId: "prod-5",
        productName: {
          en: "Productivity Suite License",
          fa: "لایسنس مجموعه بهره‌وری",
          ps: "د بهره‌ورۍ سافټویر لایسنس",
        },
        quantity: 1,
        unitPrice: 480,
      },
    ],
    total: 480,
    status: "processing",
    createdAt: "2025-04-08",
    timeline: [
      { status: "pending", date: "2025-04-08T14:00:00" },
      { status: "approved", date: "2025-04-08T15:00:00" },
      { status: "processing", date: "2025-04-09T09:00:00" },
    ],
  },
  {
    id: "ORD-1003",
    userId: "u-1",
    items: [
      {
        productId: "prod-1",
        productName: {
          en: "Modern Web Development Guide",
          fa: "راهنمای توسعه وب مدرن",
          ps: "د مدرن ویب پراختیا لارښود",
        },
        quantity: 1,
        unitPrice: 120,
      },
    ],
    total: 120,
    status: "completed",
    createdAt: "2025-03-20",
    timeline: [
      { status: "pending", date: "2025-03-20T10:00:00" },
      { status: "approved", date: "2025-03-20T11:00:00" },
      { status: "completed", date: "2025-03-20T14:00:00" },
    ],
  },
  {
    id: "ORD-1004",
    userId: "u-2",
    items: [
      {
        productId: "prod-3",
        productName: {
          en: "Full-Stack JavaScript Course",
          fa: "دوره جاوااسکریپت فول‌استک",
          ps: "د فول سټیک جاوا اسکریپټ کورس",
        },
        quantity: 1,
        unitPrice: 350,
      },
    ],
    total: 350,
    status: "pending",
    createdAt: "2025-04-14",
    timeline: [{ status: "pending", date: "2025-04-14T16:00:00" }],
  },
  {
    id: "ORD-1005",
    userId: "u-5",
    items: [
      {
        productId: "prod-6",
        productName: {
          en: "Mobile App UI Bundle",
          fa: "بسته UI برنامه موبایل",
          ps: "د موبایل اپ UI بسته",
        },
        quantity: 1,
        unitPrice: 320,
      },
    ],
    total: 320,
    status: "approved",
    createdAt: "2025-04-10",
    timeline: [
      { status: "pending", date: "2025-04-10T11:00:00" },
      { status: "approved", date: "2025-04-10T13:00:00" },
    ],
  },
];

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: "n-1",
    userId: "u-1",
    type: "order",
    title: {
      en: "Order Completed",
      fa: "سفارش تکمیل شد",
      ps: "سپارنه بشپړه شوه",
    },
    body: {
      en: "Your order ORD-1001 has been completed and delivered.",
      fa: "سفارش ORD-1001 شما تکمیل و تحویل شد.",
      ps: "ستاسو سپارنه ORD-1001 بشپړه او وسپارل شوه.",
    },
    read: false,
    createdAt: "2025-02-02T09:00:00",
  },
  {
    id: "n-2",
    userId: "u-1",
    type: "credit",
    title: {
      en: "Credit Added",
      fa: "اعتبار اضافه شد",
      ps: "کریډټ اضافه شو",
    },
    body: {
      en: "500 credits have been added to your account.",
      fa: "۵۰۰ اعتبار به حساب شما اضافه شد.",
      ps: "ستاسو حساب ته ۵۰۰ کریډټ اضافه شوي دي.",
    },
    read: true,
    createdAt: "2025-03-15T11:00:00",
  },
  {
    id: "n-3",
    userId: "u-1",
    type: "announcement",
    title: {
      en: "New Products Available",
      fa: "محصولات جدید موجود است",
      ps: "نوي محصولات شتون لري",
    },
    body: {
      en: "Check out the latest additions to our catalog.",
      fa: "آخرین اضافات کاتالوگ ما را بررسی کنید.",
      ps: "زموږ د کیټلاګ وروستي اضافې وګورئ.",
    },
    read: false,
    createdAt: "2025-04-01T10:00:00",
  },
  {
    id: "n-4",
    userId: "u-1",
    type: "order",
    title: {
      en: "Order Processing",
      fa: "سفارش در حال پردازش",
      ps: "سپارنه په پروسس کې",
    },
    body: {
      en: "Your order ORD-1002 is now being processed.",
      fa: "سفارش ORD-1002 شما اکنون در حال پردازش است.",
      ps: "ستاسو سپارنه ORD-1002 اوس په پروسس کې ده.",
    },
    read: false,
    createdAt: "2025-04-09T09:00:00",
  },
];

// Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: {
      en: "Platform Update: New Categories",
      fa: "به‌روزرسانی پلتفرم: دسته‌بندی‌های جدید",
      ps: "د پلیټفارم تازه: نوي کټګورۍ",
    },
    body: {
      en: "We've added new product categories including Music & Audio and Business Tools. Explore the latest additions to our catalog.",
      fa: "ما دسته‌بندی‌های محصول جدیدی شامل موسیقی و صدا و ابزارهای کسب‌وکار اضافه کرده‌ایم. آخرین اضافات کاتالوگ ما را کاوش کنید.",
      ps: "موږ نوي د محصول کټګورۍ اضافه کړي دي پکې موسیقي او غږ او د سوداګرۍ وسایل شامل دي. زموږ د کیټلاګ وروستي اضافې وپلټئ.",
    },
    published: true,
    createdAt: "2025-04-01",
    language: "all",
  },
  {
    id: "ann-2",
    title: {
      en: "Improved Credit Management",
      fa: "مدیریت اعتبار بهبود یافته",
      ps: "د کریډټ مدیریت ښه شوی",
    },
    body: {
      en: "We've enhanced the credit history view with detailed transaction breakdowns and better filtering.",
      fa: "ما نمای تاریخچه اعتبار را با جزئیات تراکنش و فیلتر بهتر بهبود داده‌ایم.",
      ps: "موږ د کریډټ تاریخ لید د معاملې تفصیلي ماتولو او غوره فلټرینګ سره ښه کړی.",
    },
    published: true,
    createdAt: "2025-03-20",
    language: "all",
  },
  {
    id: "ann-3",
    title: {
      en: "Scheduled Maintenance Notice",
      fa: "اطلاعیه نگهداری برنامه‌ریزی شده",
      ps: "د پلان شوې ساتنې خبرتیا",
    },
    body: {
      en: "Brief maintenance will occur on Friday from 02:00 to 04:00. The platform may be temporarily unavailable.",
      fa: "نگهداری کوتاه در روز جمعه از ساعت ۰۲:۰۰ تا ۰۴:۰۰ انجام خواهد شد. پلتفرم ممکن است موقتاً در دسترس نباشد.",
      ps: "د جمعې ورځ له ۰۲:۰۰ څخه تر ۰۴:۰۰ پورې لنډ ساتنه به ترسره شي. پلیټفارم ممکن په لنډ مهاله توګه شتون ونلري.",
    },
    published: true,
    createdAt: "2025-03-10",
    language: "all",
  },
];

// CMS
export const mockCmsContent: CmsContent[] = [
  {
    id: "cms-1",
    page: "home",
    section: "hero",
    key: "heroTitle",
    value: {
      en: "Digital Products Made Simple",
      fa: "محصولات دیجیتال به سادگی",
      ps: "ډیجیټل محصولات په اسانۍ سره",
    },
  },
  {
    id: "cms-2",
    page: "home",
    section: "hero",
    key: "heroSubtitle",
    value: {
      en: "A professional marketplace for digital products with a transparent platform credit system.",
      fa: "یک بازار حرفه‌ای برای محصولات دیجیتال با سیستم شفاف اعتبار پلتفرم.",
      ps: "د پلیټفارم کریډټ روښانه سیسټم سره د ډیجیټل محصولاتو لپاره یو مسلکي بازار.",
    },
  },
  {
    id: "cms-3",
    page: "about",
    section: "mission",
    key: "missionText",
    value: {
      en: "R-Buffer provides a trusted environment for purchasing digital products using platform credit.",
      fa: "R-Buffer یک محیط قابل اعتماد برای خرید محصولات دیجیتال با استفاده از اعتبار پلتفرم فراهم می‌کند.",
      ps: "R-Buffer د پلیټفارم کریډټ په کارولو سره د ډیجیټل محصولاتو د پیرودلو لپاره یو باوري چاپیریال برابروي.",
    },
  },
  {
    id: "cms-4",
    page: "contact",
    section: "info",
    key: "email",
    value: {
      en: "support@rbuffer.io",
      fa: "support@rbuffer.io",
      ps: "support@rbuffer.io",
    },
  },
  {
    id: "cms-5",
    page: "footer",
    section: "about",
    key: "aboutText",
    value: {
      en: "R-Buffer is a digital product marketplace with an integrated platform credit system.",
      fa: "R-Buffer یک بازار محصولات دیجیتال با سیستم اعتبار پلتفرم یکپارچه است.",
      ps: "R-Buffer د یوځای شوي پلیټفارم کریډټ سیسټم سره د ډیجیټل محصولاتو بازار دی.",
    },
  },
];

// Chart data
export const ordersChartData = [
  { month: "Jan", orders: 12, credit: 2400 },
  { month: "Feb", orders: 18, credit: 3600 },
  { month: "Mar", orders: 24, credit: 5200 },
  { month: "Apr", orders: 31, credit: 7400 },
];

export const creditChartData = [
  { month: "Jan", added: 4500, used: 2400 },
  { month: "Feb", added: 5200, used: 3600 },
  { month: "Mar", added: 6100, used: 5200 },
  { month: "Apr", added: 8200, used: 7400 },
];

export const userChartData = [
  { month: "Jan", registered: 8 },
  { month: "Feb", registered: 14 },
  { month: "Mar", registered: 18 },
  { month: "Apr", registered: 25 },
];

export const productActivityData = [
  { name: "E-Books", value: 35 },
  { name: "Software", value: 25 },
  { name: "Courses", value: 20 },
  { name: "Design", value: 15 },
  { name: "Other", value: 5 },
];