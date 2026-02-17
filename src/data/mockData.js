export const MOCK_USERS = [
  {
    id: "1",
    username: "anna_svensson",
    full_name: "Anna Svensson",
    bio: "Forsta barnet, nervos men glad.",
    due_date: "2025-08-15",
    current_week: 24,
    avatar_url: "AS",
    location: "Stockholm",
    household_name: "Familjen Svensson",
    is_new_pregnancy: true,
    child_birthdate: "2026-02-09",
  },
  {
    id: "2",
    username: "erik_berg",
    full_name: "Erik Berg",
    bio: "Pappa for andra gangen, nu med tvillingar.",
    due_date: "2025-09-20",
    current_week: 20,
    avatar_url: "EB",
    location: "Malmo",
    household_name: "Familjen Berg",
    is_new_pregnancy: false,
    child_birthdate: "2024-11-02",
  },
  {
    id: "3",
    username: "sara_lindgren",
    full_name: "Sara Lindgren",
    bio: "Alskar att dela tips om graviditet.",
    due_date: "2025-07-10",
    current_week: 28,
    avatar_url: "SL",
    location: "Goteborg",
    household_name: "Lindgren & Co",
    is_new_pregnancy: false,
    child_birthdate: "2023-06-15",
  },
  {
    id: "4",
    username: "johan_karlsson",
    full_name: "Johan Karlsson",
    bio: "Vantande pappa fran Goteborg",
    due_date: "2025-10-05",
    current_week: 16,
    avatar_url: "JK",
    location: "Goteborg",
    household_name: "Familjen Karlsson",
    is_new_pregnancy: true,
    child_birthdate: "2022-09-01",
  },
];

export const MOCK_GROUPS = [
  {
    id: "g1",
    name: "Goteborg Foraldrar 2025",
    description: "For alla som vantar barn i Goteborg",
    icon: "🏙️",
    members: 47,
    is_member: true,
    new_posts: 3,
  },
  {
    id: "g2",
    name: "Tvillingar & Trillingar",
    description: "Support och tips for flerbarnsforaldrar",
    icon: "👶👶",
    members: 23,
    is_member: false,
    new_posts: 0,
  },
  {
    id: "g3",
    name: "Forstfoderskor Sverige",
    description: "For dig som vantar ditt forsta barn",
    icon: "🌟",
    members: 156,
    is_member: true,
    new_posts: 2,
  },
  {
    id: "g4",
    name: "HBTQ Foraldrar",
    description: "Community for HBTQ familjer",
    icon: "🌈",
    members: 34,
    is_member: false,
    new_posts: 1,
  },
  {
    id: "g5",
    name: "Promenad & Traning",
    description: "Tips och grupp for aktiva gravida",
    icon: "🏃‍♀️",
    members: 89,
    is_member: true,
    new_posts: 0,
  },
];

export const MOCK_MUST_HAVES = [
  {
    id: "mh1",
    title: "Najell Babynest",
    description: "Perfekt for nyfodda att sova i. Portabel och skon!",
    category: "Bebis",
    price_range: "Mellan (800-1200 kr)",
    upvotes: 847,
    downvotes: 23,
    verified_count: 512,
    reviews_count: 54,
    created_by: "3",
    created_at: "2025-01-15T10:00:00",
  },
  {
    id: "mh2",
    title: "Ergobaby Barsele",
    description: "Ergonomisk barsele som bade du och bebisen alskar",
    category: "Transport",
    price_range: "Hog (1500+ kr)",
    upvotes: 723,
    downvotes: 15,
    verified_count: 401,
    reviews_count: 38,
    created_by: "2",
    created_at: "2025-01-10T14:30:00",
  },
  {
    id: "mh3",
    title: "Medela Brostpump",
    description: "Basta elektriska brostpumpen for amning",
    category: "For mamman",
    price_range: "Hog (2000+ kr)",
    upvotes: 634,
    downvotes: 45,
    verified_count: 298,
    reviews_count: 67,
    created_by: "1",
    created_at: "2025-01-20T09:15:00",
  },
  {
    id: "mh4",
    title: "Ikea Antilop Barnstol",
    description: "Billig, praktisk och latt att gora ren!",
    category: "Hemma",
    price_range: "Lag (under 500 kr)",
    upvotes: 892,
    downvotes: 8,
    verified_count: 645,
    reviews_count: 42,
    created_by: "4",
    created_at: "2025-01-05T16:20:00",
  },
];

