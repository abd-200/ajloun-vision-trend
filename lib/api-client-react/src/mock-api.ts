// Mock/Local Database and API Router for Ajloun Vision Trend
// This file simulates the PostgreSQL database and Express backend entirely inside localStorage.

// User type definition matching pg schema
interface MockUser {
  id: number;
  email: string;
  fullName: string;
  fullNameAr: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  isActive: boolean;
  accessibilityFontLarge: boolean;
  accessibilityHighContrast: boolean;
  accessibilityScreenReader: boolean;
  volunteerPoints: string;
  trainingPoints: string;
  activityPoints: string;
  totalPoints: string;
  createdAt: string;
}

// Initial default database state
const DEFAULT_USERS: MockUser[] = [
  {
    id: 1,
    email: "smadiabdalrahman446@gmail.com",
    fullName: "Abdulrahman Smadi",
    fullNameAr: "عبدالرحمن الصمادي",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    bio: "مدير منصة تيار رؤية عجلون الوطني ومطور للشباب والتنمية المجتمعية.",
    location: "عجلون",
    phone: "0775775812",
    isActive: true,
    accessibilityFontLarge: false,
    accessibilityHighContrast: false,
    accessibilityScreenReader: false,
    volunteerPoints: "250",
    trainingPoints: "150",
    activityPoints: "100",
    totalPoints: "500",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "member@ajloun.org",
    fullName: "Ahmad Malkawi",
    fullNameAr: "أحمد الملكاوي",
    role: "member",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    bio: "ناشط شبابي مهتم بالتنمية المستدامة والمشاريع البيئية في محافظة عجلون.",
    location: "كفرنجة",
    phone: "0771234567",
    isActive: true,
    accessibilityFontLarge: false,
    accessibilityHighContrast: false,
    accessibilityScreenReader: false,
    volunteerPoints: "80",
    trainingPoints: "50",
    activityPoints: "30",
    totalPoints: "160",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_POSTS = [
  {
    id: 1,
    userId: 2,
    userFullNameAr: "أحمد الملكاوي",
    userRole: "member",
    content: "سعيد جداً بالانضمام إلى منصة تيار رؤية عجلون الوطني! هذه مساحة حقيقية لشباب المحافظة للمشاركة والابتكار في تطوير عجلون الحبيبة. معاً نصنع الفرق! 🌲✨",
    imageUrl: "https://images.unsplash.com/photo-1513829096999-4978602297f7?auto=format&fit=crop&w=800&q=80",
    likesCount: 15,
    commentsCount: 2,
    isApproved: true,
    isPinned: false,
    isHidden: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    userId: 1,
    userFullNameAr: "عبدالرحمن الصمادي",
    userRole: "admin",
    content: "نرحب بجميع المنضمين الجدد إلى تيار رؤية عجلون! تهدف منصتنا إلى فتح آفاق العمل التطوعي والتدريب لشبابنا وشاباتنا لتطوير مهاراتهم والمشاركة الفاعلة في تنمية مجتمعنا. ترقبوا إطلاق مبادرتنا القادمة لتشجير غابات عجلون البيئية بالتعاون مع مديرية الزراعة.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    likesCount: 34,
    commentsCount: 3,
    isApproved: true,
    isPinned: true,
    isHidden: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const DEFAULT_COMMENTS = [
  { id: 1, postId: 1, userId: 1, userFullNameAr: "عبدالرحمن الصمادي", content: "أهلاً بك يا أحمد في تيارك ومنصتك! نتطلع لمشاركتك الفاعلة وأفكارك الإبداعية.", createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 2, postId: 1, userId: 2, userFullNameAr: "أحمد الملكاوي", content: "شكراً جزيلاً لك أستاذ عبدالرحمن، كلي حماس للبدء!", createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString() },
  { id: 3, postId: 2, userId: 2, userFullNameAr: "أحمد الملكاوي", content: "مبادرة رائعة جداً وسأكون أول المتطوعين في حملة التشجير إن شاء الله.", createdAt: new Date(Date.now() - 3600000 * 20).toISOString() }
];

const DEFAULT_INITIATIVES = [
  {
    id: 1,
    title: "Eco-Afforestation of Ajloun Forests",
    titleAr: "مبادرة تشجير وحماية غابات عجلون",
    description: "A voluntary campaign to plant native oak and carob trees in the degraded areas of Ajloun, aiming to fight climate change and preserve local biodiversity.",
    descriptionAr: "حملة تطوعية شاملة لزراعة أشجار البلوط والخروب المحلية في المناطق الحرجية المتضررة في عجلون، بهدف حماية البيئة والتنوع الحيوي ومواجهة التغير المناخي.",
    status: "active",
    category: "environment",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    location: "محمية غابات عجلون والمناطق الحرجية المحيطة",
    participantsCount: 48,
    targetParticipants: 100,
    progressPercent: 48,
    isFeatured: true,
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Ajloun Youth Entrepreneurship Forum",
    titleAr: "ملتقى شباب عجلون للريادة والابتكار",
    description: "An intensive training program and exhibition supporting young local innovators to launch their green startups and business ideas.",
    descriptionAr: "ملتقى تدريبي ومسرعة أعمال مصغرة لدعم المبتكرين والرياديين الشباب في عجلون لإطلاق مشاريعهم الإنتاجية والبيئية الرائدة وتزويدهم بمهارات التخطيط والتمويل.",
    status: "planned",
    category: "development",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    location: "قاعة بلدية عجلون الكبرى",
    participantsCount: 12,
    targetParticipants: 50,
    progressPercent: 24,
    isFeatured: true,
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_OPPORTUNITIES = [
  {
    id: 1,
    title: "Volunteer Path Guide - Ajloun Eco-Trail",
    titleAr: "مرشد متطوع لمسار عجلون السياحي البيئي",
    description: "Lead youth and tourist groups through the designated eco-paths, explaining local history and botany.",
    descriptionAr: "مطلوب مرشدين سياحيين متطوعين لقيادة المجموعات الشبابية والسياحية عبر المسارات البيئية المعتمدة في عجلون، مع تقديم شروحات تاريخية وبيئية.",
    type: "volunteer",
    organization: "تيار رؤية عجلون الوطني بالتعاون مع جمعية السياحة البيئية",
    location: "محمية عجلون وقرب قلعة عجلون",
    isRemote: false,
    deadline: "2026-07-20",
    link: "/join",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Digital Literacy & Web Development Trainer",
    titleAr: "مدرب متطوع لمهارات البرمجة وتطوير الويب للشباب",
    description: "Conduct online and offline workshops teaching front-end development fundamentals to local youth.",
    descriptionAr: "مطلوب مدربين متمكنين لتقديم ورشات عمل تفاعلية (عن بعد وحضورياً) لتعليم الشباب أساسيات تطوير الويب والبرمجة لتمكينهم رقمياً وسوق العمل.",
    type: "training",
    organization: "مختبر الإبداع الرقمي لتيار رؤية عجلون",
    location: "مركز تيار عجلون للشباب / هجين",
    isRemote: true,
    deadline: "2026-08-01",
    link: "/join",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_REWARDS = [
  {
    id: 1,
    title: "Purchase Coupon for Ajloun Bookstore",
    titleAr: "قسيمة شراء من مكتبات عجلون المعتمدة",
    description: "Get books, tools, and stationery worth 15 JOD from cooperating bookstores in Ajloun.",
    descriptionAr: "قسيمة شراء بقيمة 15 دينار أردني صالحة لشراء الكتب والمستلزمات الدراسية والقرطاسية من المكتبات الشريكة في عجلون.",
    pointsCost: 150,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Free Guided Trip to Ajloun Reserve",
    titleAr: "رحلة بيئية مجانية شاملة لمحمية غابات عجلون",
    description: "Enjoy a fully covered guided hiking trip, zip-lining experience, and lunch at the reserve.",
    descriptionAr: "تذكرة دخول مجانية شاملة رحلة مسار سياحي بيئي بإرشاد مختص، تجربة العبارة الهوائية، ووجبة غداء تراثية داخل محمية غابات عجلون.",
    pointsCost: 350,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    userId: 1,
    type: "info",
    title: "Welcome to Ajloun Vision!",
    titleAr: "مرحباً بك في منصة رؤية عجلون",
    body: "Explore your dashboard, edit your accessibility settings, and start earning points.",
    bodyAr: "أهلاً بك في لوحة تحكم تيار رؤية عجلون الوطني. ابدأ بتصفح المنشورات والمشاركة في المبادرات لكسب نقاط الأثر المجتمعي.",
    isRead: false,
    link: "/feed",
    createdAt: new Date().toISOString()
  }
];

// Helper to load/save state in localStorage
function getDBState<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveDBState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write mock state to localStorage", e);
  }
}

// Check if Mock Mode is active
export function isMockModeActive(): boolean {
  return localStorage.getItem("ajloun_api_mode") === "mock";
}

export function setMockModeActive(active: boolean): void {
  if (active) {
    localStorage.setItem("ajloun_api_mode", "mock");
    // Initialize mock database tables in localStorage immediately
    getDBState("ajloun_users", DEFAULT_USERS);
    getDBState("ajloun_posts", DEFAULT_POSTS);
    getDBState("ajloun_comments", DEFAULT_COMMENTS);
    getDBState("ajloun_initiatives", DEFAULT_INITIATIVES);
    getDBState("ajloun_opportunities", DEFAULT_OPPORTUNITIES);
    getDBState("ajloun_rewards", DEFAULT_REWARDS);
    getDBState("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    getDBState("ajloun_post_likes", []);
  } else {
    localStorage.removeItem("ajloun_api_mode");
  }
}

// Reset localStorage mock database
export function resetMockDatabase(): void {
  localStorage.removeItem("ajloun_users");
  localStorage.removeItem("ajloun_posts");
  localStorage.removeItem("ajloun_comments");
  localStorage.removeItem("ajloun_initiatives");
  localStorage.removeItem("ajloun_opportunities");
  localStorage.removeItem("ajloun_rewards");
  localStorage.removeItem("ajloun_notifications");
  localStorage.removeItem("ajloun_current_user");
  localStorage.removeItem("ajloun_post_likes");
  setMockModeActive(true);
}

// Main simulated Router for /api requests
export async function handleMockRequest<T>(url: string, method: string, body?: any): Promise<T> {
  // Add a small artificial delay of 200ms to feel like a real network request
  await new Promise(resolve => setTimeout(resolve, 200));

  const parsedUrl = new URL(url, "http://localhost");
  const pathname = parsedUrl.pathname;

  // 1. Healthcheck
  if (pathname === "/api/healthz" && method === "GET") {
    return { status: "mock" } as any;
  }

  // 2. Authentication: Register
  if (pathname === "/api/auth/register" && method === "POST") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const { email, password, fullName, fullNameAr, location, phone } = body || {};

    if (users.some(u => u.email === email)) {
      throw new Error("HTTP 409 Conflict: البريد الإلكتروني مستخدم بالفعل");
    }

    const newUser: MockUser = {
      id: users.length + 1,
      email,
      fullName: fullName || fullNameAr,
      fullNameAr,
      role: "member",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      bio: null,
      location: location || null,
      phone: phone || null,
      isActive: true,
      accessibilityFontLarge: false,
      accessibilityHighContrast: false,
      accessibilityScreenReader: false,
      volunteerPoints: "0",
      trainingPoints: "0",
      activityPoints: "0",
      totalPoints: "0",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveDBState("ajloun_users", users);
    saveDBState("ajloun_current_user", newUser);

    // Create a welcoming notification
    const notifications = getDBState<any[]>("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    notifications.unshift({
      id: notifications.length + 1,
      userId: newUser.id,
      type: "info",
      title: "Welcome to Ajloun Vision!",
      titleAr: "مرحباً بك في منصة رؤية عجلون",
      body: "Explore your dashboard, edit your accessibility settings, and start earning points.",
      bodyAr: "أهلاً بك في لوحة تحكم تيار رؤية عجلون الوطني. ابدأ بتصفح المنشورات والمشاركة في المبادرات لكسب نقاط الأثر المجتمعي.",
      isRead: false,
      link: "/feed",
      createdAt: new Date().toISOString()
    });
    saveDBState("ajloun_notifications", notifications);

    return newUser as any;
  }

  // 3. Authentication: Login
  if (pathname === "/api/auth/login" && method === "POST") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const { email, password } = body || {};

    // Validate admin credentials given by user
    if (email === "smadiabdalrahman446@gmail.com" && password === "Abd@2004") {
      let adminUser = users.find(u => u.email === email);
      if (!adminUser) {
        adminUser = {
          id: 1,
          email,
          fullName: "Abdulrahman Smadi",
          fullNameAr: "عبدالرحمن الصمادي",
          role: "admin",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          bio: "مدير منصة تيار رؤية عجلون الوطني ومطور للشباب والتنمية المجتمعية.",
          location: "عجلون",
          phone: "0775775812",
          isActive: true,
          accessibilityFontLarge: false,
          accessibilityHighContrast: false,
          accessibilityScreenReader: false,
          volunteerPoints: "250",
          trainingPoints: "150",
          activityPoints: "100",
          totalPoints: "500",
          createdAt: new Date().toISOString()
        };
        users.push(adminUser);
        saveDBState("ajloun_users", users);
      }
      saveDBState("ajloun_current_user", adminUser);
      return adminUser as any;
    }

    // Otherwise standard login check
    const matchedUser = users.find(u => u.email === email);
    if (!matchedUser) {
      throw new Error("HTTP 401 Unauthorized: بيانات الدخول غير صحيحة");
    }

    // For simplicity, passwords match if they are provided
    if (!password) {
      throw new Error("HTTP 401 Unauthorized: بيانات الدخول غير صحيحة");
    }

    saveDBState("ajloun_current_user", matchedUser);
    return matchedUser as any;
  }

  // 4. Authentication: Logout
  if (pathname === "/api/auth/logout" && method === "POST") {
    localStorage.removeItem("ajloun_current_user");
    return { status: "ok" } as any;
  }

  // 5. Authentication: Get Current User (GetMe)
  if (pathname === "/api/auth/me" && method === "GET") {
    const currentUser = localStorage.getItem("ajloun_current_user");
    if (!currentUser) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    return JSON.parse(currentUser) as any;
  }

  // 6. Authentication: Update Accessibility Settings
  if (pathname === "/api/auth/me/accessibility" && method === "PATCH") {
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const currentUser: MockUser = JSON.parse(currentUserRaw);
    const updated = { ...currentUser, ...body };
    
    // Save both to session and DB
    saveDBState("ajloun_current_user", updated);
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = updated;
      saveDBState("ajloun_users", users);
    }
    return updated as any;
  }

  // 7. Authentication: Update Profile Settings
  if (pathname === "/api/auth/me/profile" && method === "PATCH") {
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const currentUser: MockUser = JSON.parse(currentUserRaw);
    const updated = { ...currentUser, ...body };

    saveDBState("ajloun_current_user", updated);
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = updated;
      saveDBState("ajloun_users", users);
    }
    return updated as any;
  }

  // 8. Members: Create Member (Join Page)
  if (pathname === "/api/members" && method === "POST") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const { email, fullName, fullNameAr, location, bioAr } = body || {};

    if (users.some(u => u.email === email)) {
      throw new Error("HTTP 409 Conflict: البريد الإلكتروني مستخدم بالفعل");
    }

    const newMember: MockUser = {
      id: users.length + 1,
      email,
      fullName: fullName || fullNameAr,
      fullNameAr,
      role: "member",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      bio: bioAr || null,
      location: location || null,
      phone: null,
      isActive: true,
      accessibilityFontLarge: false,
      accessibilityHighContrast: false,
      accessibilityScreenReader: false,
      volunteerPoints: "0",
      trainingPoints: "0",
      activityPoints: "0",
      totalPoints: "0",
      createdAt: new Date().toISOString()
    };

    users.push(newMember);
    saveDBState("ajloun_users", users);
    
    // Also log in automatically as the newly registered member
    saveDBState("ajloun_current_user", newMember);

    return {
      ...newMember,
      joinedAt: newMember.createdAt,
      bioAr: newMember.bio
    } as any;
  }

  // 9. Members: Get Members list
  if (pathname === "/api/members" && method === "GET") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    return users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      fullNameAr: u.fullNameAr,
      email: u.email,
      role: u.role,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      location: u.location,
      initiativesCount: u.role === "admin" ? 4 : 2,
      impactScore: Number(u.totalPoints) || 0,
      isActive: u.isActive,
      joinedAt: u.createdAt
    })) as any;
  }

  // 10. Members: Get Member Profile
  if (pathname.startsWith("/api/members/") && method === "GET") {
    const id = Number(pathname.split("/").pop());
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const u = users.find(user => user.id === id);
    if (!u) {
      throw new Error("HTTP 404 Not Found: Member not found");
    }

    if (pathname.endsWith("/impact")) {
      return {
        memberId: u.id,
        initiativesJoined: u.role === "admin" ? 4 : 2,
        initiativesLed: u.role === "admin" ? 2 : 0,
        impactScore: Number(u.totalPoints) || 0,
        badges: u.role === "admin" ? ["صانع التغيير", "منسق", "مدير المنصة"] : ["ناشط مجتمعي", "مشارك فاعل"],
        recentInitiatives: []
      } as any;
    }

    return {
      id: u.id,
      fullName: u.fullName,
      fullNameAr: u.fullNameAr,
      email: u.email,
      role: u.role,
      bio: u.bio,
      bioAr: u.bio,
      avatarUrl: u.avatarUrl,
      location: u.location,
      initiativesCount: u.role === "admin" ? 4 : 2,
      impactScore: Number(u.totalPoints) || 0,
      isActive: u.isActive,
      joinedAt: u.createdAt
    } as any;
  }

  // 11. Initiatives: Get Initiatives list
  if (pathname === "/api/initiatives" && method === "GET") {
    return getDBState("ajloun_initiatives", DEFAULT_INITIATIVES) as any;
  }

  // 12. Initiatives: Create Initiative
  if (pathname === "/api/initiatives" && method === "POST") {
    const initiatives = getDBState<any[]>("ajloun_initiatives", DEFAULT_INITIATIVES);
    const newInitiative = {
      ...body,
      id: initiatives.length + 1,
      participantsCount: 1,
      progressPercent: 0,
      createdAt: new Date().toISOString()
    };
    initiatives.unshift(newInitiative);
    saveDBState("ajloun_initiatives", initiatives);
    return newInitiative as any;
  }

  // 13. Initiatives: Get Initiative Detail
  if (pathname.startsWith("/api/initiatives/") && method === "GET") {
    const id = Number(pathname.split("/").pop());
    const initiatives = getDBState<any[]>("ajloun_initiatives", DEFAULT_INITIATIVES);
    const item = initiatives.find(i => i.id === id);
    if (!item) {
      throw new Error("HTTP 404 Not Found");
    }
    return item as any;
  }

  // 14. Posts: Get Posts list
  if (pathname === "/api/posts" && method === "GET") {
    return getDBState("ajloun_posts", DEFAULT_POSTS) as any;
  }

  // 15. Posts: Create Post
  if (pathname === "/api/posts" && method === "POST") {
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const currentUser: MockUser = JSON.parse(currentUserRaw);
    const posts = getDBState<any[]>("ajloun_posts", DEFAULT_POSTS);

    const newPost = {
      id: posts.length + 1,
      userId: currentUser.id,
      userFullNameAr: currentUser.fullNameAr,
      userRole: currentUser.role,
      content: body.content,
      imageUrl: body.imageUrl || null,
      likesCount: 0,
      commentsCount: 0,
      isApproved: true,
      isPinned: false,
      isHidden: false,
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    saveDBState("ajloun_posts", posts);
    return newPost as any;
  }

  // 16. Posts: Like Post
  if (pathname.startsWith("/api/posts/") && pathname.endsWith("/like") && method === "POST") {
    const id = Number(pathname.split("/")[3]);
    const posts = getDBState<any[]>("ajloun_posts", DEFAULT_POSTS);
    const post = posts.find(p => p.id === id);
    if (post) {
      post.likesCount += 1;
      saveDBState("ajloun_posts", posts);
      return post as any;
    }
    throw new Error("HTTP 404 Not Found");
  }

  // 17. Comments: Get Comments
  if (pathname.startsWith("/api/posts/") && pathname.endsWith("/comments") && method === "GET") {
    const postId = Number(pathname.split("/")[3]);
    const comments = getDBState<any[]>("ajloun_comments", DEFAULT_COMMENTS);
    return comments.filter(c => c.postId === postId) as any;
  }

  // 18. Comments: Post Comment
  if (pathname.startsWith("/api/posts/") && pathname.endsWith("/comments") && method === "POST") {
    const postId = Number(pathname.split("/")[3]);
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const currentUser: MockUser = JSON.parse(currentUserRaw);
    const comments = getDBState<any[]>("ajloun_comments", DEFAULT_COMMENTS);

    const newComment = {
      id: comments.length + 1,
      postId,
      userId: currentUser.id,
      userFullNameAr: currentUser.fullNameAr,
      content: body.content,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    saveDBState("ajloun_comments", comments);

    // Increment commentsCount in post
    const posts = getDBState<any[]>("ajloun_posts", DEFAULT_POSTS);
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.commentsCount += 1;
      saveDBState("ajloun_posts", posts);
    }

    return newComment as any;
  }

  // 19. Opportunities: Get list
  if (pathname === "/api/opportunities" && method === "GET") {
    return getDBState("ajloun_opportunities", DEFAULT_OPPORTUNITIES) as any;
  }

  // 20. Opportunities: Create
  if (pathname === "/api/opportunities" && method === "POST") {
    const list = getDBState<any[]>("ajloun_opportunities", DEFAULT_OPPORTUNITIES);
    const newItem = {
      ...body,
      id: list.length + 1,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    saveDBState("ajloun_opportunities", list);
    return newItem as any;
  }

  // 21. Points & Rewards: Get Stats
  if (pathname === "/api/points/stats" && method === "GET") {
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const u: MockUser = JSON.parse(currentUserRaw);
    return {
      volunteerPoints: Number(u.volunteerPoints),
      trainingPoints: Number(u.trainingPoints),
      activityPoints: Number(u.activityPoints),
      totalPoints: Number(u.totalPoints),
      badgeCount: u.role === "admin" ? 3 : 2,
      rank: u.role === "admin" ? "قائد ذهبي" : "ناشط شبابي فاعل"
    } as any;
  }

  // 22. Stats Overview
  if (pathname === "/api/stats/overview" && method === "GET") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const initiatives = getDBState<any[]>("ajloun_initiatives", DEFAULT_INITIATIVES);
    return {
      totalInitiatives: initiatives.length,
      activeInitiatives: initiatives.filter(i => i.status === "active").length,
      completedInitiatives: initiatives.filter(i => i.status === "completed").length,
      totalMembers: users.length,
      totalImpactActions: users.reduce((sum, u) => sum + (Number(u.totalPoints) || 0), 0) + 120,
      governoratesCovered: 1
    } as any;
  }

  // 23. Points: Award Points (Admin)
  if (pathname === "/api/points/award" && method === "POST") {
    const { userId, points, category, descriptionAr } = body || {};
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const idx = users.findIndex(u => u.id === Number(userId));
    if (idx === -1) {
      throw new Error("HTTP 404 Not Found: المستخدم غير موجود");
    }

    const u = users[idx];
    const newTotal = (Number(u.totalPoints) || 0) + Number(points);
    
    if (category === "volunteer") {
      u.volunteerPoints = String((Number(u.volunteerPoints) || 0) + Number(points));
    } else if (category === "training") {
      u.trainingPoints = String((Number(u.trainingPoints) || 0) + Number(points));
    } else {
      u.activityPoints = String((Number(u.activityPoints) || 0) + Number(points));
    }
    u.totalPoints = String(newTotal);
    users[idx] = u;
    saveDBState("ajloun_users", users);

    // If current logged-in user got points, update current user too
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (currentUserRaw) {
      const cu: MockUser = JSON.parse(currentUserRaw);
      if (cu.id === u.id) {
        saveDBState("ajloun_current_user", u);
      }
    }

    // Add a notification for the points
    const notifications = getDBState<any[]>("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    notifications.unshift({
      id: notifications.length + 1,
      userId: u.id,
      type: "points",
      title: "Points Awarded!",
      titleAr: "تم منحك نقاط جديدة!",
      body: `You received ${points} points for: ${descriptionAr}`,
      bodyAr: `تم منحك ${points} نقطة لـ: ${descriptionAr}`,
      isRead: false,
      link: "/points",
      createdAt: new Date().toISOString()
    });
    saveDBState("ajloun_notifications", notifications);

    return {
      userId: u.id,
      volunteerPoints: Number(u.volunteerPoints),
      trainingPoints: Number(u.trainingPoints),
      activityPoints: Number(u.activityPoints),
      totalPoints: Number(u.totalPoints)
    } as any;
  }

  // 24. Rewards: Get/List Rewards
  if (pathname === "/api/rewards" && method === "GET") {
    return getDBState("ajloun_rewards", DEFAULT_REWARDS) as any;
  }

  // 25. Rewards: Create Reward (Admin)
  if (pathname === "/api/rewards" && method === "POST") {
    const rewards = getDBState<any[]>("ajloun_rewards", DEFAULT_REWARDS);
    const newReward = {
      id: rewards.length + 1,
      title: body.nameAr || body.titleAr,
      titleAr: body.nameAr || body.titleAr,
      description: body.descriptionAr || "",
      descriptionAr: body.descriptionAr || "",
      pointsCost: Number(body.pointsCost),
      stock: Number(body.stock) || 10,
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80",
      isActive: true,
      createdAt: new Date().toISOString()
    };
    rewards.unshift(newReward);
    saveDBState("ajloun_rewards", rewards);
    return newReward as any;
  }

  // 26. Rewards: Claim/Redeem Reward
  if (pathname.startsWith("/api/rewards/") && pathname.endsWith("/claim") && method === "POST") {
    const rewardId = Number(pathname.split("/")[3]);
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    if (!currentUserRaw) {
      throw new Error("HTTP 401 Unauthorized: غير مسجل");
    }
    const u: MockUser = JSON.parse(currentUserRaw);

    const rewards = getDBState<any[]>("ajloun_rewards", DEFAULT_REWARDS);
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error("HTTP 404 Not Found: المكافأة غير موجودة");
    }

    if (Number(u.totalPoints) < reward.pointsCost) {
      throw new Error("HTTP 400 Bad Request: نقاطك غير كافية للحصول على هذه المكافأة");
    }

    // Deduct points
    const newTotal = Number(u.totalPoints) - reward.pointsCost;
    const updatedUser = {
      ...u,
      totalPoints: String(newTotal),
      activityPoints: String(Math.max(0, Number(u.activityPoints) - reward.pointsCost))
    };

    saveDBState("ajloun_current_user", updatedUser);
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const idx = users.findIndex(user => user.id === u.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      saveDBState("ajloun_users", users);
    }

    // Decrease reward stock
    if (reward.stock > 0) {
      reward.stock -= 1;
      saveDBState("ajloun_rewards", rewards);
    }

    // Add a reward claim
    const claims = getDBState<any[]>("ajloun_reward_claims", []);
    const newClaim = {
      id: claims.length + 1,
      userId: u.id,
      userNameAr: u.fullNameAr,
      rewardId: reward.id,
      rewardNameAr: reward.titleAr,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    claims.unshift(newClaim);
    saveDBState("ajloun_reward_claims", claims);

    return { status: "claimed" } as any;
  }

  // 27. Rewards: List Claims (Admin)
  if (pathname === "/api/rewards/claims" && method === "GET") {
    return getDBState<any[]>("ajloun_reward_claims", []) as any;
  }

  // 28. Rewards: Update Claim Status (Admin)
  if (pathname.startsWith("/api/rewards/claims/") && pathname.endsWith("/status") && method === "PATCH") {
    const claimId = Number(pathname.split("/")[4]);
    const { status } = body || {};
    const claims = getDBState<any[]>("ajloun_reward_claims", []);
    const idx = claims.findIndex(c => c.id === claimId);
    if (idx === -1) {
      throw new Error("HTTP 404 Not Found: الطلب غير موجود");
    }

    claims[idx].status = status;
    saveDBState("ajloun_reward_claims", claims);

    // Notify user of claim approval/rejection
    const claim = claims[idx];
    const notifications = getDBState<any[]>("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    notifications.unshift({
      id: notifications.length + 1,
      userId: claim.userId,
      type: "reward",
      title: "Reward Status Updated",
      titleAr: "تحديث حالة طلب الجائزة",
      body: `Your claim for ${claim.rewardNameAr} has been ${status === "approved" ? "approved" : "rejected"}`,
      bodyAr: `تم ${status === "approved" ? "قبول" : "رفض"} طلبك للحصول على مكافأة: ${claim.rewardNameAr}`,
      isRead: false,
      link: "/points",
      createdAt: new Date().toISOString()
    });
    saveDBState("ajloun_notifications", notifications);

    return claims[idx] as any;
  }

  // 29. Admin: List Users
  if (pathname === "/api/admin/users" && method === "GET") {
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    return users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      fullNameAr: u.fullNameAr,
      role: u.role,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      location: u.location,
      phone: u.phone,
      isActive: u.isActive,
      totalPoints: u.totalPoints,
      createdAt: u.createdAt
    })) as any;
  }

  // 30. Admin: Delete User
  if (pathname.startsWith("/api/admin/users/") && method === "DELETE") {
    const id = Number(pathname.split("/").pop());
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const filtered = users.filter(user => user.id !== id);
    saveDBState("ajloun_users", filtered);
    return { success: true } as any;
  }

  // 31. Admin: Update User
  if (pathname.startsWith("/api/admin/users/") && method === "PATCH") {
    const id = Number(pathname.split("/").pop());
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    const idx = users.findIndex(user => user.id === id);
    if (idx === -1) {
      throw new Error("HTTP 404 Not Found");
    }
    users[idx] = { ...users[idx], ...body };
    saveDBState("ajloun_users", users);
    return users[idx] as any;
  }

  // 32. Admin: Reported Posts
  if (pathname === "/api/admin/reported-posts" && method === "GET") {
    const posts = getDBState<any[]>("ajloun_posts", DEFAULT_POSTS);
    return posts.filter(p => p.likesCount > 40) as any;
  }

  // 33. Notifications: Get Notifications
  if (pathname === "/api/notifications" && method === "GET") {
    const notifications = getDBState<any[]>("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    const currentUserRaw = localStorage.getItem("ajloun_current_user");
    const u = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    if (!u) return [] as any;
    return notifications.filter(n => n.userId === u.id) as any;
  }

  // 34. Notifications: Send Notification (Admin)
  if (pathname === "/api/notifications" && method === "POST") {
    const notifications = getDBState<any[]>("ajloun_notifications", DEFAULT_NOTIFICATIONS);
    const users = getDBState<MockUser[]>("ajloun_users", DEFAULT_USERS);
    
    // Create notifications for all users
    users.forEach(u => {
      notifications.unshift({
        id: notifications.length + 1,
        userId: u.id,
        type: body.type || "announcement",
        title: body.titleAr,
        titleAr: body.titleAr,
        body: body.bodyAr || "",
        bodyAr: body.bodyAr || "",
        isRead: false,
        link: body.link || "/feed",
        createdAt: new Date().toISOString()
      });
    });
    
    saveDBState("ajloun_notifications", notifications);
    return { status: "ok" } as any;
  }

  throw new Error(`HTTP 404 Not Found: Simulated endpoint ${method} ${pathname} not mocked.`);
}
