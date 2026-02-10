// ============================================================================
// KNOTTZ - Den svenska plattformen för blivande föräldrar
// ============================================================================
// En social plattform för graviditet & föräldraskap med fokus på hållbarhet,
// gemenskap och kunskapsdelning. Knyt samman föräldrar lokalt och globalt!
// ============================================================================

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Heart, MessageCircle, Plus, Send, Edit, Search, Image as ImageIcon, Settings, LogOut } from 'lucide-react';

// Mock data - i produktionen kommer detta från Supabase
const MOCK_USERS = [
  {
    id: '1',
    username: 'anna_svensson',
    full_name: 'Anna Svensson',
    bio: 'Första barnet, nervös men glad.',
    due_date: '2025-08-15',
    current_week: 24,
    avatar_url: 'AS',
    location: 'Stockholm',
    household_name: 'Familjen Svensson',
    is_new_pregnancy: true,
  },
  {
    id: '2',
    username: 'erik_berg',
    full_name: 'Erik Berg',
    bio: 'Pappa för andra gången, nu med tvillingar.',
    due_date: '2025-09-20',
    current_week: 20,
    avatar_url: 'EB',
    location: 'Malmö',
    household_name: 'Familjen Berg',
    is_new_pregnancy: false,
  },
  {
    id: '3',
    username: 'sara_lindgren',
    full_name: 'Sara Lindgren',
    bio: 'Älskar att dela tips om graviditet.',
    due_date: '2025-07-10',
    current_week: 28,
    avatar_url: 'SL',
    location: 'Göteborg',
    household_name: 'Lindgren & Co',
    is_new_pregnancy: false,
  },
  {
    id: '4',
    username: 'johan_karlsson',
    full_name: 'Johan Karlsson',
    bio: 'Väntande pappa från Göteborg',
    due_date: '2025-10-05',
    current_week: 16,
    avatar_url: 'JK',
    location: 'Göteborg',
    household_name: 'Familjen Karlsson',
    is_new_pregnancy: true,
  },
];

// Mock groups
const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Göteborg Föräldrar 2025',
    description: 'För alla som väntar barn i Göteborg',
    icon: '🏙️',
    members: 47,
    is_member: true,
    new_posts: 3,
  },
  {
    id: 'g2',
    name: 'Tvillingar & Trillingar',
    description: 'Support och tips för flerbarnsföräldrar',
    icon: '👶👶',
    members: 23,
    is_member: false,
    new_posts: 0,
  },
  {
    id: 'g3',
    name: 'Förstföderskor Sverige',
    description: 'För dig som väntar ditt första barn',
    icon: '🌟',
    members: 156,
    is_member: true,
    new_posts: 2,
  },
  {
    id: 'g4',
    name: 'HBTQ Föräldrar',
    description: 'Community för HBTQ familjer',
    icon: '🌈',
    members: 34,
    is_member: false,
    new_posts: 1,
  },
  {
    id: 'g5',
    name: 'Promenad & Träning',
    description: 'Tips och grupp för aktiva gravida',
    icon: '🏃‍♀️',
    members: 89,
    is_member: true,
    new_posts: 0,
  },
];

// Mock Must Haves (Produktrekommendationer)
const MOCK_MUST_HAVES = [
  {
    id: 'mh1',
    title: 'Najell Babynest',
    description: 'Perfekt för nyfödda att sova i. Portabel och skön!',
    category: '🍼 Bebis',
    price_range: 'Mellan (800-1200 kr)',
    upvotes: 847,
    downvotes: 23,
    verified_count: 512,
    reviews_count: 54,
    created_by: '3',
    created_at: '2025-01-15T10:00:00',
  },
  {
    id: 'mh2',
    title: 'Ergobaby Bärsele',
    description: 'Ergonomisk bärsele som både du och bebisen älskar',
    category: '🚗 Transport',
    price_range: 'Hög (1500+ kr)',
    upvotes: 723,
    downvotes: 15,
    verified_count: 401,
    reviews_count: 38,
    created_by: '2',
    created_at: '2025-01-10T14:30:00',
  },
  {
    id: 'mh3',
    title: 'Medela Bröstpump',
    description: 'Bästa elektriska bröstpumpen för amning',
    category: '🤱 För mamman',
    price_range: 'Hög (2000+ kr)',
    upvotes: 634,
    downvotes: 45,
    verified_count: 298,
    reviews_count: 67,
    created_by: '1',
    created_at: '2025-01-20T09:15:00',
  },
  {
    id: 'mh4',
    title: 'Ikea Antilop Barnstol',
    description: 'Billig, praktisk och lätt att göra ren!',
    category: '🏠 Hemma',
    price_range: 'Låg (under 500 kr)',
    upvotes: 892,
    downvotes: 8,
    verified_count: 645,
    reviews_count: 42,
    created_by: '4',
    created_at: '2025-01-05T16:20:00',
  },
];

// Mock Tips & Tricks
const MOCK_TIPS = [
  {
    id: 't1',
    title: 'Ha alltid extra kläder i bilen',
    content: 'Efter en blöjexplosion på E4:an lärde jag mig detta. Packa en liten väska med: body, byxor, strumpor, filt och skötunderlägg. Spara dig själv från panik!',
    category: '📦 BB-tips',
    tags: ['Första månaden', 'Transport'],
    upvotes: 1243,
    helpful_count: 891,
    comments_count: 124,
    created_by: '3',
    created_at: '2025-01-25T11:00:00',
  },
  {
    id: 't2',
    title: 'Spellista för förlossningen',
    content: 'Gör din egen spellista INNAN du åker till BB! Jag körde med lugn musik (Enya, Sigur Rós) och det hjälpte mig så mycket att fokusera. Testa flera listor under graviditeten för att hitta din favorit.',
    category: '🎵 Spellistor',
    tags: ['Förlossning', 'Förberedelser'],
    upvotes: 856,
    helpful_count: 612,
    comments_count: 89,
    created_by: '1',
    created_at: '2025-01-18T15:30:00',
  },
  {
    id: 't3',
    title: 'Frys in måltider INNAN bebisen kommer',
    content: 'Bästa tipset jag fick! Vecka 35-38, laga dubbla portioner och frys in. Vi levde på detta i 2 månader. Lasagne, köttfärssås, soppor - allt som går att värma snabbt.',
    category: '🍽️ Mat & Förberedelser',
    tags: ['Förberedelser', 'Praktiskt'],
    upvotes: 1456,
    helpful_count: 1089,
    comments_count: 156,
    created_by: '2',
    created_at: '2025-02-01T09:45:00',
  },
];

// Mock Blog articles (guest access)
const MOCK_BLOGS = [
  {
    id: 'b1',
    title: 'Första veckorna: vad är normalt?',
    excerpt: 'En kort guide om vanliga känslor, sömn och rutiner de första veckorna.',
    created_at: '2025-02-02T08:00:00',
  },
  {
    id: 'b2',
    title: 'Checklista inför BB',
    excerpt: 'En praktisk checklista som hjälper er att packa smart och lugnt.',
    created_at: '2025-01-28T10:30:00',
  },
  {
    id: 'b3',
    title: 'Så pratar ni om förväntningar som par',
    excerpt: 'Kommunikation, roller och planering inför den nya vardagen.',
    created_at: '2025-01-20T14:15:00',
  },
];

const MOCK_SCREENSHOTS = [
  { id: 's1', title: 'Flödet', src: '/mock-feed.svg' },
  { id: 's2', title: 'Vänner som väntar', src: '/mock-friends.svg' },
  { id: 's3', title: 'Övrigt · Grupper', src: '/mock-groups.svg' },
  { id: 's4', title: 'Din profil', src: '/mock-profile.svg' },
];

const MOCK_FRIEND_SUGGESTIONS = [
  { id: 'fs1', name: 'Elsa Nyström', mutuals: 4 },
  { id: 'fs2', name: 'Lukas Holm', mutuals: 2 },
  { id: 'fs3', name: 'Maja Ek', mutuals: 5 },
];

const MOCK_SAVED_POSTS = [
  { id: 'sp1', title: 'Checklistan inför BB', type: 'Tips', created_at: '2025-01-28' },
  { id: 'sp2', title: 'Bästa babynestet 2024', type: 'Must have', created_at: '2025-02-02' },
];
// Mock Giveaways (Skänk bort)
const MOCK_GIVEAWAYS = [
  {
    id: 'ga1',
    title: 'Babykläder 0-3 mån (20 delar)',
    description: 'Välskött! Bodies, pyjamas, byxor. Mestadels från H&M och Lindex. Tvättade och redo att hämtas.',
    category: '👶 Kläder',
    condition: 'Mycket bra skick',
    location: 'Göteborg (Majorna)',
    images: ['📦'],
    created_by: '3',
    claimed: false,
    created_at: '2025-02-04T10:00:00',
  },
  {
    id: 'ga2',
    title: 'Babysitter från BABYBJÖRN',
    description: 'Knappt använd, vår bebis ville inte sitta i den. Grå färg, inga fläckar.',
    category: '🏠 Utrustning',
    condition: 'Som ny',
    location: 'Stockholm (Södermalm)',
    images: ['🪑'],
    created_by: '1',
    claimed: true,
    claimed_by: '4',
    created_at: '2025-02-03T14:20:00',
  },
  {
    id: 'ga3',
    title: 'Graviditetskläder stl M',
    description: '5 par jeans, 3 toppar, 1 klänning. Varumärken: H&M Mama, Lindex. Lite använda men fint skick.',
    category: '🤰 Graviditet',
    condition: 'Bra skick',
    location: 'Malmö (Västra Hamnen)',
    images: ['👗'],
    created_by: '2',
    claimed: false,
    created_at: '2025-02-02T16:45:00',
  },
  {
    id: 'ga4',
    title: 'Amningskuddar (2 st)',
    description: 'Två amningskuddar med tvättbara överdrag. Från Jollyroom. Inga fläckar.',
    category: '🤱 Amning',
    condition: 'Bra skick',
    location: 'Uppsala',
    images: ['🛏️'],
    created_by: '4',
    claimed: false,
    created_at: '2025-02-01T12:30:00',
  },
];