export const MOCK_TIPS = [
  {
    id: "t1",
    title: "Ha alltid extra klader i bilen",
    content:
      "Efter en blojexplosion pa E4:an larde jag mig detta. Packa en liten vaska med: body, byxor, strumpor, filt och skotunderlag.",
    category: "BB-tips",
    tags: ["Forsta manaden", "Transport"],
    upvotes: 1243,
    helpful_count: 891,
    comments_count: 124,
    created_by: "3",
    created_at: "2025-01-25T11:00:00",
  },
  {
    id: "t2",
    title: "Spellista for forlossningen",
    content:
      "Gor din egen spellista innan du aker till BB! Testa flera listor under graviditeten for att hitta din favorit.",
    category: "Spellistor",
    tags: ["Forlossning", "Forberedelser"],
    upvotes: 856,
    helpful_count: 612,
    comments_count: 89,
    created_by: "1",
    created_at: "2025-01-18T15:30:00",
  },
  {
    id: "t3",
    title: "Frys in maltider innan bebisen kommer",
    content:
      "Basta tipset jag fick! Vecka 35-38, laga dubbla portioner och frys in.",
    category: "Mat & Forberedelser",
    tags: ["Forberedelser", "Praktiskt"],
    upvotes: 1456,
    helpful_count: 1089,
    comments_count: 156,
    created_by: "2",
    created_at: "2025-02-01T09:45:00",
  },
];

export const MOCK_BLOGS = [
  {
    id: "b1",
    title: "Forsta veckorna: vad ar normalt?",
    excerpt:
      "En kort guide om vanliga kanslor, somn och rutiner de forsta veckorna.",
    created_at: "2025-02-02T08:00:00",
  },
  {
    id: "b2",
    title: "Checklista infor BB",
    excerpt: "En praktisk checklista som hjalper er att packa smart och lugnt.",
    created_at: "2025-01-28T10:30:00",
  },
  {
    id: "b3",
    title: "Sa pratar ni om forvantningar som par",
    excerpt:
      "Tips pa samtal och vanliga missforstand att undvika innan bebisen kommer.",
    created_at: "2025-01-12T14:45:00",
  },
];

export const MOCK_SCREENSHOTS = [
  { id: "s1", title: "Flode", src: "/mock-feed.svg" },
  { id: "s2", title: "Vanner", src: "/mock-friends.svg" },
  { id: "s3", title: "Listan", src: "/mock-groups.svg" },
  { id: "s4", title: "Profil", src: "/mock-profile.svg" },
];

export const MOCK_FRIEND_SUGGESTIONS = [
  {
    id: "fs1",
    name: "Sofia L",
    friends: 12,
    mutual: "3 gemensamma",
  },
  {
    id: "fs2",
    name: "David N",
    friends: 7,
    mutual: "1 gemensam",
  },
  {
    id: "fs3",
    name: "Emma B",
    friends: 18,
    mutual: "5 gemensamma",
  },
];

export const MOCK_SAVED_POSTS = [
  {
    id: "sp1",
    title: "Checklista for BB",
    category: "Guides",
    saved_at: "2025-01-30T12:00:00",
  },
  {
    id: "sp2",
    title: "Forsta veckan hemma",
    category: "Tips",
    saved_at: "2025-02-02T14:15:00",
  },
];

export const MOCK_GIVEAWAYS = [
  {
    id: "gw1",
    title: "Win a baby monitor",
    description: "Tavla om en premium baby monitor.",
    points_required: 30,
  },
  {
    id: "gw2",
    title: "Free stroller service",
    description: "Gratis service for din barnvagn.",
    points_required: 20,
  },
];

export const MOCK_DAD_JOKES = [
  {
    id: "dj1",
    setup: "Varfor gick bebisen till legen?",
    punchline: "For att den hade feber i vagn!",
    upvotes: 112,
  },
  {
    id: "dj2",
    setup: "Vad sa bebisen till mobilen?",
    punchline: "Sluta ring, jag sover!",
    upvotes: 89,
  },
];

export const MOCK_POSTS = [
  {
    id: "p1",
    user_id: "1",
    content:
      "Vecka 24 och borjar kanna sparkar pa riktigt. Har nagon tips pa bra gravidkuddar?",
    created_at: "2025-02-01T10:00:00",
    likes: 23,
    comments: 5,
    visibility: "public",
  },
  {
    id: "p2",
    user_id: "2",
    content:
      "Tips! Frys in mat innan bebisen kommer. Vi hade aldrig klarat forsta manaden annars.",
    created_at: "2025-02-02T12:30:00",
    likes: 45,
    comments: 12,
    visibility: "public",
  },
  {
    id: "p3",
    user_id: "3",
    content:
      "Nagon i Goteborg som vill hanga pa gravidyoga?",
    created_at: "2025-02-03T09:15:00",
    likes: 18,
    comments: 3,
    visibility: "public",
  },
];

