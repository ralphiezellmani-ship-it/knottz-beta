// ============================================================================
// KNOTTZ - Den svenska plattformen för blivande föräldrar
// ============================================================================
// En social plattform för graviditet & föräldraskap med fokus på hållbarhet,
// gemenskap och kunskapsdelning. Knyt samman föräldrar lokalt och globalt!
// ============================================================================

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Heart, MessageCircle, Plus, Send, Edit, Search, Image as ImageIcon } from 'lucide-react';

// Mock data - i produktionen kommer detta från Supabase
const MOCK_USERS = [
  {
    id: '1',
    username: 'anna_svensson',
    full_name: 'Anna Svensson',
    bio: 'Första barnet! Nervös men glad 💕',
    due_date: '2025-08-15',
    current_week: 24,
    avatar_url: '👩‍🦰',
    location: 'Stockholm',
    is_new_pregnancy: true,
  },
  {
    id: '2',
    username: 'erik_berg',
    full_name: 'Erik Berg',
    bio: 'Pappa för andra gången, nu med tvillingar! 👶👶',
    due_date: '2025-09-20',
    current_week: 20,
    avatar_url: '👨',
    location: 'Malmö',
    is_new_pregnancy: false,
  },
  {
    id: '3',
    username: 'sara_lindgren',
    full_name: 'Sara Lindgren',
    bio: 'Älskar att dela tips om graviditet 🌸',
    due_date: '2025-07-10',
    current_week: 28,
    avatar_url: '👩',
    location: 'Göteborg',
    is_new_pregnancy: false,
  },
  {
    id: '4',
    username: 'johan_karlsson',
    full_name: 'Johan Karlsson',
    bio: 'Väntande pappa från Göteborg',
    due_date: '2025-10-05',
    current_week: 16,
    avatar_url: '👨‍🦱',
    location: 'Göteborg',
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

// Community stats & month info (placeholder data)
const COMMUNITY_STATS = {
  total_members: 1246,
  expecting_boys: 48,
  expecting_girls: 52,
  births_2025: 312,
  births_2026: 289,
};

const MONTH_GUIDE = [
  { month: 'Januari', summary: 'Ny start och rutiner. Fokus på vila och närhet.' },
  { month: 'Februari', summary: 'Sömnmönster börjar sätta sig. Kortare promenader rekommenderas.' },
  { month: 'Mars', summary: 'Mer aktivitet och ökad nyfikenhet. Bra tid för baby-proofing.' },
  { month: 'April', summary: 'Utomhusaktiviteter och sociala träffar blir lättare.' },
  { month: 'Maj', summary: 'Utveckling av motorik och hand-öga-koordination.' },
  { month: 'Juni', summary: 'Mer skratt och tydligare personlighet. Skapa enkla rutiner.' },
  { month: 'Juli', summary: 'Matintroduktion och smakexploration.' },
  { month: 'Augusti', summary: 'Stabilare dygnsrytm, bra läge för vardagsstruktur.' },
  { month: 'September', summary: 'Rörelseglädje, låga hinder och trygg miljö.' },
  { month: 'Oktober', summary: 'Språk och ljud börjar utvecklas mer.' },
  { month: 'November', summary: 'Trygga rutiner och mycket närhet i mörkret.' },
  { month: 'December', summary: 'Familjetid, lugnare tempo och enkla traditioner.' },
];

const MOCK_POSTS = [
  {
    id: '1',
    user_id: '3',
    content: 'Någon mer som inte kan sluta äta pickles? 🥒😅 Cravinget är på en helt annan nivå nu!',
    likes_count: 12,
    comments_count: 5,
    created_at: '2025-02-05T10:30:00',
    liked_by_me: false,
  },
  {
    id: '2',
    user_id: '1',
    content: 'Första sparken idag! 😭❤️ Kan inte beskriva känslan. Det blev så verkligt helt plötsligt.',
    likes_count: 28,
    comments_count: 8,
    created_at: '2025-02-05T09:15:00',
    liked_by_me: true,
  },
  {
    id: '3',
    user_id: '2',
    content: 'Tips på bra barnvagnar för tvillingar? Vi är helt vilse i djungeln av alternativ! 🤯',
    likes_count: 7,
    comments_count: 12,
    created_at: '2025-02-04T18:45:00',
    liked_by_me: false,
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
    { id: 'm2', sender_id: '1', content: 'Ja! Så spännande! ❤️', created_at: '2025-02-05T10:15:00' },
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
    { id: 'c1', user_id: '1', content: 'Haha samma här! Pickles och glass 🍦', created_at: '2025-02-05T11:00:00' },
    { id: 'c2', user_id: '4', content: 'För mig är det chipsen som gäller 😄', created_at: '2025-02-05T11:30:00' },
  ],
  '2': [
    { id: 'c3', user_id: '3', content: 'Grattis! Så magiskt! ✨', created_at: '2025-02-05T09:30:00' },
    { id: 'c4', user_id: '2', content: 'Underbart! Minns den känslan ❤️', created_at: '2025-02-05T10:00:00' },
  ],
  '3': [
    { id: 'c5', user_id: '3', content: 'Vi har Bugaboo Donkey - jättebra!', created_at: '2025-02-04T19:00:00' },
  ],
};

export default function KnottzApp() {
  const INVITE_REQUIRED = false; // Feature flag (turn on later)
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); // Inloggad som Anna
  const [view, setView] = useState('auth'); // auth, feed, groups, profile, musthaves, tips, post, user
  const [previousView, setPreviousView] = useState('feed');
  const [detailId, setDetailId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [inviteStatus, setInviteStatus] = useState({ hasInvite: false, code: '' });
  const [inviteInput, setInviteInput] = useState('');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [following, setFollowing] = useState(['2', '3']); // Anna följer Erik och Sara
  const [newPostContent, setNewPostContent] = useState('');
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

  // Gruppera användare per månad
  const usersByMonth = users.reduce((acc, user) => {
    const month = getDueMonth(user.due_date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(user);
    return acc;
  }, {});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      localStorage.setItem('knottz_invite', invite);
      setInviteStatus({ hasInvite: true, code: invite });
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    const stored = localStorage.getItem('knottz_invite');
    if (stored) {
      setInviteStatus({ hasInvite: true, code: stored });
    }
  }, []);

  useEffect(() => {
    const verifyInvite = async () => {
      if (!INVITE_REQUIRED || !supabase || !inviteStatus.code) return;
      const { data, error } = await supabase
        .from('invites')
        .select('id, redeemed_at')
        .eq('code', inviteStatus.code)
        .maybeSingle();
      if (error || !data || data.redeemed_at) {
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
      user.username.toLowerCase().includes(searchLower))
  );

  const trendingMustHaves = [...mustHaves]
    .sort((a, b) => (b.upvotes + b.verified_count * 2) - (a.upvotes + a.verified_count * 2))
    .slice(0, 3);

  const trendingTips = [...tips]
    .sort((a, b) => (b.upvotes + b.helpful_count) - (a.upvotes + a.helpful_count))
    .slice(0, 3);

  const myPostsCount = posts.filter(p => p.user_id === currentUser.id).length;
  const myGroupsCount = groups.filter(g => g.is_member).length;
  const myActivityScore = myPostsCount + myGroupsCount + 3;
  const baseInvites = 2;
  const earnedInvites = Math.floor(myActivityScore / 5);
  const invitesAvailable = baseInvites + earnedInvites;

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
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      user_id: currentUser.id,
      content: newPostContent,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      liked_by_me: false,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPost(false);
  };

  // Följ/avfölja användare
  const toggleFollow = (userId) => {
    if (following.includes(userId)) {
      setFollowing(following.filter(id => id !== userId));
    } else {
      setFollowing([...following, userId]);
    }
  };

  // Lägg till kommentar
  const addComment = (postId) => {
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
    return <div style={{ fontSize: size * 0.6 }}>{user.avatar_url}</div>;
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

  // Gå med/lämna grupp
  const toggleGroupMembership = (groupId) => {
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
  };

  // Toggle vote for tips
  const toggleTipVote = (id, voteType) => {
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
          --bg: #f6f4ff;
          --bg-strong: #e7e1ff;
          --card: #ffffff;
          --ink: #1f1d2b;
          --muted: #6c6b7a;
          --accent: #7b6df0;
          --accent-strong: #6658d8;
          --accent-soft: #f0edff;
          --accent-gold: #f4d36b;
          --accent-mint: #8fc7b3;
          --border: #e3ddff;
          --shadow: 0 10px 28px rgba(48, 35, 110, 0.12);
          --shadow-soft: 0 4px 14px rgba(48, 35, 110, 0.08);
          --radius-lg: 20px;
          --radius-md: 14px;
          --radius-sm: 10px;
        }

        * { box-sizing: border-box; }
        body { margin: 0; }

        .app {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          background: radial-gradient(1200px 600px at 10% -10%, var(--bg-strong), transparent),
                      linear-gradient(140deg, var(--bg) 0%, #ffffff 100%);
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
          color: var(--accent);
          background: var(--accent-soft);
          border-color: var(--border);
        }

        .badge {
          position: absolute;
          top: -0.2rem;
          right: -0.1rem;
          background: var(--accent);
          color: white;
          border-radius: 999px;
          padding: 0.1rem 0.45rem;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .badge-inline {
          background: var(--accent);
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
        .btn-outline { background: white; color: var(--accent); border: 2px solid var(--accent); }
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
            >
              {renderAvatar(currentUser, 34)}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Vecka {currentUser.current_week}</div>
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
              { id: 'feed', label: 'Flöde', icon: '📱' },
              { id: 'groups', label: 'Grupper', icon: '👥' },
              { id: 'profile', label: 'Profil', icon: '👤', badge: conversations.reduce((sum, c) => sum + c.unread, 0) },
            ].map(({ id, label, icon, badge }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className="nav-btn"
                data-active={view === id}
              >
                {icon} {label}
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
        {INVITE_REQUIRED && !inviteStatus.hasInvite && view !== 'auth' && (
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
                  : 'Skapa konto med e‑post och bekräfta via Bank‑ID.'}
              </div>

              <div className="stack" style={{ marginTop: '1rem' }}>
                <input className="input" placeholder="E‑post" />
                <input className="input" placeholder="Lösenord" type="password" />
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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsAuthenticated(true);
                    setView('feed');
                  }}
                >
                  {authMode === 'login' ? 'Logga in' : 'Skapa konto'}
                </button>
                <button
                  className="btn btn-soft"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                >
                  {authMode === 'login' ? 'Skapa konto' : 'Jag har redan konto'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsAuthenticated(true);
                    setView('feed');
                  }}
                >
                  Fortsätt som gäst
                </button>
              </div>
            </div>
          </div>
        )}
        {/* FEED VIEW */}
        {view === 'feed' && (
          <div>
            {showOnboarding && (
              <div className="section card fade-in pulse">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.35rem' }}>Kom igång på 60 sekunder</h3>
                    <div style={{ color: '#6c6b7a' }}>
                      Följ grupper, lägg till BF-datum och börja dela.
                    </div>
                  </div>
                  <button className="btn btn-ghost" onClick={() => setShowOnboarding(false)}>Stäng</button>
                </div>
                <div className="grid-3" style={{ marginTop: '1rem' }}>
                  <div className="soft-panel">1. Följ en grupp nära dig</div>
                  <div className="soft-panel">2. Lägg in BF-datum</div>
                  <div className="soft-panel">3. Dela första inlägget</div>
                </div>
              </div>
            )}
            <div className="section fade-in">
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
                      <span className="chip">🔥 {item.upvotes}</span>
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
                      <span className="chip">✨ {tip.helpful_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section fade-in">
              {!showNewPost && (
                <button
                  onClick={() => setShowNewPost(true)}
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
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setShowNewPost(false); setNewPostContent(''); }}
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
                        </div>
                      </div>

                      <p style={{ lineHeight: 1.6, marginBottom: '1rem', fontSize: '1rem' }}>
                        {post.content}
                      </p>

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
                      <button className="btn btn-outline" onClick={() => toggleGroupMembership(group.id)}>Gå med</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section card fade-in">
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
                        <div style={{ fontWeight: 700 }}>
                          {user.full_name} {user.is_new_pregnancy ? '🎈' : ''}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6c6b7a' }}>
                          BF {new Date(user.due_date).toLocaleDateString('sv-SE')}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-soft" onClick={() => startConversation(user.id)}>Meddela</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GROUPS VIEW */}
        {view === 'groups' && (
          <div>
            <div className="section">
              <h2 className="section-title">Grupper & Community</h2>
              <div className="section-subtitle">Hitta din gemenskap, byt erfarenheter och ge vidare.</div>
            </div>

            <div className="section grid-3">
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.total_members}</div>
                <div>Totala medlemmar</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.expecting_boys}%</div>
                <div>Väntar pojke</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.expecting_girls}%</div>
                <div>Väntar flicka</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.births_2025}</div>
                <div>Födslar 2025</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{COMMUNITY_STATS.births_2026}</div>
                <div>Födslar 2026</div>
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
                <h3 style={{ marginBottom: '0.75rem' }}>Födslar per månad</h3>
                <div className="stack">
                  {Object.entries(usersByMonth).sort().map(([month, monthUsers]) => (
                    <div key={month} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>{month}</div>
                      <span className="chip">{monthUsers.length}</span>
                    </div>
                  ))}
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
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{currentUser.full_name}</h2>
                    <div style={{ color: '#6c6b7a', fontSize: '1.1rem' }}>@{currentUser.username}</div>
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

                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="btn btn-primary"
                >
                  <Edit size={18} /> Redigera profil
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="chip">📍 {currentUser.location}</span>
                <span className="chip">📅 {new Date(currentUser.due_date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="chip">{posts.filter(p => p.user_id === currentUser.id).length} inlägg</span>
                <span className="chip">{following.length} följer</span>
              </div>
            </div>

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
              <h3 style={{ marginBottom: '0.75rem' }}>Mina inbjudningar</h3>
              <div style={{ color: '#6c6b7a', marginBottom: '0.75rem' }}>
                Du får fler inbjudningar genom att vara aktiv (posta, rösta, skapa grupper).
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="chip">Tillgängliga: {invitesAvailable}</span>
                <span className="chip">Aktivitetspoäng: {myActivityScore}</span>
              </div>
              <button className="btn btn-soft" style={{ marginTop: '1rem' }}>
                Skapa inbjudningskod
              </button>
            </div>

            {profileTab === 'messages' && (
              <div className="section">
                <div className="messages-layout" style={{ gridTemplateColumns: activeConversation ? '320px 1fr' : '1fr' }}>
                  <div className="card" style={{ overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>💬 Meddelanden</h3>
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
            <div className="stack">
              {mustHaves.map(item => (
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
                      <button className="btn btn-soft" onClick={() => toggleMustHaveVote(item.id, 'up')}>⬆️ {item.upvotes}</button>
                      <button className="btn btn-soft" onClick={() => toggleMustHaveVote(item.id, 'verified')}>✅ {item.verified_count} har den</button>
                    </div>
                  </div>
                </div>
              ))}
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
                    <button className="btn btn-soft" onClick={() => toggleTipVote(tip.id, 'up')}>⬆️ {tip.upvotes}</button>
                    <button className="btn btn-soft" onClick={() => toggleTipVote(tip.id, 'helpful')}>✨ {tip.helpful_count}</button>
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
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-soft" onClick={() => toggleLike(post.id)}>❤️ {post.likes_count}</button>
                    <button className="btn btn-soft" onClick={() => setSelectedPost(post.id)}>💬 {post.comments_count}</button>
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
    </div>
  );
}