// Mock Dad Jokes
const MOCK_DAD_JOKES = [
  {
    id: 'dj1',
    joke: 'Vad säger en bebis när den ser sin pappa för första gången?',
    punchline: 'Goo-goo ga-ga-ga-enial! 👶',
    upvotes: 234,
    downvotes: 12,
    created_by: '2',
    created_at: '2025-02-05T09:00:00',
  },
  {
    id: 'dj2',
    joke: 'Varför tar gravida kvinnor alltid med sig en penna?',
    punchline: 'För att rita ut sin framtid! ✏️',
    upvotes: 189,
    downvotes: 23,
    created_by: '4',
    created_at: '2025-02-04T15:30:00',
  },
  {
    id: 'dj3',
    joke: 'Vad kallar man en bebis som kan programmera?',
    punchline: 'Baby-thon utvecklare! 👶💻',
    upvotes: 312,
    downvotes: 8,
    created_by: '2',
    created_at: '2025-02-03T11:20:00',
  },
  {
    id: 'dj4',
    joke: 'Varför har gravida kvinnor alltid rätt?',
    punchline: 'För att de bokstavligen formar framtiden! 🤰',
    upvotes: 445,
    downvotes: 15,
    created_by: '1',
    created_at: '2025-02-02T14:00:00',
  },
  {
    id: 'dj5',
    joke: 'Vad är en papas favorit-musik efter bebisen kommer?',
    punchline: 'Rock-a-by baby! 🎵',
    upvotes: 267,
    downvotes: 19,
    created_by: '4',
    created_at: '2025-02-01T10:15:00',
  },
];

// SCB/Skatteverket statistik (2024)
const SCB_STATS = {
  births_2024_total: 98451,
  births_2024_boys: 50636,
  births_2024_girls: 47815,
  boys_per_100_girls: 106,
};

const POPULAR_NAMES_2024 = {
  girls: ['Alma', 'Olivia', 'Vera'],
  boys: ['Noah', 'William', 'Liam'],
};

const SCB_BIRTHS_2024_MONTHS = [
  { month: 'Januari', count: 7935 },
  { month: 'Februari', count: 7913 },
  { month: 'Mars', count: 8778 },
  { month: 'April', count: 8553 },
  { month: 'Maj', count: 8937 },
  { month: 'Juni', count: 8437 },
  { month: 'Juli', count: 8887 },
  { month: 'Augusti', count: 8652 },
  { month: 'September', count: 7940 },
  { month: 'Oktober', count: 8174 },
  { month: 'November', count: 7264 },
  { month: 'December', count: 6981 },
];

// Community stats (visas i appen)
const COMMUNITY_STATS = {
  total_members: 1246,
  births_2024: SCB_STATS.births_2024_total,
  births_boys: SCB_STATS.births_2024_boys,
  births_girls: SCB_STATS.births_2024_girls,
};

const MONTH_GUIDE = [
  { month: 'Januari', summary: 'Stenbocken: struktur, tålamod och lugn start.' },
  { month: 'Februari', summary: 'Vattumannen: nyfikenhet, rutiner och idéer.' },
  { month: 'Mars', summary: 'Fiskarna/Väduren: känslor, energi och omtanke.' },
  { month: 'April', summary: 'Väduren: mod, snabb utveckling och aktivitet.' },
  { month: 'Maj', summary: 'Oxen: trygghet, närhet och stabilitet.' },
  { month: 'Juni', summary: 'Tvillingarna: kommunikation och nyfikenhet.' },
  { month: 'Juli', summary: 'Kräftan: tryggt hem, mjuka rutiner.' },
  { month: 'Augusti', summary: 'Lejonet: värme, lek och självkänsla.' },
  { month: 'September', summary: 'Jungfrun: ordning, små vanor som sitter.' },
  { month: 'Oktober', summary: 'Vågen: balans, harmoni och gemenskap.' },
  { month: 'November', summary: 'Skorpionen: djup närhet och fokus.' },
  { month: 'December', summary: 'Skytten: nyfikenhet, glädje och upptäckarlust.' },
];

const MOCK_POSTS = [
  {
    id: '1',
    user_id: '3',
    content: 'Någon mer som inte kan sluta äta pickles? Cravinget är på en helt annan nivå nu.',
    likes_count: 12,
    comments_count: 5,
    created_at: '2025-02-05T10:30:00',
    liked_by_me: false,
    visibility: 'public',
    media: [],
  },
  {
    id: '2',
    user_id: '1',
    content: 'Första sparken idag! Kan inte beskriva känslan. Det blev så verkligt helt plötsligt.',
    likes_count: 28,
    comments_count: 8,
    created_at: '2025-02-05T09:15:00',
    liked_by_me: true,
    visibility: 'public',
    media: [],
  },
  {
    id: '3',
    user_id: '2',
    content: 'Tips på bra barnvagnar för tvillingar? Vi är helt vilse i djungeln av alternativ.',
    likes_count: 7,
    comments_count: 12,
    created_at: '2025-02-04T18:45:00',
    liked_by_me: false,
    visibility: 'public',
    media: [],
  },
];

// Mock conversations (direktmeddelanden)
const MOCK_CONVERSATIONS = [
  {
    id: 'conv1',
    other_user_id: '3',
    last_message: 'Tack för tipset om barnvagnen!',
    last_message_time: '2025-02-05T11:00:00',
    unread: 2,
  },
  {
    id: 'conv2',
    other_user_id: '2',
    last_message: 'Ja precis, jag kände samma sak vecka 20!',
    last_message_time: '2025-02-04T16:30:00',
    unread: 0,
  },
];

const MOCK_MESSAGES = {
  'conv1': [
    { id: 'm1', sender_id: '3', content: 'Hej! Såg att du också väntar barn i augusti?', created_at: '2025-02-05T10:00:00' },
    { id: 'm2', sender_id: '1', content: 'Ja! Så spännande!', created_at: '2025-02-05T10:15:00' },
    { id: 'm3', sender_id: '3', content: 'Vilken barnvagn tittar du på?', created_at: '2025-02-05T10:20:00' },
    { id: 'm4', sender_id: '1', content: 'Vi tänkte kolla på Emmaljunga. Du då?', created_at: '2025-02-05T10:45:00' },
    { id: 'm5', sender_id: '3', content: 'Tack för tipset om barnvagnen!', created_at: '2025-02-05T11:00:00' },
  ],
  'conv2': [
    { id: 'm6', sender_id: '2', content: 'Hur mår du?', created_at: '2025-02-04T15:00:00' },
    { id: 'm7', sender_id: '1', content: 'Ganska bra! Lite illamående fortfarande', created_at: '2025-02-04T15:30:00' },
    { id: 'm8', sender_id: '2', content: 'Ja precis, jag kände samma sak vecka 20!', created_at: '2025-02-04T16:30:00' },
  ],
};

const MOCK_COMMENTS = {
  '1': [
    { id: 'c1', user_id: '1', content: 'Haha samma här! Pickles och glass.', created_at: '2025-02-05T11:00:00' },
    { id: 'c2', user_id: '4', content: 'För mig är det chipsen som gäller', created_at: '2025-02-05T11:30:00' },
  ],
  '2': [
    { id: 'c3', user_id: '3', content: 'Grattis! Så magiskt!', created_at: '2025-02-05T09:30:00' },
    { id: 'c4', user_id: '2', content: 'Underbart! Minns den känslan', created_at: '2025-02-05T10:00:00' },
  ],
  '3': [
    { id: 'c5', user_id: '3', content: 'Vi har Bugaboo Donkey - jättebra!', created_at: '2025-02-04T19:00:00' },
  ],
};