export const MOCK_CONVERSATIONS = [
  {
    id: "conv1",
    other_user_id: "2",
    last_message: "Ses pa foraldrafikan?",
    last_message_time: "2025-02-02T10:00:00",
    unread: 1,
  },
  {
    id: "conv2",
    other_user_id: "3",
    last_message: "Tack for tipset!",
    last_message_time: "2025-02-01T18:20:00",
    unread: 0,
  },
];

export const MOCK_MESSAGES = {
  conv1: [
    {
      id: "m1",
      sender_id: "2",
      text: "Hej! Ses pa foraldrafikan?",
      created_at: "2025-02-02T09:50:00",
    },
  ],
  conv2: [
    {
      id: "m2",
      sender_id: "3",
      text: "Tack for tipset!",
      created_at: "2025-02-01T18:15:00",
    },
  ],
};

export const MOCK_COMMENTS = {
  p1: [
    {
      id: "c1",
      user_id: "2",
      text: "Ja! Babymoov Doomoo ar fantastisk.",
      created_at: "2025-02-01T11:00:00",
    },
  ],
  p2: [
    {
      id: "c2",
      user_id: "1",
      text: "Haller med! Vi gjorde samma.",
      created_at: "2025-02-02T13:00:00",
    },
  ],
  p3: [],
};

export const SCB_STATS = {
  births_2024_total: 98451,
  births_2024_boys: 50636,
  births_2024_girls: 47815,
  boys_per_100_girls: 106,
};

export const POPULAR_NAMES_2024 = {
  girls: ["Alma", "Olivia", "Vera"],
  boys: ["Noah", "William", "Liam"],
};

export const SCB_BIRTHS_2024_MONTHS = [
  { month: "Januari", count: 7935 },
  { month: "Februari", count: 7913 },
  { month: "Mars", count: 8778 },
  { month: "April", count: 8553 },
  { month: "Maj", count: 8937 },
  { month: "Juni", count: 8437 },
  { month: "Juli", count: 8887 },
  { month: "Augusti", count: 8652 },
  { month: "September", count: 7940 },
  { month: "Oktober", count: 8174 },
  { month: "November", count: 7264 },
  { month: "December", count: 6981 },
];

export const COMMUNITY_STATS = {
  total_members: 1246,
  births_2024: SCB_STATS.births_2024_total,
  births_boys: SCB_STATS.births_2024_boys,
  births_girls: SCB_STATS.births_2024_girls,
};

export const MONTH_GUIDE = [
  { month: "Januari", summary: "Stenbocken: struktur, talamod och lugn start." },
  { month: "Februari", summary: "Vattumannen: nyfikenhet, rutiner och ideer." },
  { month: "Mars", summary: "Fiskarna: mjukhet, empati och kreativitet." },
  { month: "April", summary: "Vaderen: energi, mod och tempo." },
  { month: "Maj", summary: "Oxen: trygghet, stabilitet och narhet." },
  { month: "Juni", summary: "Tvillingarna: nyfikenhet och socialitet." },
  { month: "Juli", summary: "Kraftan: omsorg och starka band." },
  { month: "Augusti", summary: "Lejonet: varme, stolthet och lek." },
  { month: "September", summary: "Jungfrun: struktur och omtanke." },
  { month: "Oktober", summary: "Vagen: balans och harmoni." },
  { month: "November", summary: "Skorpionen: intensitet och styrka." },
  { month: "December", summary: "Skytten: nyfikenhet och optimism." },
];

export const MOCK_CELEB_PREGNANCIES = [
  {
    id: "ce1",
    name: "Kandis A",
    status: "Bekraftad",
    due_window: "Hosten 2026",
    source: "Offentlig intervju",
    updated_at: "2026-02-10",
  },
  {
    id: "ce2",
    name: "Kandis B",
    status: "Bekraftad",
    due_window: "Sommaren 2026",
    source: "Sociala medier",
    updated_at: "2026-02-08",
  },
  {
    id: "ce3",
    name: "Kandis C",
    status: "Rykte",
    due_window: "Okant",
    source: "Tips fran anvandare",
    updated_at: "2026-02-07",
  },
];