export default function KnottzApp() {
  const INVITE_REQUIRED = true; // Invite-only for signup
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    full_name: '',
    bio: '',
    due_date: '',
    current_week: 0,
    avatar_url: '',
    location: '',
    household_name: '',
    personal_number: '',
    is_new_pregnancy: false,
  });
  const [view, setView] = useState('auth'); // auth, guest, feed, groups, profile, musthaves, tips, post, user
  const [previousView, setPreviousView] = useState('feed');
  const [detailId, setDetailId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [inviteStatus, setInviteStatus] = useState({ hasInvite: false, code: '' });
  const [inviteInput, setInviteInput] = useState('');
  const [inviteCodes, setInviteCodes] = useState([]);
  const [inviteVerified, setInviteVerified] = useState(false);
  const [accountType, setAccountType] = useState('family'); // family, solo
  const [profilePrivacy, setProfilePrivacy] = useState('public'); // public, private
  const [householdName, setHouseholdName] = useState('');
  const [parentOne, setParentOne] = useState('');
  const [parentTwo, setParentTwo] = useState('');
  const [expectedDueDate, setExpectedDueDate] = useState('');
  const [existingChildren, setExistingChildren] = useState([{ name: '', birthDate: '' }]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const pendingSignupKey = 'knottz_pending_signup';
  const [menuOpen, setMenuOpen] = useState(false);
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  const [authUserId, setAuthUserId] = useState(null);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [following, setFollowing] = useState(['2', '3']); // Anna följer Erik och Sara
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostVisibility, setNewPostVisibility] = useState('public');
  const [newPostMedia, setNewPostMedia] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [savedPosts, setSavedPosts] = useState(MOCK_SAVED_POSTS);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [mustHaveVotes, setMustHaveVotes] = useState({});
  const [tipVotes, setTipVotes] = useState({});
  const [mustHaveRequests, setMustHaveRequests] = useState([]);
  const [mustHaveCategory, setMustHaveCategory] = useState('Alla');
  const [scbPanel, setScbPanel] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSendStatus, setInviteSendStatus] = useState('');
  
  // New features
  const [mustHaves, setMustHaves] = useState(MOCK_MUST_HAVES);
  const [tips, setTips] = useState(MOCK_TIPS);
  const [giveaways, setGiveaways] = useState(MOCK_GIVEAWAYS);
  const [dadJokes, setDadJokes] = useState(MOCK_DAD_JOKES);
  const [showPunchline, setShowPunchline] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [profileTab, setProfileTab] = useState('posts'); // posts, messages, friends

  // Beräkna månad från due_date
  const getDueMonth = (dueDate) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      localStorage.setItem('knottz_invite', invite);
      setInviteStatus({ hasInvite: true, code: invite });
      setInviteInput(invite);
      setAuthMode('signup');
      if (!isAuthenticated) setView('auth');
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    const stored = localStorage.getItem('knottz_invite');
    if (stored) {
      setInviteStatus({ hasInvite: true, code: stored });
    }
  }, []);

  useEffect(() => {
    const storedPrivacy = localStorage.getItem('knottz_privacy');
    if (storedPrivacy === 'public' || storedPrivacy === 'private') {
      setProfilePrivacy(storedPrivacy);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('knottz_privacy', profilePrivacy);
  }, [profilePrivacy]);

  useEffect(() => {
    setNewPostVisibility(profilePrivacy);
  }, [profilePrivacy]);

  const mapProfileToUser = (profile) => {
    const username = profile?.email ? profile.email.split('@')[0] : 'knottz';
    const expectedDate = profile?.expected_due_date || profile?.due_date || null;
    const currentWeek = expectedDate ? Math.max(1, Math.min(40, Math.floor((280 - ((new Date(expectedDate) - new Date()) / 86400000)) / 7))) : 20;
    return {
      id: profile?.user_id || profile?.id,
      username,
      full_name: profile?.display_name || username,
      bio: profile?.bio || '',
      due_date: expectedDate,
      current_week: currentWeek,
      avatar_url: profile?.avatar_url || '',
      location: profile?.location || '',
      household_name: profile?.household_name || '',
      personal_number: profile?.personal_number || '',
      is_private: profile?.is_private || false,
      is_new_pregnancy: true,
    };
  };

  const loadProfiles = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('profiles')
      .select('id,user_id,email,display_name,bio,avatar_url,location,expected_due_date,household_name,is_private,personal_number');
    if (data && data.length) {
      setUsers(data.map(mapProfileToUser));
    }
  };

  const loadFollowing = async (userId) => {
    if (!supabase || !userId) return;
    const { data } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', userId);
    if (data) {
      setFollowing(data.map(row => row.followee_id));
    }
  };

  const loadCurrentProfile = async (userId) => {
    if (!supabase || !userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('id,user_id,email,display_name,bio,avatar_url,location,expected_due_date,household_name,is_private,personal_number')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      const mapped = mapProfileToUser(data);
      setCurrentUser(mapped);
      setProfilePrivacy(data.is_private ? 'private' : 'public');
      return mapped;
    }
  };

  const ensureProfileFromPending = async (user) => {
    if (!supabase || !user) return;
    const pendingRaw = localStorage.getItem(pendingSignupKey);
    if (!pendingRaw) return;
    const pending = JSON.parse(pendingRaw);

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (existing) {
      localStorage.removeItem(pendingSignupKey);
      return;
    }

    const household = {
      name: pending.householdName || `Hushåll ${pending.parentOne || 'Ny'}`,
      account_type: pending.accountType || 'family',
      parent1_name: pending.parentOne || null,
      parent2_name: pending.parentTwo || null,
    };
    const { data: householdRow, error: householdErr } = await supabase
      .from('households')
      .insert(household)
      .select('id')
      .single();
    if (householdErr) return;

    let inviteRow = null;
    if (INVITE_REQUIRED && pending.inviteInput) {
      const { data } = await supabase
        .from('invites')
        .select('id, created_by, redeemed_at')
        .eq('code', pending.inviteInput)
        .maybeSingle();
      inviteRow = data;
    }

    const profile = {
      id: user.id,
      user_id: user.id,
      household_id: householdRow.id,
      email: pending.authEmail || user.email,
      display_name: pending.parentOne || pending.householdName || user.email,
      bio: '',
      avatar_url: '',
      expected_due_date: pending.expectedDueDate || null,
      location: '',
      household_name: pending.householdName || '',
      is_private: pending.profilePrivacy === 'private',
      personal_number: '',
      inviter_id: inviteRow?.created_by || null,
      is_admin: adminEmails.includes(pending.authEmail || user.email),
    };
    const { error: profileErr } = await supabase.from('profiles').insert(profile);
    if (profileErr) return;

    const childrenRows = (pending.existingChildren || [])
      .filter((c) => c.birthDate)
      .map((c) => ({
        household_id: householdRow.id,
        name: c.name || '',
        birth_date: c.birthDate,
      }));
    if (childrenRows.length > 0) {
      await supabase.from('children').insert(childrenRows);
    }

    if (INVITE_REQUIRED && inviteRow?.id) {
      await supabase
        .from('invites')
        .update({ redeemed_at: new Date().toISOString(), redeemed_by: user.id })
        .eq('code', pending.inviteInput);
    }

    const initialCodes = Array.from({ length: 3 }).map(() => `KNOTTZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    await supabase.from('invites').insert(
      initialCodes.map(code => ({ code, created_by: user.id }))
    );
    setInviteCodes(initialCodes);
    localStorage.setItem('knottz_invite_codes', JSON.stringify(initialCodes));

    localStorage.removeItem(pendingSignupKey);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const session = data.session;
        setAuthEmail(session.user.email || '');
        setAuthUserId(session.user.id);
        setIsAuthenticated(true);
        await ensureProfileFromPending(session.user);
        const profile = await loadCurrentProfile(session.user.id);
        await loadProfiles();
        await loadFollowing(session.user.id);
        const complete = profile ? Boolean(
          profile.full_name && profile.personal_number && profile.bio && profile.avatar_url && profile.due_date
        ) : false;
        setView(complete ? 'feed' : 'profile');
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setAuthEmail(session.user.email || '');
        setAuthUserId(session.user.id);
        setIsAuthenticated(true);
        await ensureProfileFromPending(session.user);
        const profile = await loadCurrentProfile(session.user.id);
        await loadProfiles();
        await loadFollowing(session.user.id);
        const complete = profile ? Boolean(
          profile.full_name && profile.personal_number && profile.bio && profile.avatar_url && profile.due_date
        ) : false;
        setView(complete ? 'feed' : 'profile');
      } else {
        setIsAuthenticated(false);
        setAuthUserId(null);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const onboarded = localStorage.getItem('knottz_onboarded');
    if (!onboarded) {
      setView('profile');
      setShowQuickStart(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setMenuOpen(false);
  }, [view]);

  useEffect(() => {
    const storedCodes = JSON.parse(localStorage.getItem('knottz_invite_codes') || '[]');
    setInviteCodes(storedCodes);
  }, []);

  useEffect(() => {
    const verifyInvite = async () => {
      if (!INVITE_REQUIRED || !inviteStatus.code) return;
      if (!supabase) return;
      const { data } = await supabase
        .from('invites')
        .select('id, redeemed_at')
        .eq('code', inviteStatus.code)
        .maybeSingle();
      if (!data || data.redeemed_at) {
        setInviteStatus({ hasInvite: false, code: '' });
        localStorage.removeItem('knottz_invite');
      }
    };
    verifyInvite();
  }, [inviteStatus.code]);

  const searchLower = searchTerm.trim().toLowerCase();
  const filteredPosts = posts.filter(post => {
    if (!searchLower) return true;
    const author = getUser(post.user_id);
    return (
      post.content.toLowerCase().includes(searchLower) ||
      author.full_name.toLowerCase().includes(searchLower) ||
      author.username.toLowerCase().includes(searchLower)
    );
  });

  const filteredUsers = users.filter(user =>
    searchLower &&
    (user.full_name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      (user.household_name || '').toLowerCase().includes(searchLower))
  );

  const mustHaveCategories = ['Alla', ...new Set(mustHaves.map(item => item.category))];
  const filteredMustHaves = mustHaveCategory === 'Alla'
    ? mustHaves
    : mustHaves.filter(item => item.category === mustHaveCategory);

  const trendingMustHaves = [...mustHaves]
    .sort((a, b) => (b.upvotes + b.verified_count * 2) - (a.upvotes + a.verified_count * 2))
    .slice(0, 3);

  const trendingTips = [...tips]
    .sort((a, b) => (b.upvotes + b.helpful_count) - (a.upvotes + a.helpful_count))
    .slice(0, 3);

  const myPostsCount = posts.filter(p => p.user_id === currentUser.id).length;
  const myGroupsCount = groups.filter(g => g.is_member).length;
  const votePoints = Object.keys(tipVotes).length * 1 + Object.keys(mustHaveVotes).length * 2;
  const myActivityScore = myPostsCount * 2 + myGroupsCount * 2 + votePoints;
  const baseInvites = 3;
  const earnedInvites = Math.floor(myActivityScore / 10);
  const isAdminUser = adminEmails.includes(authEmail);
  const invitesAvailable = isAdminUser ? Infinity : (inviteVerified ? baseInvites + earnedInvites : 0);

  // Hantera like/unlike
  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked_by_me: !post.liked_by_me,
          likes_count: post.liked_by_me ? post.likes_count - 1 : post.likes_count + 1,
        };
      }
      return post;
    }));
  };

  // Skapa nytt inlägg
  const createPost = () => {
    if (!canInteract) return;
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      user_id: currentUser.id,
      content: newPostContent,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      liked_by_me: false,
      visibility: newPostVisibility,
      media: newPostMedia,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostMedia([]);
    setShowNewPost(false);
  };

  // Följ/avfölja användare
  const toggleFollow = async (userId) => {
    if (following.includes(userId)) {
      setFollowing(following.filter(id => id !== userId));
      if (supabase && authUserId) {
        await supabase.from('follows').delete().eq('follower_id', authUserId).eq('followee_id', userId);
      }
    } else {
      setFollowing([...following, userId]);
      if (supabase && authUserId) {
        await supabase.from('follows').insert({ follower_id: authUserId, followee_id: userId });
      }
    }
  };

  // Lägg till kommentar
  const addComment = (postId) => {
    if (!canInteract) return;
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user_id: currentUser.id,
      content: newComment,
      created_at: new Date().toISOString(),
    };
    
    setComments({
      ...comments,
      [postId]: [...(comments[postId] || []), comment],
    });
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments_count: post.comments_count + 1 }
        : post
    ));
    
    setNewComment('');
  };

  // Formatera tid
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m sedan`;
    if (hours < 24) return `${hours}h sedan`;
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  // Hämta användarinfo
  const getUser = (userId) => users.find(u => u.id === userId);

  const isImageUrl = (value) => typeof value === 'string' && (value.startsWith('data:') || value.startsWith('http') || value.includes('.png') || value.includes('.jpg'));

  const renderAvatar = (user, size = 40) => {
    if (isImageUrl(user.avatar_url)) {
      return (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        />
      );
    }
    const initials = (user.full_name || user.username || 'KN')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#f1f5f9',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 700,
          fontSize: size * 0.4,
          color: '#111827',
        }}
      >
        {initials}
      </div>
    );
  };

  const isProfileComplete = () => {
    return Boolean(
      currentUser.full_name &&
      currentUser.personal_number &&
      currentUser.bio &&
      currentUser.avatar_url &&
      currentUser.due_date
    );
  };

  const canInteract = isAuthenticated && isProfileComplete();

  const handleNewPostMedia = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, url: reader.result, type: file.type });
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then((items) => {
      setNewPostMedia(items.slice(0, 4));
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextUrl = reader.result;
      setCurrentUser(prev => ({ ...prev, avatar_url: nextUrl }));
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? { ...u, avatar_url: nextUrl } : u)));
    };
    reader.readAsDataURL(file);
  };

  const openDetail = (nextView, id = null) => {
    setPreviousView(view);
    setDetailId(id);
    setView(nextView);
  };

  const backToPrevious = () => {
    setView(previousView || 'feed');
    setDetailId(null);
  };

  const openUserProfile = (userId) => {
    setPreviousView(view);
    setDetailId(userId);
    setView('user');
  };

  const signIn = async () => {
    setAuthError('');
    setAuthNotice('');
    if (!supabase) return setAuthError('Supabase saknas');
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) setAuthError('Fel e-post eller lösenord');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setView('auth');
  };

  const signUp = async () => {
    setAuthError('');
    setAuthNotice('');
    if (!supabase) return setAuthError('Supabase saknas');
    const isAdminEmail = adminEmails.includes(authEmail);
    const effectiveInvite = inviteInput || inviteStatus.code;
    if (INVITE_REQUIRED && !canUseInvite(effectiveInvite) && !isAdminEmail) {
      return setAuthError('Ogiltig inbjudningskod');
    }

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error || !data.user) return setAuthError('Kunde inte skapa konto');
    const pendingPayload = {
      inviteInput: effectiveInvite,
      accountType,
      householdName,
      parentOne,
      parentTwo,
      expectedDueDate,
      existingChildren,
      profilePrivacy,
      authEmail,
    };
    localStorage.setItem(pendingSignupKey, JSON.stringify(pendingPayload));
    setAuthNotice('Verifiera via e‑post för att slutföra din registrering.');
    return;
  };

  const generateInviteCode = async () => {
    const code = `KNOTTZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const updated = isAdminUser ? [...inviteCodes, code] : [...inviteCodes, code].slice(0, invitesAvailable);
    setInviteCodes(updated);
    localStorage.setItem('knottz_invite_codes', JSON.stringify(updated));
    if (supabase) {
      const { data: sessionData } = await supabase.auth.getUser();
      await supabase.from('invites').insert({
        code,
        created_by: sessionData?.user?.id || null,
      });
    }
  };

  const canUseInvite = (code) => {
    if (!code) return false;
    if (inviteCodes.includes(code)) return true;
    return code === inviteStatus.code;
  };

  // Gå med/lämna grupp
  const toggleGroupMembership = (groupId) => {
    if (!canInteract) return;
    setGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, is_member: !g.is_member, members: g.is_member ? g.members - 1 : g.members + 1 }
        : g
    ));
  };

  // Skicka meddelande
  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const message = {
      id: `m${Date.now()}`,
      sender_id: currentUser.id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };
    
    setMessages({
      ...messages,
      [activeConversation]: [...(messages[activeConversation] || []), message],
    });
    
    // Uppdatera senaste meddelandet i konversationen
    setConversations(conversations.map(conv => 
      conv.id === activeConversation
        ? { ...conv, last_message: newMessage, last_message_time: new Date().toISOString() }
        : conv
    ));
    
    setNewMessage('');
  };

  // Starta ny konversation
  const startConversation = (userId) => {
    const existingConv = conversations.find(c => c.other_user_id === userId);
    if (existingConv) {
      setActiveConversation(existingConv.id);
      setView('messages');
      return;
    }
    
    const newConv = {
      id: `conv${Date.now()}`,
      other_user_id: userId,
      last_message: '',
      last_message_time: new Date().toISOString(),
      unread: 0,
    };
    
    setConversations([newConv, ...conversations]);
    setMessages({ ...messages, [newConv.id]: [] });
    setActiveConversation(newConv.id);
    setView('messages');
  };

  // Toggle upvote for must haves
  const toggleMustHaveVote = (id, voteType) => {
    if (!canInteract) return;
    if (mustHaveVotes[id]) return;
    setMustHaves(mustHaves.map(item => {
      if (item.id === id) {
        if (voteType === 'up') {
          return { ...item, upvotes: item.upvotes + 1 };
        } else if (voteType === 'down') {
          return { ...item, downvotes: item.downvotes + 1 };
        } else if (voteType === 'verified') {
          return { ...item, verified_count: item.verified_count + 1 };
        }
      }
      return item;
    }));
    setMustHaveVotes({ ...mustHaveVotes, [id]: voteType });
  };

  // Toggle vote for tips
  const toggleTipVote = (id, voteType) => {
    if (!canInteract) return;
    if (tipVotes[id]) return;
    setTips(tips.map(tip => {
      if (tip.id === id) {
        if (voteType === 'up') {
          return { ...tip, upvotes: tip.upvotes + 1 };
        } else if (voteType === 'helpful') {
          return { ...tip, helpful_count: tip.helpful_count + 1 };
        }
      }
      return tip;
    }));
    setTipVotes({ ...tipVotes, [id]: voteType });
  };

  // Claim giveaway
  const claimGiveaway = (id) => {
    setGiveaways(giveaways.map(item => 
      item.id === id 
        ? { ...item, claimed: true, claimed_by: currentUser.id }
        : item
    ));
  };

  // Toggle dad joke vote
  const toggleJokeVote = (id, voteType) => {
    setDadJokes(dadJokes.map(joke => {
      if (joke.id === id) {
        if (voteType === 'up') {
          return { ...joke, upvotes: joke.upvotes + 1 };
        } else if (voteType === 'down') {
          return { ...joke, downvotes: joke.downvotes + 1 };
        }
      }
      return joke;
    }));
  };

  // Toggle punchline visibility
  const togglePunchline = (id) => {
    setShowPunchline({ ...showPunchline, [id]: !showPunchline[id] });
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --bg: #ffffff;
          --bg-strong: #f5f5f5;
          --card: #ffffff;
          --ink: #111111;
          --muted: #666666;
          --accent: #111111;
          --accent-strong: #000000;
          --accent-soft: #f3f3f3;
          --accent-gold: #d7b56d;
          --accent-mint: #8fc7b3;
          --border: #e5e5e5;
          --shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
          --shadow-soft: 0 4px 14px rgba(0, 0, 0, 0.05);
          --radius-lg: 18px;
          --radius-md: 12px;
          --radius-sm: 8px;
        }

        * { box-sizing: border-box; }
        body { margin: 0; }

        .app {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--ink);
        }

        .app-header {
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid var(--border);
          padding: 0.9rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(14px);
        }

        .app-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .app-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 2.1rem;
          color: var(--accent);
          font-style: italic;
          margin: 0;
        }

        .logo-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          background: white;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--accent-soft);
          padding: 0.4rem 0.75rem;
          border-radius: 999px;
          border: 1px solid var(--border);
        }
        .user-chip:hover { filter: brightness(0.98); }
        .menu-wrap { position: relative; }
        .menu-panel {
          position: absolute;
          right: 0;
          top: 120%;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          min-width: 220px;
          box-shadow: var(--shadow);
          padding: 0.5rem;
          z-index: 50;
        }
        .menu-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 0.7rem 0.9rem;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #111827;
        }
        .menu-item:hover { background: #f9fafb; }

        .app-nav {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 74px;
          z-index: 99;
        }

        .app-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1.5rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .nav-btn {
          padding: 0.85rem 1rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 999px;
          color: var(--muted);
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          position: relative;
        }
        .nav-btn[data-active="true"] {
          color: var(--ink);
          background: var(--accent-soft);
          border-color: var(--border);
        }

        .badge {
          position: absolute;
          top: -0.2rem;
          right: -0.1rem;
          background: var(--ink);
          color: white;
          border-radius: 999px;
          padding: 0.1rem 0.45rem;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .badge-inline {
          background: var(--ink);
          color: white;
          border-radius: 999px;
          padding: 0.1rem 0.45rem;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .app-main {
          max-width: 1100px;
          margin: 2rem auto 4rem;
          padding: 0 1.5rem;
        }

        .card {
          background: var(--card);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-soft);
        }

        .section {
          margin-bottom: 2rem;
        }
        .section-title {
          font-size: 1.6rem;
          margin-bottom: 0.4rem;
          letter-spacing: -0.01em;
        }
        .section-subtitle {
          color: var(--muted);
          margin-bottom: 1.2rem;
        }

        .stack { display: grid; gap: 1rem; }
        .grid-2 { display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-3 { display: grid; gap: 1rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .fade-in { animation: fadeInUp 0.5s ease both; }
        .pulse { animation: pulse 2.4s ease-in-out infinite; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(123,109,240,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(123,109,240,0.06); }
        }
        .soft-panel {
          background: var(--accent-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .search-bar {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          background: white;
          border: 2px solid var(--border);
          border-radius: 999px;
          padding: 0.4rem 0.75rem;
          box-shadow: var(--shadow-soft);
        }
        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 1rem;
          background: transparent;
          font-family: inherit;
        }

        .chip {
          background: var(--accent-soft);
          color: var(--accent);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.3rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .subnav {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stat-card {
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: white;
          display: grid;
          gap: 0.35rem;
        }
        .stat-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent);
        }

        .card-pad-lg { padding: 1.75rem; }
        .card-dashed {
          border: 2px dashed var(--border);
          background: #ffffff;
        }

        .card-strong {
          box-shadow: var(--shadow);
        }

        .card-border {
          border: 2px solid var(--border);
        }

        .btn {
          padding: 0.75rem 1.2rem;
          border-radius: 999px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.2s ease;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:disabled { cursor: not-allowed; opacity: 0.6; transform: none; }
        .btn-primary { background: var(--accent); color: white; }
        .btn-outline { background: white; color: var(--ink); border: 2px solid var(--border); }
        .btn-soft { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--border); }
        .btn-ghost { background: #f2f2f2; color: #444; }

        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--muted);
          font-weight: 600;
        }
        .icon-btn[data-active="true"] { color: var(--accent); }

        .input, .textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 2px solid var(--border);
          border-radius: 16px;
          font-size: 1rem;
          font-family: inherit;
        }
        .textarea { min-height: 110px; resize: vertical; }

        .pill {
          background: var(--accent-soft);
          color: var(--accent);
          border-radius: 999px;
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-block;
        }

        .messages-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1rem;
          height: 70vh;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: grid;
          place-items: center;
          z-index: 200;
          padding: 1.5rem;
        }
        .modal-card {
          background: #fff;
          border-radius: 20px;
          width: min(920px, 95vw);
          max-height: 90vh;
          overflow: auto;
          padding: 1.5rem;
          box-shadow: var(--shadow);
        }

        @media (max-width: 900px) {
          .app-main { max-width: 100%; }
          .messages-layout { grid-template-columns: 1fr; height: auto; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .app-header-inner { padding: 0 1rem; }
          .app-nav-inner { padding: 0.5rem 1rem; }
          .app-main { padding: 0 1rem; margin-top: 1.5rem; }
          .card { padding: 1.1rem; }
          .user-chip { padding: 0.35rem 0.6rem; }
        }
      `}</style>
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-mark">
              <img
                src="/knottz-logo.png"
                alt="Knottz"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <h1 className="app-logo">Knottz</h1>
          </div>
          
          {isAuthenticated ? (
            <button
              className="user-chip"
              onClick={() => setView('profile')}
              style={{ border: 'none', cursor: 'pointer' }}
              aria-label="Öppna profil"
            >
              {renderAvatar(currentUser, 34)}
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {currentUser.full_name || 'Din profil'}
              </div>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setView('auth')}>
              Logga in
            </button>
          )}
        </div>
      </header>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="app-nav">
          <div className="app-nav-inner">
          {[
            { id: 'feed', label: 'Flöde', icon: '' },
            { id: 'groups', label: 'AlltIAllo', icon: '' },
            { id: 'profile', label: 'Profil', icon: '', badge: conversations.reduce((sum, c) => sum + c.unread, 0) },
          ].map(({ id, label, icon, badge }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="nav-btn"
              data-active={view === id}
            >
              {label}
              {badge > 0 && (
                <span className="badge">{badge}</span>
              )}
            </button>
          ))}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="app-main">
        {/* INVITE GATE (disabled unless flag on) */}
        {INVITE_REQUIRED && !inviteStatus.hasInvite && view !== 'auth' && !isAdminUser && !isAuthenticated && (
          <div className="section" style={{ maxWidth: '520px', margin: '2rem auto' }}>
            <div className="card card-strong">
              <h2 className="section-title">Invite krävs</h2>
              <div className="section-subtitle">
                För att komma in behöver du en inbjudningskod eller en personlig länk.
              </div>
              <input
                className="input"
                placeholder="Ange inbjudningskod"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
              />
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  if (!inviteInput.trim()) return;
                  localStorage.setItem('knottz_invite', inviteInput.trim());
                  setInviteStatus({ hasInvite: true, code: inviteInput.trim() });
                  setView('feed');
                }}
              >
                Lås upp
              </button>
              <div style={{ marginTop: '1rem', color: '#6c6b7a', fontSize: '0.9rem' }}>
                Har du ingen kod? Be en vän eller kontakta teamet.
              </div>
            </div>
          </div>
        )}

        {/* AUTH VIEW */}
        {view === 'auth' && (
          <div className="section" style={{ maxWidth: '520px', margin: '2rem auto' }}>
            <div className="card card-strong">
              <h2 className="section-title">{authMode === 'login' ? 'Välkommen tillbaka' : 'Skapa konto'}</h2>
              <div className="section-subtitle">
                {authMode === 'login'
                  ? 'Logga in med din e-post.'
                  : 'Skapa konto med e‑post och bjud in din familj.'}
              </div>

              <div className="stack" style={{ marginTop: '1rem' }}>
                {INVITE_REQUIRED && authMode === 'signup' && (
                  <input
                    className="input"
                    placeholder="Inbjudningskod"
                    value={inviteInput || inviteStatus.code}
                    onChange={(e) => setInviteInput(e.target.value)}
                  />
                )}
                {INVITE_REQUIRED && authMode === 'signup' && inviteStatus.code && (
                  <div className="pill" style={{ width: 'fit-content' }}>
                    Kod: {inviteStatus.code}
                  </div>
                )}
                <input className="input" placeholder="E‑post" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                <input className="input" placeholder="Lösenord" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                {authMode === 'signup' && (
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Kontotyp</div>
                    <div className="subnav">
                      <button
                        className={`btn ${accountType === 'family' ? 'btn-primary' : 'btn-soft'}`}
                        onClick={() => setAccountType('family')}
                      >
                        Familj/Par
                      </button>
                      <button
                        className={`btn ${accountType === 'solo' ? 'btn-primary' : 'btn-soft'}`}
                        onClick={() => setAccountType('solo')}
                      >
                        Ensam
                      </button>
                    </div>
                  </div>
                )}
                {authMode === 'signup' && (
                  <div className="stack">
                    <input className="input" placeholder="Hushållsnamn (ex. Familjen Karlsson)" value={householdName} onChange={(e) => setHouseholdName(e.target.value)} />
                    <input className="input" placeholder="Förälder 1 - namn" value={parentOne} onChange={(e) => setParentOne(e.target.value)} />
                    {accountType === 'family' && (
                      <input className="input" placeholder="Förälder 2 - namn (valfritt)" value={parentTwo} onChange={(e) => setParentTwo(e.target.value)} />
                    )}
                    <label style={{ fontWeight: 600 }}>Beräknat datum för barnet</label>
                    <input className="input" type="date" value={expectedDueDate} onChange={(e) => setExpectedDueDate(e.target.value)} />
                    <label style={{ fontWeight: 600 }}>Har ni fler barn redan?</label>
                    {existingChildren.map((child, idx) => (
                      <div key={idx} className="grid-2">
                        <input
                          className="input"
                          placeholder="Barnets namn"
                          value={child.name}
                          onChange={(e) => {
                            const next = [...existingChildren];
                            next[idx].name = e.target.value;
                            setExistingChildren(next);
                          }}
                        />
                        <input
                          className="input"
                          type="date"
                          value={child.birthDate}
                          onChange={(e) => {
                            const next = [...existingChildren];
                            next[idx].birthDate = e.target.value;
                            setExistingChildren(next);
                          }}
                        />
                      </div>
                    ))}
                    <button
                      className="btn btn-soft"
                      onClick={() => setExistingChildren([...existingChildren, { name: '', birthDate: '' }])}
                    >
                      Lägg till barn
                    </button>
                  </div>
                )}
                {authMode === 'signup' && (
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Bank‑ID</div>
                    <div style={{ color: '#6c6b7a', fontSize: '0.9rem' }}>
                      Första gången behöver du bekräfta med Bank‑ID (koppling kommer senare).
                    </div>
                    <button className="btn btn-outline" style={{ marginTop: '0.75rem' }}>
                      Bekräfta med Bank‑ID
                    </button>
                  </div>
                )}
                {authMode === 'signup' && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Din inbjudan kopplas till den som bjöd in dig automatiskt.
                  </div>
                )}
                <button className="btn btn-primary" onClick={() => (authMode === 'login' ? signIn() : signUp())}>
                  {authMode === 'login' ? 'Logga in' : 'Skapa konto'}
                </button>
                {authNotice && (
                  <div style={{ color: '#111827', fontSize: '0.9rem', fontWeight: 600 }}>
                    Verifiera via e‑post.
                  </div>
                )}
                {authError && (
                  <div style={{ color: '#b00020', fontSize: '0.9rem' }}>{authError}</div>
                )}
                <button
                  className="btn btn-soft"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                >
                  {authMode === 'login' ? 'Skapa konto' : 'Jag har redan konto'}
                </button>
                <button className="btn btn-ghost" onClick={() => setView('guest')}>
                  Fortsätt som gäst
                </button>
              </div>
            </div>
          </div>
        )}
        {/* FEED VIEW */}
        {view === 'feed' && (
          <div>
            <div className="section fade-in">
              {!canInteract && (
                <div className="card card-strong" style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Färdigställ din profil</div>
                  <div style={{ color: '#6c6b7a' }}>
                    Ladda upp profilbild, skriv namn, personnummer och BF‑datum för att kunna posta,
                    rösta och delta i grupper.
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => setView('profile')}>
                    Gå till profil
                  </button>
                </div>
              )}
              <div className="search-bar">
                <Search size={18} color="#6c6b7a" />
                <input
                  className="search-input"
                  placeholder="Sök efter personer, inlägg eller nyckelord..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {searchLower && (
              <div className="section card">
                <h3 style={{ marginBottom: '0.5rem' }}>Sökresultat</h3>
                <div style={{ color: '#6c6b7a', marginBottom: '0.75rem' }}>
                  {filteredPosts.length} inlägg · {filteredUsers.length} personer
                </div>
                {filteredUsers.length > 0 && (
                  <div className="stack" style={{ marginBottom: '1rem' }}>
                    {filteredUsers.slice(0, 4).map(user => (
                      <div
                        key={user.id}
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => openUserProfile(user.id)}
                      >
                        {renderAvatar(user, 28)}
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>@{user.username}</div>
                          {user.household_name && (
                            <div style={{ fontSize: '0.8rem', color: '#6c6b7a' }}>{user.household_name}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="section grid-2 fade-in">
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3>Trendande barnsaker</h3>
                  <button className="btn btn-soft" onClick={() => openDetail('musthaves')}>
                    Se alla
                  </button>
                </div>
                <div className="stack">
                  {trendingMustHaves.map(item => (
                    <div
                      key={item.id}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}
                      onClick={() => openDetail('musthaves', item.id)}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.category} · {item.price_range}</div>
                      </div>
                      <span className="chip">{item.upvotes}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3>Populära tips</h3>
                  <button className="btn btn-soft" onClick={() => openDetail('tips')}>
                    Se alla
                  </button>
                </div>
                <div className="stack">
                  {trendingTips.map(tip => (
                    <div
                      key={tip.id}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}
                      onClick={() => openDetail('tips', tip.id)}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{tip.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{tip.category}</div>
                      </div>
                      <span className="chip">{tip.helpful_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section fade-in">
              {!showNewPost && (
                <button
                  onClick={() => setShowNewPost(true)}
                  disabled={!canInteract}
                  className="card card-dashed"
                  style={{
                    width: '100%',
                    color: '#7b6df0',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Plus size={20} /> Dela något i flödet
                </button>
              )}

              {showNewPost && (
                <div className="card card-strong">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Vad vill du dela?"
                    className="textarea"
                    style={{ marginBottom: '1rem' }}
                    autoFocus
                  />
                  <div className="subnav" style={{ marginBottom: '0.75rem' }}>
                    <button
                      className={`btn ${newPostVisibility === 'public' ? 'btn-primary' : 'btn-soft'}`}
                      onClick={() => setNewPostVisibility('public')}
                    >
                      Offentligt
                    </button>
                    <button
                      className={`btn ${newPostVisibility === 'private' ? 'btn-primary' : 'btn-soft'}`}
                      onClick={() => setNewPostVisibility('private')}
                    >
                      Privat
                    </button>
                    <label className="btn btn-soft" style={{ marginLeft: 'auto' }}>
                      Lägg till bild/video
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleNewPostMedia}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {newPostMedia.length > 0 && (
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      {newPostMedia.map((item, idx) => (
                        <div key={idx} className="card" style={{ padding: '0.5rem' }}>
                          {item.type.startsWith('video') ? (
                            <video src={item.url} controls style={{ width: '100%', borderRadius: 12 }} />
                          ) : (
                            <img src={item.url} alt={item.name} style={{ width: '100%', borderRadius: 12 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setShowNewPost(false); setNewPostContent(''); setNewPostMedia([]); }}
                      className="btn btn-ghost"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={createPost}
                      disabled={!newPostContent.trim()}
                      className="btn btn-primary"
                    >
                      Publicera
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="section fade-in">
              <h2 className="section-title">Senaste inläggen</h2>
              <div className="stack">
                {filteredPosts.map(post => {
                  const author = getUser(post.user_id);
                  return (
                    <div key={post.id} className="card">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <button
                        onClick={() => openUserProfile(author.id)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        {renderAvatar(author, 40)}
                      </button>
                      <div style={{ flex: 1 }}>
                        <button
                          onClick={() => openUserProfile(author.id)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 700 }}
                        >
                          {author.full_name}
                        </button>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                          @{author.username} · Vecka {author.current_week} · {formatTime(post.created_at)}
                        </div>
                        <div style={{ marginTop: '0.35rem' }}>
                          <span className="pill">{post.visibility === 'private' ? 'Privat' : 'Offentligt'}</span>
                        </div>
                        </div>
                      </div>

                      <p style={{ lineHeight: 1.6, marginBottom: '1rem', fontSize: '1rem' }}>
                        {post.content}
                      </p>
                      {post.media && post.media.length > 0 && (
                        <div className="grid-3" style={{ marginBottom: '1rem' }}>
                          {post.media.map((item, idx) => (
                            <div key={idx} className="card" style={{ padding: '0.5rem' }}>
                              {item.type && item.type.startsWith('video') ? (
                                <video src={item.url} controls style={{ width: '100%', borderRadius: 12 }} />
                              ) : (
                                <img src={item.url} alt={item.name || `media-${idx}`} style={{ width: '100%', borderRadius: 12 }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="icon-btn"
                          data-active={post.liked_by_me}
                        >
                          <Heart size={18} fill={post.liked_by_me ? '#7b6df0' : 'none'} />
                          {post.likes_count}
                        </button>
                        <button
                          onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                          className="icon-btn"
                        >
                          <MessageCircle size={18} />
                          {post.comments_count}
                        </button>
                        <button onClick={() => openDetail('post', post.id)} className="btn btn-soft">
                          Öppna
                        </button>
                      </div>

                      {selectedPost === post.id && (
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                          {comments[post.id]?.map(comment => {
                            const commenter = getUser(comment.user_id);
                            return (
                              <div key={comment.id} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
                                {renderAvatar(commenter, 26)}
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{commenter.username}</div>
                                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{comment.content}</div>
                                </div>
                              </div>
                            );
                          })}

                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            {renderAvatar(currentUser, 26)}
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                              placeholder="Skriv en kommentar..."
                              className="input"
                              style={{ flex: 1 }}
                            />
                            <button
                              onClick={() => addComment(post.id)}
                              disabled={!newComment.trim()}
                              className="btn btn-primary"
                            >
                              Skicka
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section grid-2 fade-in">
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Vänförslag</h3>
                <div className="stack">
                  {users.filter(u => u.id !== currentUser.id && !following.includes(u.id)).slice(0, 4).map(user => (
                    <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => openUserProfile(user.id)}
                      >
                        {renderAvatar(user, 32)}
                        <div>
                          <div style={{ fontWeight: 700 }}>{user.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>@{user.username}</div>
                        </div>
                      </div>
                      <button className="btn btn-outline" onClick={() => toggleFollow(user.id)}>Följ</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Gruppförslag</h3>
                <div className="stack">
                  {groups.filter(g => !g.is_member).slice(0, 4).map(group => (
                    <div key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.8rem' }}>{group.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{group.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{group.members} medlemmar</div>
                        </div>
                      </div>
                      <button className="btn btn-outline" disabled={!canInteract} onClick={() => toggleGroupMembership(group.id)}>Gå med</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GUEST VIEW */}
        {view === 'guest' && (
          <div>
            <div className="section card fade-in">
              <h2 className="section-title">Välkommen till Knottz</h2>
              <div className="section-subtitle">
                Du är i gästläge och kan läsa bloggar och se topplistor samt statistik.
              </div>
              <button className="btn btn-primary" onClick={() => setView('auth')}>
                Skapa konto / Logga in
              </button>
            </div>

            <div className="section card fade-in">
              <h3 style={{ marginBottom: '0.75rem' }}>Artiklar</h3>
              <div className="stack">
                {MOCK_BLOGS.map((blog) => (
                  <div key={blog.id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700 }}>{blog.title}</div>
                    <div style={{ color: '#666', fontSize: '0.85rem', margin: '0.4rem 0' }}>
                      {new Date(blog.created_at).toLocaleDateString('sv-SE')}
                    </div>
                    <div style={{ color: '#333' }}>{blog.excerpt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section grid-2 fade-in">
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Toppröstade Must Haves</h3>
                <div className="stack">
                  {trendingMustHaves.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.category}</div>
                      </div>
                      <span className="chip">{item.upvotes}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Populära tips</h3>
                <div className="stack">
                  {trendingTips.map(tip => (
                    <div key={tip.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{tip.title}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{tip.category}</div>
                      </div>
                      <span className="chip">{tip.helpful_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section card fade-in">
              <h3 style={{ marginBottom: '0.75rem' }}>Statistik</h3>
              <div className="grid-3">
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_total}</div>
                  <div>Födslar 2024 (SCB)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.boys_per_100_girls}</div>
                  <div>Pojkar per 100 flickor</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_boys} / {SCB_STATS.births_2024_girls}</div>
                  <div>Pojkar / Flickor</div>
                </div>
              </div>
              <div className="section">
                <h4 style={{ marginBottom: '0.5rem' }}>Populäraste namnen 2024</h4>
                <div className="grid-2">
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Flickor</div>
                    <div style={{ color: '#6c6b7a' }}>{POPULAR_NAMES_2024.girls.join(', ')}</div>
                  </div>
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Pojkar</div>
                    <div style={{ color: '#6c6b7a' }}>{POPULAR_NAMES_2024.boys.join(', ')}</div>
                  </div>
                </div>
              </div>
              <div className="section">
                <button className="btn btn-soft" onClick={() => setScbPanel(true)}>
                  Se detaljerad SCB‑statistik
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GROUPS VIEW */}
        {view === 'groups' && (
          <div>
            <div className="section">
              <h2 className="section-title">AlltIAllo</h2>
              <div className="section-subtitle">Hitta din gemenskap, byt erfarenheter och ge vidare.</div>
            </div>

            <div className="section grid-3">
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.total_members}</div>
                <div>Totala medlemmar</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{SCB_STATS.births_2024_total}</div>
                <div>Födslar 2024 (SCB)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{SCB_STATS.boys_per_100_girls}</div>
                <div>Pojkar per 100 flickor</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{SCB_STATS.births_2024_boys} / {SCB_STATS.births_2024_girls}</div>
                <div>Pojkar / Flickor</div>
              </div>
            </div>

            <div className="section grid-2">
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Upptäck grupper</h3>
                <div className="stack">
                  {groups.map(group => (
                    <div key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>{group.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{group.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{group.description}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6c6b7a' }}>{group.members} medlemmar</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleGroupMembership(group.id)}
                        className={`btn ${group.is_member ? 'btn-ghost' : 'btn-primary'}`}
                        disabled={!canInteract}
                      >
                        {group.is_member ? 'Följer' : 'Gå med'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Marknadsplats · Skänk bort</h3>
                <div className="stack">
                  {giveaways.slice(0, 3).map(item => {
                    const author = getUser(item.created_by);
                    return (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.title}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.location} · {item.condition}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6c6b7a' }}>Från {author.full_name}</div>
                        </div>
                        <span className="chip">{item.category}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="btn btn-soft" style={{ marginTop: '1rem', width: '100%' }}>
                  Öppna marknadsplatsen
                </button>
              </div>
            </div>

            <div className="section grid-2">
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Pappa-skämt</h3>
                <div className="stack">
                  {dadJokes.slice(0, 3).map(joke => (
                    <div key={joke.id}>
                      <div style={{ fontWeight: 700 }}>{joke.joke}</div>
                      {!showPunchline[joke.id] ? (
                        <button
                          onClick={() => togglePunchline(joke.id)}
                          className="btn btn-soft"
                          style={{ marginTop: '0.5rem' }}
                        >
                          Visa svaret
                        </button>
                      ) : (
                        <div style={{ marginTop: '0.5rem', color: '#7b6df0', fontWeight: 700 }}>
                          {joke.punchline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '0.75rem' }}>Säsongsmönster</h3>
                <div style={{ color: '#6c6b7a' }}>
                  Födslar är ofta som högst under sensommar och tidig höst enligt SCB:s
                  sammanställningar. Vi använder detta som inspiration i appens guide.
                </div>
              </div>
            </div>

            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Månadens guide</h3>
              <div className="grid-3">
                {MONTH_GUIDE.map(item => (
                  <div key={item.month} className="stat-card">
                    <div style={{ fontWeight: 700 }}>{item.month}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAVED VIEW */}
        {view === 'saved' && (
          <div>
            <div className="section">
              <h2 className="section-title">Sparade inlägg</h2>
              <div className="section-subtitle">Det du vill hitta snabbt igen.</div>
            </div>
            <div className="section card">
              {savedPosts.length === 0 ? (
                <div style={{ color: '#6c6b7a' }}>Inga sparade inlägg ännu.</div>
              ) : (
                <div className="stack">
                  {savedPosts.map(item => (
                    <div key={item.id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.type} · {item.created_at}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {view === 'settings' && (
          <div>
            <div className="section">
              <h2 className="section-title">Inställningar</h2>
              <div className="section-subtitle">Styr integritet och standardval.</div>
            </div>
            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Profilens integritet</h3>
              <div className="subnav">
                <button
                  className={`btn ${profilePrivacy === 'public' ? 'btn-primary' : 'btn-soft'}`}
                  onClick={() => setProfilePrivacy('public')}
                >
                  Öppen profil
                </button>
                <button
                  className={`btn ${profilePrivacy === 'private' ? 'btn-primary' : 'btn-soft'}`}
                  onClick={() => setProfilePrivacy('private')}
                >
                  Privat profil
                </button>
              </div>
              <div style={{ color: '#6c6b7a', marginTop: '0.75rem' }}>
                Detta blir standarden för nya inlägg. Du kan ändra per inlägg.
              </div>
            </div>
            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Konto</h3>
              <button className="btn btn-ghost" onClick={handleLogout}>
                <LogOut size={16} /> Logga ut
              </button>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {view === 'profile' && (
          <div>
            <div className="card card-strong section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    {renderAvatar(currentUser, 72)}
                    <label
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        right: -6,
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: '999px',
                        padding: '0.35rem',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-soft)',
                      }}
                    >
                      <ImageIcon size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{currentUser.full_name || 'Din profil'}</h2>
                    <div style={{ color: '#6c6b7a', fontSize: '1.1rem' }}>
                      @{currentUser.username || 'knottz'}
                    </div>
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 1rem',
                      background: '#f0edff',
                      color: '#7b6df0',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontWeight: 600,
                    }}>
                      Vecka {currentUser.current_week} av 40
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="btn btn-primary"
                  >
                    <Edit size={18} /> Redigera profil
                  </button>
                  <button className="btn btn-soft" onClick={() => setView('settings')}>
                    <Settings size={18} /> Inställningar
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="chip">📍 {currentUser.location || 'Lägg till ort'}</span>
                <span className="chip">
                  📅 {currentUser.due_date ? new Date(currentUser.due_date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Lägg till BF'}
                </span>
                <span className="chip">{posts.filter(p => p.user_id === currentUser.id).length} inlägg</span>
                <span className="chip">{following.length} följer</span>
                {adminEmails.includes(authEmail) && <span className="chip">Admin</span>}
              </div>
            </div>

            {editingProfile && (
              <div className="section card">
                <h3 style={{ marginBottom: '0.75rem' }}>Redigera profil</h3>
                <div className="stack">
                  <input
                    className="input"
                    placeholder="Namn"
                    value={currentUser.full_name || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, full_name: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Ort"
                    value={currentUser.location || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, location: e.target.value })}
                  />
                  <textarea
                    className="textarea"
                    placeholder="Bio"
                    value={currentUser.bio || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, bio: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Personnummer"
                    value={currentUser.personal_number || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, personal_number: e.target.value })}
                  />
                  <label style={{ fontWeight: 600 }}>Beräknat datum för barnet</label>
                  <input
                    className="input"
                    type="date"
                    value={currentUser.due_date || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, due_date: e.target.value })}
                  />
                  <div className="subnav">
                    <button
                      className={`btn ${profilePrivacy === 'public' ? 'btn-primary' : 'btn-soft'}`}
                      onClick={() => setProfilePrivacy('public')}
                    >
                      Öppen profil
                    </button>
                    <button
                      className={`btn ${profilePrivacy === 'private' ? 'btn-primary' : 'btn-soft'}`}
                      onClick={() => setProfilePrivacy('private')}
                    >
                      Privat profil
                    </button>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      if (!supabase || !authUserId) return;
                      await supabase
                        .from('profiles')
                        .update({
                          display_name: currentUser.full_name || '',
                          location: currentUser.location || '',
                          bio: currentUser.bio || '',
                          avatar_url: currentUser.avatar_url || '',
                          personal_number: currentUser.personal_number || '',
                          expected_due_date: currentUser.due_date || null,
                          is_private: profilePrivacy === 'private',
                        })
                        .eq('user_id', authUserId);
                      loadProfiles();
                      setEditingProfile(false);
                    }}
                  >
                    Spara
                  </button>
                </div>
              </div>
            )}

            {showQuickStart && (
              <div className="section card fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.35rem' }}>Kom igång på 60 sek</h3>
                    <div style={{ color: '#6c6b7a' }}>
                      Fixa profilen, gå med i grupper och hitta vänner.
                    </div>
                  </div>
                  <button className="btn btn-ghost" onClick={() => setShowQuickStart(false)}>Stäng</button>
                </div>
                <div className="grid-3" style={{ marginTop: '1rem' }}>
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Profil</div>
                    <div style={{ color: '#6c6b7a' }}>Lägg till bild, bio och BF‑datum.</div>
                  </div>
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Grupper</div>
                    <div style={{ color: '#6c6b7a' }}>Gå med i populära grupper direkt.</div>
                  </div>
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Vänner</div>
                    <div style={{ color: '#6c6b7a' }}>Hitta familjer du känner.</div>
                  </div>
                </div>

                <div className="section grid-2">
                  <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Populära grupper</h4>
                    <div className="stack">
                      {groups.slice(0, 3).map(group => (
                        <div key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{group.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{group.members} medlemmar</div>
                          </div>
                          <button className="btn btn-outline" disabled={!canInteract} onClick={() => toggleGroupMembership(group.id)}>
                            {group.is_member ? 'Följer' : 'Gå med'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Vänförslag</h4>
                    <div className="stack">
                      {MOCK_FRIEND_SUGGESTIONS.map(friend => (
                        <div key={friend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{friend.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{friend.mutuals} gemensamma</div>
                          </div>
                          <button className="btn btn-outline">Lägg till</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.75rem', color: '#6c6b7a', fontSize: '0.85rem' }}>
                      Koppla telefon eller Facebook för fler förslag.
                    </div>
                  </div>
                </div>

                <div className="section" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-soft" onClick={() => setShowTour(true)}>Se hur appen funkar</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      localStorage.setItem('knottz_onboarded', '1');
                      setShowQuickStart(false);
                    }}
                  >
                    Jag är klar
                  </button>
                </div>
              </div>
            )}

            <div className="section subnav">
              {[
                { id: 'posts', label: 'Mina inlägg' },
                { id: 'messages', label: 'Meddelanden' },
                { id: 'friends', label: 'Kompisar' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`btn ${profileTab === tab.id ? 'btn-primary' : 'btn-soft'}`}
                  onClick={() => setProfileTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {profileTab === 'posts' && (
              <div className="section card">
                <h3 style={{ marginBottom: '0.75rem' }}>Mina inlägg</h3>
                <div className="stack">
                  {posts.filter(p => p.user_id === currentUser.id).length === 0 ? (
                    <div style={{ color: '#6c6b7a' }}>Du har inte gjort några inlägg än.</div>
                  ) : (
                    posts
                      .filter(p => p.user_id === currentUser.id)
                      .map(post => (
                        <div key={post.id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a', marginBottom: '0.5rem' }}>
                            {formatTime(post.created_at)}
                          </div>
                          <span className="pill" style={{ marginBottom: '0.5rem' }}>
                            {post.visibility === 'private' ? 'Privat' : 'Offentligt'}
                          </span>
                          <p style={{ lineHeight: 1.6 }}>{post.content}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Mina grupper</h3>
              <div className="stack">
                {groups.filter(g => g.is_member).map(group => (
                  <div key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ fontSize: '1.8rem' }}>{group.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{group.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                          {group.members} medlemmar
                        </div>
                      </div>
                    </div>
                    {group.new_posts > 0 && (
                      <span className="chip">Nytt · {group.new_posts}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Vänner som väntar barn</h3>
              <div className="stack">
                {users.filter(u => following.includes(u.id)).map(user => (
                  <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => openUserProfile(user.id)}
                    >
                      {renderAvatar(user, 32)}
                      <div>
                        <div style={{ fontWeight: 700 }}>{user.full_name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                          BF {new Date(user.due_date).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                    </div>
                    {user.is_new_pregnancy && <span className="chip">Ny BF</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Mina inbjudningar</h3>
              <div style={{ color: '#6c6b7a', marginBottom: '0.75rem' }}>
                Du får fler inbjudningar genom att vara aktiv. Var 10:e poäng ger en extra kod.
              </div>
              <div className="soft-panel" style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Bjud in via e‑post</div>
                <div className="stack">
                  <input
                    className="input"
                    placeholder="vän@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      if (!inviteEmail.trim()) return;
                      try {
                        if (!supabase) {
                          setInviteSendStatus('Supabase saknas');
                          return;
                        }
                        const { data: sessionData } = await supabase.auth.getUser();
                        const code = `KNOTTZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
                        await supabase.from('invites').insert({
                          code,
                          created_by: sessionData?.user?.id || null,
                        });
                        const updated = isAdminUser ? [...inviteCodes, code] : [...inviteCodes, code].slice(0, invitesAvailable);
                        setInviteCodes(updated);
                        localStorage.setItem('knottz_invite_codes', JSON.stringify(updated));
                        const resp = await fetch('/api/invite', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: inviteEmail.trim(),
                            code,
                            baseUrl: window.location.origin,
                          }),
                        });
                        if (!resp.ok) {
                          let detail = '';
                          try {
                            const data = await resp.json();
                            detail = data.details || data.error || '';
                          } catch (e) {
                            detail = await resp.text();
                          }
                          const suffix = detail ? ` (${detail})` : '';
                          setInviteSendStatus(`Koden skapad, men e‑post kunde inte skickas${suffix}.`);
                        } else {
                          setInviteSendStatus('Inbjudan skickad.');
                        }
                        setInviteEmail('');
                      } catch (err) {
                        setInviteSendStatus('Kunde inte skicka inbjudan.');
                      }
                    }}
                  >
                    Skicka inbjudan
                  </button>
                  {inviteSendStatus && (
                    <div style={{ color: '#6c6b7a', fontSize: '0.85rem' }}>{inviteSendStatus}</div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="chip">Tillgängliga: {isAdminUser ? '∞' : invitesAvailable}</span>
                <span className="chip">Aktivitetspoäng: {myActivityScore}</span>
              </div>
              <div style={{ marginTop: '1rem' }} className="stack">
                <button
                  className="btn btn-soft"
                  onClick={() => {
                    if (!isAdminUser && inviteCodes.length >= invitesAvailable) return;
                    generateInviteCode();
                  }}
                >
                  Skapa inbjudningskod
                </button>
                {inviteCodes.length > 0 && (
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Dina koder</div>
                    <div className="stack">
                      {inviteCodes.map(code => (
                        <div key={code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <code>{code}</code>
                          <button className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(code)}>Kopiera</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {profileTab === 'messages' && (
              <div className="section">
                <div className="messages-layout" style={{ gridTemplateColumns: activeConversation ? '320px 1fr' : '1fr' }}>
                  <div className="card" style={{ overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Meddelanden</h3>
                    {conversations.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#6c6b7a' }}>
                        Inga konversationer än.
                      </div>
                    ) : (
                      <div>
                        {conversations.map(conv => {
                          const otherUser = getUser(conv.other_user_id);
                          return (
                            <div
                              key={conv.id}
                              onClick={() => setActiveConversation(conv.id)}
                              style={{
                                padding: '1rem',
                                background: activeConversation === conv.id ? '#f0edff' : 'transparent',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                marginBottom: '0.5rem',
                                border: activeConversation === conv.id ? '2px solid #e3ddff' : '2px solid transparent',
                              }}
                            >
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {renderAvatar(otherUser, 32)}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{otherUser.full_name}</div>
                                  <div style={{ fontSize: '0.85rem', color: '#6c6b7a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.last_message || 'Ingen konversation än'}
                                  </div>
                                </div>
                                {conv.unread > 0 && (
                                  <div className="badge-inline">{conv.unread}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {activeConversation && (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '2px solid #e3ddff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          {renderAvatar(getUser(conversations.find(c => c.id === activeConversation).other_user_id), 32)}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                              {getUser(conversations.find(c => c.id === activeConversation).other_user_id).full_name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                              Vecka {getUser(conversations.find(c => c.id === activeConversation).other_user_id).current_week}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveConversation(null)}
                          className="btn btn-ghost"
                        >
                          Stäng
                        </button>
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(messages[activeConversation] || []).map(msg => {
                          const isMe = msg.sender_id === currentUser.id;
                          return (
                            <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                              <div style={{
                                padding: '0.75rem 1rem',
                                background: isMe ? '#7b6df0' : '#f3f2ff',
                                color: isMe ? 'white' : '#222',
                                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                              }}>
                                {msg.content}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#6c6b7a', marginTop: '0.25rem', textAlign: isMe ? 'right' : 'left' }}>
                                {formatTime(msg.created_at)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Skriv ett meddelande..."
                          className="input"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="btn btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Send size={18} /> Skicka
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profileTab === 'friends' && (
              <div className="section card">
                <h3 style={{ marginBottom: '0.75rem' }}>Mina kompisar</h3>
                <div className="stack">
                  {users.filter(u => following.includes(u.id)).map(user => (
                    <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {renderAvatar(user, 32)}
                        <div>
                          <div style={{ fontWeight: 700 }}>{user.full_name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                            Beräknat {new Date(user.due_date).toLocaleDateString('sv-SE')}
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-outline" onClick={() => startConversation(user.id)}>
                        Meddela
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {view === 'musthaves' && (
          <div className="section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">Must Haves</h2>
              <button className="btn btn-ghost" onClick={backToPrevious}>Tillbaka</button>
            </div>
            <div className="subnav" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
              {mustHaveCategories.map(cat => (
                <button
                  key={cat}
                  className={`btn ${mustHaveCategory === cat ? 'btn-primary' : 'btn-soft'}`}
                  onClick={() => setMustHaveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="stack">
              {filteredMustHaves.map(item => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    boxShadow: 'none',
                    border: item.id === detailId ? '2px solid var(--accent)' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{item.category} · {item.price_range}</div>
                      <p style={{ marginTop: '0.5rem' }}>{item.description}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                      <button className="btn btn-soft" disabled={!canInteract} onClick={() => toggleMustHaveVote(item.id, 'up')}>Rösta {item.upvotes}</button>
                      <button className="btn btn-soft" disabled={!canInteract} onClick={() => toggleMustHaveVote(item.id, 'verified')}>{item.verified_count} har den</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="section card">
              <h3 style={{ marginBottom: '0.75rem' }}>Föreslå produkt</h3>
              <div className="stack">
                <input className="input" placeholder="Produktnamn" id="mh-title" />
                <input className="input" placeholder="Länk till produkt (valfritt)" id="mh-link" />
                <input className="input" placeholder="Kategori" id="mh-category" />
                <textarea className="textarea" placeholder="Kort beskrivning" id="mh-desc" />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const title = document.getElementById('mh-title')?.value || '';
                    if (!title.trim()) return;
                    const link = document.getElementById('mh-link')?.value || '';
                    const category = document.getElementById('mh-category')?.value || '';
                    const desc = document.getElementById('mh-desc')?.value || '';
                    const next = [{ id: Date.now().toString(), title, link, category, desc }, ...mustHaveRequests];
                    setMustHaveRequests(next);
                  }}
                >
                  Skicka för granskning
                </button>
                {mustHaveRequests.length > 0 && (
                  <div style={{ color: '#6c6b7a', fontSize: '0.85rem' }}>
                    Senaste förslag: {mustHaveRequests[0].title}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'tips' && (
          <div className="section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">Tips & Tricks</h2>
              <button className="btn btn-ghost" onClick={backToPrevious}>Tillbaka</button>
            </div>
            <div className="stack">
              {tips.map(tip => (
                <div
                  key={tip.id}
                  className="card"
                  style={{
                    boxShadow: 'none',
                    border: tip.id === detailId ? '2px solid var(--accent)' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{tip.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>{tip.category}</div>
                  <p style={{ marginTop: '0.5rem' }}>{tip.content}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button className="btn btn-soft" disabled={!canInteract} onClick={() => toggleTipVote(tip.id, 'up')}>Rösta {tip.upvotes}</button>
                    <button className="btn btn-soft" disabled={!canInteract} onClick={() => toggleTipVote(tip.id, 'helpful')}>Hjälpte {tip.helpful_count}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'post' && (
          <div className="section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">Inlägg</h2>
              <button className="btn btn-ghost" onClick={backToPrevious}>Tillbaka</button>
            </div>
            {(() => {
              const post = posts.find(p => p.id === detailId);
              if (!post) return <div>Inlägget hittades inte.</div>;
              const author = getUser(post.user_id);
              return (
                <div className="card">
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                    {renderAvatar(author, 36)}
                    <div>
                      <div style={{ fontWeight: 700 }}>{author.full_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>@{author.username}</div>
                    </div>
                  </div>
                  <p style={{ lineHeight: 1.6 }}>{post.content}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="grid-3" style={{ marginTop: '1rem' }}>
                      {post.media.map((item, idx) => (
                        <div key={idx} className="card" style={{ padding: '0.5rem' }}>
                          {item.type && item.type.startsWith('video') ? (
                            <video src={item.url} controls style={{ width: '100%', borderRadius: 12 }} />
                          ) : (
                            <img src={item.url} alt={item.name || `media-${idx}`} style={{ width: '100%', borderRadius: 12 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-soft" onClick={() => toggleLike(post.id)}>{post.likes_count}</button>
                    <button className="btn btn-soft" onClick={() => setSelectedPost(post.id)}>{post.comments_count}</button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {view === 'user' && (
          <div className="section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="section-title">Profil</h2>
              <button className="btn btn-ghost" onClick={backToPrevious}>Tillbaka</button>
            </div>
            {(() => {
              const user = users.find(u => u.id === detailId);
              if (!user) return <div>Profilen hittades inte.</div>;
              return (
                <div className="stack">
                  <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {renderAvatar(user, 64)}
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem' }}>{user.full_name}</div>
                        <div style={{ color: '#6c6b7a' }}>@{user.username}</div>
                        <div className="chip" style={{ marginTop: '0.5rem' }}>
                          BF {new Date(user.due_date).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" onClick={() => toggleFollow(user.id)}>
                          {following.includes(user.id) ? 'Följer' : 'Följ'}
                        </button>
                        <button className="btn btn-soft" onClick={() => startConversation(user.id)}>
                          Meddela
                        </button>
                      </div>
                    </div>
                    <p style={{ marginTop: '1rem' }}>{user.bio}</p>
                  </div>
                  <div className="card">
                    <h3 style={{ marginBottom: '0.75rem' }}>Inlägg</h3>
                    <div className="stack">
                      {posts.filter(p => p.user_id === user.id).map(post => (
                        <div key={post.id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.85rem', color: '#6c6b7a', marginBottom: '0.5rem' }}>
                            {formatTime(post.created_at)}
                          </div>
                          <p>{post.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>

      {showTour && (
        <div className="modal-overlay" onClick={() => setShowTour(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Så funkar Knottz</h2>
              <button className="btn btn-ghost" onClick={() => setShowTour(false)}>Stäng</button>
            </div>
            <div className="grid-2" style={{ marginTop: '1rem' }}>
              {MOCK_SCREENSHOTS.map((shot) => (
                <div key={shot.id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
                  <img src={shot.src} alt={shot.title} style={{ width: '100%', borderRadius: 12 }} />
                  <div style={{ marginTop: '0.6rem', fontWeight: 700 }}>{shot.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {scbPanel && (
        <div className="modal-overlay" onClick={() => setScbPanel(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>SCB – födslar 2024</h2>
              <button className="btn btn-ghost" onClick={() => setScbPanel(false)}>Stäng</button>
            </div>
            <div className="section">
              <div className="grid-3">
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_total}</div>
                  <div>Totalt</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_boys}</div>
                  <div>Pojkar</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_girls}</div>
                  <div>Flickor</div>
                </div>
              </div>
            </div>
            <div className="section">
              <h3 style={{ marginBottom: '0.75rem' }}>Födslar per månad (2024)</h3>
              <div className="stack">
                {SCB_BIRTHS_2024_MONTHS.map((item) => (
                  <div key={item.month} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{item.month}</div>
                    <span className="chip">{item.count}</span>
                  </div>
                ))}
              </div>
              <div style={{ color: '#6c6b7a', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                Källa: SCB/Skatteverket (2024).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
