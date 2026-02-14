// ============================================================================
// KNOTTZ - Den svenska plattformen för blivande föräldrar
// ============================================================================
// En social plattform för graviditet & föräldraskap med fokus på hållbarhet,
// gemenskap och kunskapsdelning. Knyt samman föräldrar lokalt och globalt!
// ============================================================================

import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useSupabasePosts } from "./hooks/useSupabasePosts";
import {
  Heart,
  Send,
  Edit,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import LandingView from "./views/LandingView";
import ListView from "./views/ListView";
import MustHavesView from "./views/MustHavesView";
import TipsView from "./views/TipsView";
import {
  MOCK_USERS,
  MOCK_GROUPS,
  MOCK_MUST_HAVES,
  MOCK_TIPS,
  MOCK_SCREENSHOTS,
  MOCK_SAVED_POSTS,
  MOCK_GIVEAWAYS,
  MOCK_DAD_JOKES,
  MOCK_POSTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_COMMENTS,
  SCB_STATS,
  SCB_BIRTHS_2024_MONTHS,
  COMMUNITY_STATS,
  MONTH_GUIDE,
} from "./data/mockData";


export default function KnottzApp() {
  const [currentUser, setCurrentUser] = useState({
    id: "",
    username: "",
    full_name: "",
    bio: "",
    due_date: "",
    current_week: 0,
    avatar_url: "",
    location: "",
    household_name: "",
    personal_number: "",
    has_children: null,
    is_new_pregnancy: false,
  });
  const [view, setView] = useState("landing"); // landing, auth, list, profile, musthaves, tips, post, user
  const [previousView, setPreviousView] = useState("list");
  const [detailId, setDetailId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, signup
  const [profilePrivacy, setProfilePrivacy] = useState("public"); // public, private
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const pendingSignupKey = "knottz_pending_signup";
  // menuOpen removed
  const [authUserId, setAuthUserId] = useState(null);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [users, setUsers] = useState(() => {
    if (typeof window === "undefined") return MOCK_USERS;
    try {
      const stored = JSON.parse(
        localStorage.getItem("knottz_manual_friends") || "[]",
      );
      return [...MOCK_USERS, ...stored];
    } catch {
      return MOCK_USERS;
    }
  });
  const [following, setFollowing] = useState(["2", "3"]); // Anna följer Erik och Sara
  const [followers, setFollowers] = useState([]);
  const [householdId, setHouseholdId] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirthDate, setNewChildBirthDate] = useState("");
  // ─── Supabase Posts Hook ─────────────────────────────────
  const {
    posts: dbPosts,
    myLikes,
    isLikedByMe,
    toggleLike: dbToggleLike,
  } = useSupabasePosts(supabase, authUserId);
  // Synka Supabase-posts med lokal state
  useEffect(() => {
    if (dbPosts.length > 0) {
      const dbIds = new Set(dbPosts.map((p) => p.id));
      const mockOnly = MOCK_POSTS.filter((p) => !dbIds.has(p.id));
      setPosts([
        ...dbPosts.map((p) => ({
          ...p,
          liked_by_me: isLikedByMe(p.id),
        })),
        ...mockOnly,
      ]);
    }
  }, [dbPosts, myLikes, isLikedByMe]);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [savedPosts] = useState(MOCK_SAVED_POSTS);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);
  const [showTour, setShowTour] = useState(false);
  const [mustHaveVotes, setMustHaveVotes] = useState({});
  const [tipVotes, setTipVotes] = useState({});
  const [mustHaveRequests, setMustHaveRequests] = useState([]);
  const [mustHaveCategory, setMustHaveCategory] = useState("Alla");
  const [scbPanel, setScbPanel] = useState(false);

  // New features
  const [mustHaves, setMustHaves] = useState(MOCK_MUST_HAVES);
  const [tips, setTips] = useState(MOCK_TIPS);
  const [giveaways] = useState(MOCK_GIVEAWAYS);
  const [dadJokes] = useState(MOCK_DAD_JOKES);
  const [showPunchline, setShowPunchline] = useState({});
  const [profileTab, setProfileTab] = useState("posts"); // posts, messages, friends
  const [listFilter, setListFilter] = useState("Alla"); // Alla, Gravid, Födelsedagar

  // Beräkna månad från due_date
  // getDueMonth reserved for future use

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      setAuthMode("signup");
      if (!isAuthenticated) setView("auth");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const storedPrivacy = localStorage.getItem("knottz_privacy");
    if (storedPrivacy === "public" || storedPrivacy === "private") {
      setProfilePrivacy(storedPrivacy);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("knottz_privacy", profilePrivacy);
  }, [profilePrivacy]);

  const mapProfileToUser = (profile) => {
    const username = profile?.email ? profile.email.split("@")[0] : "knottz";
    const expectedDate =
      profile?.expected_due_date || profile?.due_date || null;
    const currentWeek = expectedDate
      ? Math.max(
          1,
          Math.min(
            40,
            Math.floor(
              (280 - (new Date(expectedDate) - new Date()) / 86400000) / 7,
            ),
          ),
        )
      : 20;
    return {
      id: profile?.user_id || profile?.id,
      username,
      full_name: profile?.display_name || username,
      bio: profile?.bio || "",
      due_date: expectedDate,
      current_week: currentWeek,
      avatar_url: profile?.avatar_url || "",
      location: profile?.location || "",
      household_name: profile?.household_name || "",
      personal_number: profile?.personal_number || "",
      is_private: profile?.is_private || false,
      has_children: profile?.has_children ?? null,
      household_id: profile?.household_id || null,
      is_new_pregnancy: true,
    };
  };

  const loadProfiles = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("profiles")
      .select(
        "id,user_id,email,display_name,bio,avatar_url,location,expected_due_date,household_name,is_private,personal_number,has_children,household_id",
      );
    if (data && data.length) {
      setUsers(data.map(mapProfileToUser));
    }
  };

  const loadFollowing = async (userId) => {
    if (!supabase || !userId) return;
    const { data } = await supabase
      .from("follows")
      .select("followee_id")
      .eq("follower_id", userId);
    if (data) {
      setFollowing(data.map((row) => row.followee_id));
    }
  };

  const loadFollowers = async (userId) => {
    if (!supabase || !userId) return;
    const { data } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("followee_id", userId);
    if (data) {
      setFollowers(data.map((row) => row.follower_id));
    }
  };

  const loadChildren = async (nextHouseholdId) => {
    if (!supabase || !nextHouseholdId) return;
    const { data } = await supabase
      .from("children")
      .select("id,name,birth_date")
      .eq("household_id", nextHouseholdId);
    if (data) {
      setChildrenList(
        data.map((row) => ({
          id: row.id,
          name: row.name || "",
          birthDate: row.birth_date || "",
        })),
      );
    }
  };

  const loadCurrentProfile = async (userId) => {
    if (!userId) return;
    if (supabase) {
      const { data } = await supabase
        .from("profiles")
        .select(
          "id,user_id,email,display_name,bio,avatar_url,location,expected_due_date,household_name,is_private,personal_number,has_children,household_id",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        const mapped = mapProfileToUser(data);
        setCurrentUser(mapped);
        setProfilePrivacy(data.is_private ? "private" : "public");
        setHouseholdId(data.household_id || null);
        return mapped;
      }
    }
    const cached = localStorage.getItem(`knottz_profile_cache_${userId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setCurrentUser(parsed);
      return parsed;
    }
  };

  const ensureProfileFromPending = async (user) => {
    if (!supabase || !user) return;
    const pendingRaw = localStorage.getItem(pendingSignupKey);
    if (!pendingRaw) return;
    const pending = JSON.parse(pendingRaw);

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      localStorage.removeItem(pendingSignupKey);
      return;
    }

    const fallbackName =
      pending.authEmail?.split("@")[0] || `Hushåll ${user.id.slice(0, 4)}`;
    const household = {
      name: `Hushåll ${fallbackName}`,
      account_type: "family",
      parent1_name: null,
      parent2_name: null,
    };
    const { data: householdRow, error: householdErr } = await supabase
      .from("households")
      .insert(household)
      .select("id")
      .single();
    if (householdErr) return;

    const profile = {
      id: user.id,
      user_id: user.id,
      household_id: householdRow.id,
      email: pending.authEmail || user.email,
      display_name: pending.authEmail || user.email,
      bio: "",
      avatar_url: "",
      expected_due_date: null,
      location: "",
      household_name: "",
      is_private: false,
      personal_number: "",
      has_children: null,
      inviter_id: null,
      is_admin: false,
    };
    const { error: profileErr } = await supabase
      .from("profiles")
      .insert(profile);
    if (profileErr) return;

    localStorage.removeItem(pendingSignupKey);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const session = data.session;
        setAuthEmail(session.user.email || "");
        setAuthUserId(session.user.id);
        setIsAuthenticated(true);
        await ensureProfileFromPending(session.user);
        const profile = await loadCurrentProfile(session.user.id);
        await loadProfiles();
        await loadFollowing(session.user.id);
        await loadFollowers(session.user.id);
        const complete = profile
          ? Boolean(profile.full_name && profile.avatar_url)
          : false;
        setView(complete ? "list" : "profile");
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setAuthEmail(session.user.email || "");
          setAuthUserId(session.user.id);
          setIsAuthenticated(true);
          await ensureProfileFromPending(session.user);
          const profile = await loadCurrentProfile(session.user.id);
          await loadProfiles();
          await loadFollowing(session.user.id);
          await loadFollowers(session.user.id);
          const complete = profile
            ? Boolean(profile.full_name && profile.avatar_url)
            : false;
          setView(complete ? "list" : "profile");
        } else {
          setIsAuthenticated(false);
          setAuthUserId(null);
        }
      },
    );
    return () => authListener.subscription.unsubscribe();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!householdId) return;
    loadChildren(householdId);
  }, [householdId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const onboarded = localStorage.getItem("knottz_onboarded");
    if (!onboarded) {
      setView("profile");
      setShowQuickStart(true);
      setShowProfileModal(true);
    }
  }, [isAuthenticated]);

  // menuOpen removed

  const mustHaveCategories = [
    "Alla",
    ...new Set(mustHaves.map((item) => item.category)),
  ];
  const filteredMustHaves =
    mustHaveCategory === "Alla"
      ? mustHaves
      : mustHaves.filter((item) => item.category === mustHaveCategory);

  const trendingMustHaves = [...mustHaves]
    .sort(
      (a, b) =>
        b.upvotes + b.verified_count * 2 - (a.upvotes + a.verified_count * 2),
    )
    .slice(0, 3);

  const trendingTips = [...tips]
    .sort((a, b) => b.upvotes + b.helpful_count - (a.upvotes + a.helpful_count))
    .slice(0, 3);

  const myPostsCount = posts.filter((p) => p.user_id === currentUser.id).length;

  // Hantera like/unlike
  const toggleLike = async (postId) => {
    await dbToggleLike(postId);
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.liked_by_me;
          return {
            ...post,
            liked_by_me: !wasLiked,
            likes_count: wasLiked
              ? Math.max(0, post.likes_count - 1)
              : post.likes_count + 1,
          };
        }
        return post;
      }),
    );
  };

  // Följ/avfölja användare
  const toggleFollow = async (userId) => {
    if (following.includes(userId)) {
      setFollowing(following.filter((id) => id !== userId));
      if (supabase && authUserId) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", authUserId)
          .eq("followee_id", userId);
      }
    } else {
      setFollowing([...following, userId]);
      if (supabase && authUserId) {
        await supabase
          .from("follows")
          .insert({ follower_id: authUserId, followee_id: userId });
      }
    }
  };

  const addManualFriend = ({ name, dueDate, birthday }) => {
    const entry = {
      id: `manual-${Date.now()}`,
      full_name: name,
      due_date: dueDate || "",
      child_birthdate: birthday || "",
    };
    setUsers((prev) => {
      const updated = [...prev, entry];
      const manualOnly = updated.filter((u) => u.id?.startsWith?.("manual-"));
      localStorage.setItem(
        "knottz_manual_friends",
        JSON.stringify(manualOnly),
      );
      return updated;
    });
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

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments_count: post.comments_count + 1 }
          : post,
      ),
    );

    setNewComment("");
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
    return date.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
  };

  // Hämta användarinfo
  const getUser = (userId) => users.find((u) => u.id === userId);

  const isImageUrl = (value) =>
    typeof value === "string" &&
    (value.startsWith("data:") ||
      value.startsWith("http") ||
      value.includes(".png") ||
      value.includes(".jpg"));

  const renderAvatar = (user, size = 40) => {
    if (isImageUrl(user.avatar_url)) {
      return (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      );
    }
    const initials = (user.full_name || user.username || "KN")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#f1f5f9",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: size * 0.4,
          color: "#111827",
        }}
      >
        {initials}
      </div>
    );
  };

  const canInteract = isAuthenticated;

  const onboardingSteps = [
    { id: "name", label: "Fyll i namn", done: Boolean(currentUser.full_name) },
    {
      id: "birthday",
      label: "Lägg till födelsedag",
      done: Boolean(currentUser.personal_number),
    },
    {
      id: "avatar",
      label: "Ladda upp profilbild",
      done: Boolean(currentUser.avatar_url),
    },
    {
      id: "children",
      label: "Barninfo (BF eller födelsedatum)",
      done: Boolean(currentUser.due_date || childrenList.length),
    },
    {
      id: "friend",
      label: "Lägg till en vän i listan",
      done: users.some((u) => u.id?.startsWith?.("manual-")),
    },
    {
      id: "vote",
      label: "Rösta på en must have",
      done: Object.keys(mustHaveVotes).length > 0,
    },
  ];

  const onboardingCompleted = onboardingSteps.filter(
    (step) => step.done,
  ).length;
  const onboardingTotal = onboardingSteps.length;
  const onboardingProgress = Math.round(
    (onboardingCompleted / onboardingTotal) * 100,
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextUrl = reader.result;
      setCurrentUser((prev) => ({ ...prev, avatar_url: nextUrl }));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, avatar_url: nextUrl } : u,
        ),
      );
    };
    reader.readAsDataURL(file);
    if (supabase && authUserId) {
      const tempReader = new FileReader();
      tempReader.onload = async () => {
        const nextUrl = tempReader.result;
        await supabase
          .from("profiles")
          .update({ avatar_url: nextUrl || "" })
          .eq("user_id", authUserId);
      };
      tempReader.readAsDataURL(file);
    }
  };

  const backToPrevious = () => {
    setView(previousView || "list");
    setDetailId(null);
  };

  const openUserProfile = (userId) => {
    setPreviousView(view);
    setDetailId(userId);
    setView("user");
  };

  const focusOnboardingStep = (stepId) => {
    if (
      stepId === "name" ||
      stepId === "birthday" ||
      stepId === "avatar" ||
      stepId === "children"
    ) {
      setView("profile");
      setShowProfileModal(true);
      return;
    }
    if (stepId === "friend") {
      setView("list");
      return;
    }
    if (stepId === "vote") {
      setView("musthaves");
      return;
    }
  };

  const signIn = async () => {
    setAuthError("");
    setAuthNotice("");
    if (!supabase) return setAuthError("Supabase saknas");
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) setAuthError("Fel e-post eller lösenord");
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setView("auth");
  };

  const signUp = async () => {
    setAuthError("");
    setAuthNotice("");
    if (!supabase) return setAuthError("Supabase saknas");
    if (authPassword !== authPasswordConfirm) {
      return setAuthError("Lösenorden matchar inte");
    }
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error || !data.user) return setAuthError("Kunde inte skapa konto");
    const pendingPayload = {
      authEmail,
    };
    localStorage.setItem(pendingSignupKey, JSON.stringify(pendingPayload));
    setAuthNotice("Verifiera via e‑post för att slutföra din registrering.");
    return;
  };

  // Gå med/lämna grupp
  const toggleGroupMembership = (groupId) => {
    if (!canInteract) return;
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          const nextMember = !g.is_member;
          if (nextMember) {
            _setJoinedGroupFlag(true);
            localStorage.setItem("knottz_joined_group", "1");
          }
          return {
            ...g,
            is_member: nextMember,
            members: g.is_member ? g.members - 1 : g.members + 1,
          };
        }
        return g;
      }),
    );
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
    setConversations(
      conversations.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              last_message: newMessage,
              last_message_time: new Date().toISOString(),
            }
          : conv,
      ),
    );

    setNewMessage("");
  };

  // Starta ny konversation
  const startConversation = (userId) => {
    const existingConv = conversations.find((c) => c.other_user_id === userId);
    if (existingConv) {
      setActiveConversation(existingConv.id);
      setView("profile");
      setProfileTab("messages");
      return;
    }

    const newConv = {
      id: `conv-${Math.random().toString(36).slice(2, 8)}`,
      other_user_id: userId,
      last_message: "",
      last_message_time: new Date().toISOString(),
      unread: 0,
    };

    setConversations([newConv, ...conversations]);
    setMessages({ ...messages, [newConv.id]: [] });
    setActiveConversation(newConv.id);
    setView("profile");
    setProfileTab("messages");
  };

  // Toggle upvote for must haves
  const toggleMustHaveVote = (id, voteType) => {
    if (!canInteract) return;
    if (mustHaveVotes[id]) return;
    setMustHaves(
      mustHaves.map((item) => {
        if (item.id === id) {
          if (voteType === "up") {
            return { ...item, upvotes: item.upvotes + 1 };
          } else if (voteType === "down") {
            return { ...item, downvotes: item.downvotes + 1 };
          } else if (voteType === "verified") {
            return { ...item, verified_count: item.verified_count + 1 };
          }
        }
        return item;
      }),
    );
    setMustHaveVotes({ ...mustHaveVotes, [id]: voteType });
    localStorage.setItem("knottz_voted", "1");
  };

  // Toggle vote for tips
  const toggleTipVote = (id, voteType) => {
    if (!canInteract) return;
    if (tipVotes[id]) return;
    setTips(
      tips.map((tip) => {
        if (tip.id === id) {
          if (voteType === "up") {
            return { ...tip, upvotes: tip.upvotes + 1 };
          } else if (voteType === "helpful") {
            return { ...tip, helpful_count: tip.helpful_count + 1 };
          }
        }
        return tip;
      }),
    );
    setTipVotes({ ...tipVotes, [id]: voteType });
    localStorage.setItem("knottz_voted", "1");
  };

  // Reserved: giveaway + dad joke voting

  // Toggle punchline visibility
  const togglePunchline = (id) => {
    setShowPunchline({ ...showPunchline, [id]: !showPunchline[id] });
  };

  const handleProfileSave = async () => {
    if (!authUserId) return;
    const payload = {
      user_id: authUserId,
      display_name: currentUser.full_name || "",
      location: currentUser.location || "",
      bio: currentUser.bio || "",
      avatar_url: currentUser.avatar_url || "",
      personal_number: currentUser.personal_number || "",
      household_name: currentUser.household_name || "",
      expected_due_date: currentUser.due_date || null,
      has_children: currentUser.has_children,
      is_private: profilePrivacy === "private",
    };
    if (supabase) {
      await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" });
    }

    const cached = {
      ...currentUser,
      full_name: payload.display_name,
      location: payload.location,
      bio: payload.bio,
      avatar_url: payload.avatar_url,
      personal_number: payload.personal_number,
      household_name: payload.household_name,
      due_date: payload.expected_due_date,
      has_children: payload.has_children,
      is_private: payload.is_private,
    };
    localStorage.setItem(
      `knottz_profile_cache_${authUserId}`,
      JSON.stringify(cached),
    );
    setCurrentUser(cached);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...cached } : u)),
    );
    loadProfiles();
    setShowProfileModal(false);
    setShowQuickStart(false);
    localStorage.setItem("knottz_onboarded", "1");
    setView("list");
    setToastMessage("Profilen är sparad.");
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --bg: #fbfaff;
          --bg-strong: #f4f1fb;
          --card: #ffffff;
          --ink: #111111;
          --muted: #666666;
          --accent: #111111;
          --accent-strong: #000000;
          --accent-soft: #f2effa;
          --accent-gold: #d7b56d;
          --accent-mint: #8fc7b3;
          --border: #ebe7f4;
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
          background: linear-gradient(180deg, #fbfaff 0%, #ffffff 360px);
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
          background: rgba(255,255,255,0.9);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 74px;
          z-index: 99;
          backdrop-filter: blur(10px);
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
          border: 1px solid var(--border);
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
        .landing { display: grid; gap: 2rem; }
        .landing-hero {
          display: grid;
          gap: 2rem;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          background: linear-gradient(135deg, #f6f1ff 0%, #fdfcff 100%);
          border: 1px solid #ebe5ff;
          padding: 2rem;
          border-radius: 28px;
          box-shadow: var(--shadow-soft);
        }
        .landing-hero-copy h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.1rem);
          margin-bottom: 0.75rem;
        }
        .landing-hero-copy p { color: #6c6b7a; font-size: 1.05rem; margin-bottom: 1.5rem; }
        .landing-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #efe9ff;
          color: #4a2c88;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }
        .landing-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .landing-note { margin-top: 1rem; color: #6c6b7a; font-size: 0.95rem; }
        .landing-phone {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #eceaf5;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          display: grid;
          gap: 1rem;
        }
        .phone-header { font-weight: 700; display: grid; gap: 0.35rem; }
        .phone-tabs { display: flex; gap: 0.5rem; font-size: 0.8rem; color: #6c6b7a; }
        .phone-list { display: grid; gap: 0.75rem; }
        .phone-row { display: flex; gap: 0.75rem; align-items: center; }
        .phone-name { font-weight: 700; }
        .phone-sub { font-size: 0.8rem; color: #6c6b7a; }
        .landing-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        .landing-card .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .mini-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .mini-title { font-weight: 700; }
        .mini-sub { font-size: 0.85rem; color: #6c6b7a; }
        .gift-card { background: linear-gradient(135deg, #f9f6ff 0%, #ffffff 100%); }
        .gift-title { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem; }
        .list-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 16px; border: 1px solid var(--border); }
        .list-user { display: flex; gap: 0.75rem; align-items: center; cursor: pointer; }
        .list-name { font-weight: 700; }
        .list-sub { color: #6c6b7a; font-size: 0.85rem; }
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
          width: min(860px, 95vw);
          max-height: 90vh;
          overflow: auto;
          padding: 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #111;
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          box-shadow: var(--shadow);
          font-weight: 600;
          z-index: 999;
          animation: fadeInUp 0.25s ease both;
        }

        @media (max-width: 900px) {
          .app-main { max-width: 100%; }
          .messages-layout { grid-template-columns: 1fr; height: auto; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .landing-hero { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .app-header-inner { padding: 0 1rem; }
          .app-nav-inner { padding: 0.5rem 1rem; }
          .app-main { padding: 0 1rem; margin-top: 1.5rem; }
          .card { padding: 1.1rem; }
          .user-chip { padding: 0.35rem 0.6rem; }
          .landing-hero { padding: 1.5rem; }
        }
      `}</style>
      {toastMessage && <div className="toast">{toastMessage}</div>}
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div className="logo-mark">
              <img
                src="/knottz-logo.png"
                alt="Knottz"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <h1 className="app-logo">Knottz</h1>
          </div>

          {isAuthenticated ? (
            <button
              className="user-chip"
              onClick={() => setView("profile")}
              style={{ border: "none", cursor: "pointer" }}
              aria-label="Öppna profil"
            >
              {renderAvatar(currentUser, 34)}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setAuthMode("login");
                  setView("auth");
                }}
              >
                Logga in
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAuthMode("signup");
                  setView("auth");
                }}
              >
                Registrera dig
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="app-nav">
          <div className="app-nav-inner">
            {[
              { id: "list", label: "Lista" },
              { id: "inspiration", label: "Inspiration" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className="nav-btn"
                data-active={view === id}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="app-main">
        {view === "landing" && (
          <LandingView
            onSignup={() => {
              setAuthMode("signup");
              setView("auth");
            }}
            onLogin={() => {
              setAuthMode("login");
              setView("auth");
            }}
            previewUsers={users.slice(0, 3)}
            trendingMustHaves={trendingMustHaves.slice(0, 3)}
            trendingTips={trendingTips.slice(0, 3)}
            renderAvatar={renderAvatar}
          />
        )}
        {/* AUTH VIEW */}
        {view === "auth" && (
          <div
            className="section"
            style={{ maxWidth: "520px", margin: "2rem auto" }}
          >
            <div className="card card-strong">
              <h2 className="section-title">
                {authMode === "login" ? "Välkommen tillbaka" : "Skapa konto"}
              </h2>
              <div className="section-subtitle">
                {authMode === "login"
                  ? "Logga in med din e-post."
                  : "Skapa konto med e‑post och lösenord."}
              </div>

              <div className="stack" style={{ marginTop: "1rem" }}>
                <input
                  className="input"
                  placeholder="E‑post"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Lösenord"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
                {authMode === "signup" && (
                  <input
                    className="input"
                    placeholder="Upprepa lösenord"
                    type="password"
                    value={authPasswordConfirm}
                    onChange={(e) => setAuthPasswordConfirm(e.target.value)}
                  />
                )}
                {authMode === "signup" && (
                  <div className="soft-panel">
                    <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
                      Nästa steg
                    </div>
                    <div style={{ color: "#6c6b7a", fontSize: "0.9rem" }}>
                      Efter att du registrerat dig kan du lägga till namn,
                      födelsedag och barns födelsedagar i din profil.
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => (authMode === "login" ? signIn() : signUp())}
                >
                  {authMode === "login" ? "Logga in" : "Skapa konto"}
                </button>
                {authNotice && (
                  <div
                    style={{
                      color: "#111827",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Verifiera via e‑post.
                  </div>
                )}
                {authError && (
                  <div style={{ color: "#b00020", fontSize: "0.9rem" }}>
                    {authError}
                  </div>
                )}
                <button
                  className="btn btn-soft"
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "signup" : "login")
                  }
                >
                  {authMode === "login" ? "Skapa konto" : "Jag har redan konto"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setView("landing")}
                >
                  Fortsätt som gäst
                </button>
              </div>
            </div>
          </div>
        )}
        {/* LIST VIEW */}
        {view === "list" && (
          <ListView
            users={users}
            listFilter={listFilter}
            setListFilter={setListFilter}
            renderAvatar={renderAvatar}
            onOpenProfile={openUserProfile}
            onOpenStats={() => setScbPanel(true)}
            onAddFriend={addManualFriend}
            onShareInvite={() => {
              const shareUrl = `${window.location.origin}?mode=signup`;
              if (navigator.share) {
                navigator.share({
                  title: "Knottz",
                  text: "Skapa din lista över vänner som väntar barn.",
                  url: shareUrl,
                });
              } else {
                window.location.href = `mailto:?subject=Knottz&body=Skapa din lista här: ${shareUrl}`;
              }
            }}
          />
        )}
        {view === "inspiration" && (
          <div className="section fade-in">
            <div className="section">
              <h2 className="section-title">Inspiration</h2>
              <div className="section-subtitle">
                Topplistor och tips som gör vardagen enklare.
              </div>
            </div>

            <div className="grid-2">
              <div className="card card-strong">
                <div className="card-head">
                  <div className="mini-title">Must Haves</div>
                  <button className="btn btn-soft" onClick={() => setView("musthaves")}>
                    Se alla
                  </button>
                </div>
                <div className="stack">
                  {trendingMustHaves.map((item) => (
                    <div key={item.id} className="mini-row">
                      <div>
                        <div className="mini-title">{item.title}</div>
                        <div className="mini-sub">{item.category}</div>
                      </div>
                      <span className="chip">{item.upvotes + item.verified_count} röster</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card-strong">
                <div className="card-head">
                  <div className="mini-title">Tips & tricks</div>
                  <button className="btn btn-soft" onClick={() => setView("tips")}>
                    Se alla
                  </button>
                </div>
                <div className="stack">
                  {trendingTips.map((tip) => (
                    <div key={tip.id} className="mini-row">
                      <div>
                        <div className="mini-title">{tip.title}</div>
                        <div className="mini-sub">{tip.category}</div>
                      </div>
                      <span className="chip">{tip.upvotes + tip.helpful_count} röster</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "groups" && (
          <div>
            <div className="section">
              <h2 className="section-title">AlltIAllo</h2>
              <div className="section-subtitle">
                Hitta din gemenskap, byt erfarenheter och ge vidare.
              </div>
            </div>

            <div className="section grid-3">
              <button
                className="btn btn-soft"
                onClick={() => setView("musthaves")}
              >
                Must Haves
              </button>
              <button className="btn btn-soft" onClick={() => setView("tips")}>
                Tips & Tricks
              </button>
              <button
                className="btn btn-soft"
                onClick={() => setScbPanel(true)}
              >
                SCB‑statistik
              </button>
            </div>

            <div className="section grid-3">
              <div className="stat-card">
                <div className="stat-value">
                  {COMMUNITY_STATS.total_members}
                </div>
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
                <div className="stat-value">
                  {SCB_STATS.births_2024_boys} / {SCB_STATS.births_2024_girls}
                </div>
                <div>Pojkar / Flickor</div>
              </div>
            </div>

            <div className="section grid-2">
              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Upptäck grupper</h3>
                <div className="stack">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "2rem" }}>{group.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{group.name}</div>
                          <div
                            style={{ fontSize: "0.85rem", color: "#6c6b7a" }}
                          >
                            {group.description}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6c6b7a" }}>
                            {group.members} medlemmar
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleGroupMembership(group.id)}
                        className={`btn ${group.is_member ? "btn-ghost" : "btn-primary"}`}
                        disabled={!canInteract}
                      >
                        {group.is_member ? "Följer" : "Gå med"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>
                  Marknadsplats · Skänk bort
                </h3>
                <div className="stack">
                  {giveaways.slice(0, 3).map((item) => {
                    const author = getUser(item.created_by);
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.title}</div>
                          <div
                            style={{ fontSize: "0.85rem", color: "#6c6b7a" }}
                          >
                            {item.location} · {item.condition}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6c6b7a" }}>
                            Från {author.full_name}
                          </div>
                        </div>
                        <span className="chip">{item.category}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="btn btn-soft"
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  Öppna marknadsplatsen
                </button>
              </div>
            </div>

            <div className="section grid-2">
              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Pappa-skämt</h3>
                <div className="stack">
                  {dadJokes.slice(0, 3).map((joke) => (
                    <div key={joke.id}>
                      <div style={{ fontWeight: 700 }}>{joke.joke}</div>
                      {!showPunchline[joke.id] ? (
                        <button
                          onClick={() => togglePunchline(joke.id)}
                          className="btn btn-soft"
                          style={{ marginTop: "0.5rem" }}
                        >
                          Visa svaret
                        </button>
                      ) : (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            color: "#7b6df0",
                            fontWeight: 700,
                          }}
                        >
                          {joke.punchline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Säsongsmönster</h3>
                <div style={{ color: "#6c6b7a" }}>
                  Födslar är ofta som högst under sensommar och tidig höst
                  enligt SCB:s sammanställningar. Vi använder detta som
                  inspiration i appens guide.
                </div>
              </div>
            </div>

            <div className="section card">
              <h3 style={{ marginBottom: "0.75rem" }}>Månadens guide</h3>
              <div className="grid-3">
                {MONTH_GUIDE.map((item) => (
                  <div key={item.month} className="stat-card">
                    <div style={{ fontWeight: 700 }}>{item.month}</div>
                    <div style={{ fontSize: "0.85rem", color: "#6c6b7a" }}>
                      {item.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAVED VIEW */}
        {view === "saved" && (
          <div>
            <div className="section">
              <h2 className="section-title">Sparade inlägg</h2>
              <div className="section-subtitle">
                Det du vill hitta snabbt igen.
              </div>
            </div>
            <div className="section card">
              {savedPosts.length === 0 ? (
                <div style={{ color: "#6c6b7a" }}>
                  Inga sparade inlägg ännu.
                </div>
              ) : (
                <div className="stack">
                  {savedPosts.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        boxShadow: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6c6b7a" }}>
                        {item.type} · {item.created_at}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {view === "settings" && (
          <div>
            <div className="section">
              <h2 className="section-title">Inställningar</h2>
              <div className="section-subtitle">
                Styr integritet och standardval.
              </div>
            </div>
            <div className="section card">
              <h3 style={{ marginBottom: "0.75rem" }}>Profilens integritet</h3>
              <div className="subnav">
                <button
                  className={`btn ${profilePrivacy === "public" ? "btn-primary" : "btn-soft"}`}
                  onClick={() => setProfilePrivacy("public")}
                >
                  Öppen profil
                </button>
                <button
                  className={`btn ${profilePrivacy === "private" ? "btn-primary" : "btn-soft"}`}
                  onClick={() => setProfilePrivacy("private")}
                >
                  Privat profil
                </button>
              </div>
              <div style={{ color: "#6c6b7a", marginTop: "0.75rem" }}>
                Detta blir standarden för nya inlägg. Du kan ändra per inlägg.
              </div>
            </div>
            <div className="section card">
              <h3 style={{ marginBottom: "0.75rem" }}>Konto</h3>
              <button className="btn btn-ghost" onClick={handleLogout}>
                <LogOut size={16} /> Logga ut
              </button>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {view === "profile" && (
          <div>
            <div className="card card-strong section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    {renderAvatar(currentUser, 56)}
                    <label
                      style={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        background: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: "999px",
                        padding: "0.25rem",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-soft)",
                      }}
                    >
                      <ImageIcon size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.6rem", marginBottom: "0.15rem" }}>
                      {currentUser.full_name || "Din profil"}
                    </h2>
                    <div style={{ color: "#6c6b7a", fontSize: "0.95rem" }}>
                      @{currentUser.username || "knottz"}
                    </div>
                    {currentUser.current_week ? (
                      <span className="pill" style={{ marginTop: "0.5rem" }}>
                        Vecka {currentUser.current_week} av 40
                      </span>
                    ) : null}
                  </div>
                </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="btn btn-primary"
                >
                  <Edit size={18} /> Redigera profil
                </button>
                <button
                  className="btn btn-soft"
                  onClick={() => setView("settings")}
                >
                  <Settings size={18} /> Inställningar
                </button>
              </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {currentUser.household_name && (
                  <span className="chip">🏡 {currentUser.household_name}</span>
                )}
                <span className="chip">
                  📍 {currentUser.location || "Lägg till ort"}
                </span>
                {currentUser.personal_number && (
                  <span className="chip">🎂 {currentUser.personal_number}</span>
                )}
                <span className="chip">
                  📅{" "}
                  {currentUser.due_date
                    ? new Date(currentUser.due_date).toLocaleDateString(
                        "sv-SE",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "Lägg till BF"}
                </span>
                <span className="chip">
                  {posts.filter((p) => p.user_id === currentUser.id).length}{" "}
                  inlägg
                </span>
                <span className="chip">{following.length} följer</span>
                <span className="chip">{followers.length} följare</span>
              </div>
            </div>

            {showProfileModal && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: "0.25rem" }}>
                        Färdigställ din profil
                      </h3>
                      <div style={{ color: "#6c6b7a", fontSize: "0.9rem" }}>
                        Fyll i uppgifter så sparas de direkt på din profil.
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setShowProfileModal(false)}
                    >
                      Stäng
                    </button>
                  </div>

                  <div className="stack">
                  <input
                    className="input"
                    placeholder="Namn"
                    value={currentUser.full_name || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        full_name: e.target.value,
                      })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Familjenamn"
                    value={currentUser.household_name || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        household_name: e.target.value,
                      })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Ort"
                    value={currentUser.location || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        location: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="textarea"
                    placeholder="Bio"
                    value={currentUser.bio || ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, bio: e.target.value })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Födelsedag (åååå-mm-dd)"
                    type="date"
                    value={currentUser.personal_number || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        personal_number: e.target.value,
                      })
                    }
                  />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                      Har ni barn redan?
                    </div>
                    <div className="subnav">
                      <button
                        className={`btn ${currentUser.has_children === true ? "btn-primary" : "btn-soft"}`}
                        onClick={() =>
                          setCurrentUser({ ...currentUser, has_children: true })
                        }
                      >
                        Ja
                      </button>
                      <button
                        className={`btn ${currentUser.has_children === false ? "btn-primary" : "btn-soft"}`}
                        onClick={() =>
                          setCurrentUser({
                            ...currentUser,
                            has_children: false,
                          })
                        }
                      >
                        Nej
                      </button>
                    </div>
                  </div>
                  {currentUser.has_children && (
                    <div
                      className="card"
                      style={{
                        boxShadow: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                        Lägg till barn
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gap: "0.5rem",
                          gridTemplateColumns: "1fr 1fr",
                        }}
                      >
                        <input
                          className="input"
                          placeholder="Barnets namn"
                          value={newChildName}
                          onChange={(e) => setNewChildName(e.target.value)}
                        />
                        <input
                          className="input"
                          type="date"
                          value={newChildBirthDate}
                          onChange={(e) => setNewChildBirthDate(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-soft"
                        style={{ marginTop: "0.75rem" }}
                        onClick={async () => {
                          if (!newChildBirthDate || !householdId || !supabase)
                            return;
                          const { data } = await supabase
                            .from("children")
                            .insert({
                              household_id: householdId,
                              name: newChildName || "",
                              birth_date: newChildBirthDate,
                            })
                            .select("id,name,birth_date")
                            .single();
                          if (data) {
                            setChildrenList((prev) => [
                              ...prev,
                              {
                                id: data.id,
                                name: data.name || "",
                                birthDate: data.birth_date,
                              },
                            ]);
                            setNewChildName("");
                            setNewChildBirthDate("");
                          }
                        }}
                      >
                        Lägg till barn
                      </button>
                      {childrenList.length > 0 && (
                        <div className="stack" style={{ marginTop: "0.75rem" }}>
                          {childrenList.map((child) => (
                            <div
                              key={child.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.9rem",
                              }}
                            >
                              <span>{child.name || "Barn"}</span>
                              <span>{child.birthDate}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <label style={{ fontWeight: 600 }}>
                    Beräknat datum för barnet
                  </label>
                  <input
                    className="input"
                    type="date"
                    value={currentUser.due_date || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        due_date: e.target.value,
                      })
                    }
                  />
                  <div className="subnav">
                    <button
                      className={`btn ${profilePrivacy === "public" ? "btn-primary" : "btn-soft"}`}
                      onClick={() => setProfilePrivacy("public")}
                    >
                      Öppen profil
                    </button>
                    <button
                      className={`btn ${profilePrivacy === "private" ? "btn-primary" : "btn-soft"}`}
                      onClick={() => setProfilePrivacy("private")}
                    >
                      Privat profil
                    </button>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleProfileSave}
                  >
                    Spara
                  </button>
                </div>
                </div>
              </div>
            )}

            {showQuickStart && (
              <div className="section card fade-in">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3 style={{ marginBottom: "0.35rem" }}>
                      Kom igång på 60 sek
                    </h3>
                    <div style={{ color: "#6c6b7a" }}>
                      Du är {onboardingProgress}% klar. När du når 100% är din
                      profil klar.
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowQuickStart(false)}
                  >
                    Stäng
                  </button>
                </div>

                <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      height: 8,
                      background: "#f1f5f9",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${onboardingProgress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg,#111827,#4b5563)",
                      }}
                    />
                  </div>
                </div>

                <div className="stack">
                  {onboardingSteps.map((step) => (
                    <div
                      key={step.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{step.label}</div>
                      {step.done ? (
                        <span className="chip">Klar</span>
                      ) : (
                        <button
                          className="btn btn-soft"
                          onClick={() => focusOnboardingStep(step.id)}
                        >
                          Fixa
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  className="section"
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  <button
                    className="btn btn-soft"
                    onClick={() => setShowTour(true)}
                  >
                    Se hur appen funkar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      localStorage.setItem("knottz_onboarded", "1");
                      setShowQuickStart(false);
                    }}
                  >
                    Jag är klar
                  </button>
                </div>
              </div>
            )}

            <div className="section grid-2">
              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Mina favoriter</h3>
                <div className="stack">
                  {mustHaves
                    .filter((item) => mustHaveVotes[item.id])
                    .slice(0, 4)
                    .map((item) => (
                      <div key={item.id} className="mini-row">
                        <div>
                          <div className="mini-title">{item.title}</div>
                          <div className="mini-sub">{item.category}</div>
                        </div>
                        <span className="chip">Must have</span>
                      </div>
                    ))}
                  {tips
                    .filter((tip) => tipVotes[tip.id])
                    .slice(0, 4)
                    .map((tip) => (
                      <div key={tip.id} className="mini-row">
                        <div>
                          <div className="mini-title">{tip.title}</div>
                          <div className="mini-sub">{tip.category}</div>
                        </div>
                        <span className="chip">Tips</span>
                      </div>
                    ))}
                  {Object.keys(mustHaveVotes).length === 0 &&
                    Object.keys(tipVotes).length === 0 && (
                      <div style={{ color: "#6c6b7a" }}>
                        När du sparar favoriter dyker de upp här.
                      </div>
                    )}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: "0.75rem" }}>Nästa i listan</h3>
                {(() => {
                  const entries = users.flatMap((user) => {
                    const rows = [];
                    if (user?.due_date) {
                      rows.push({
                        id: `${user.id}-due`,
                        label: "BF",
                        date: user.due_date,
                        user,
                      });
                    }
                    if (user?.child_birthdate) {
                      rows.push({
                        id: `${user.id}-birthday`,
                        label: "Födelsedag",
                        date: user.child_birthdate,
                        user,
                      });
                    }
                    return rows;
                  });
                  const next = entries
                    .filter((entry) => entry.date)
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                    )
                    .slice(0, 4);
                  if (next.length === 0) {
                    return (
                      <div style={{ color: "#6c6b7a" }}>
                        Lägg till dina första datum i listan.
                      </div>
                    );
                  }
                  return (
                    <div className="stack">
                      {next.map((entry) => (
                        <div key={entry.id} className="mini-row">
                          <div>
                            <div className="mini-title">
                              {entry.user.full_name}
                            </div>
                            <div className="mini-sub">
                              {entry.label}{" "}
                              {new Date(entry.date).toLocaleDateString("sv-SE")}
                            </div>
                          </div>
                          <button
                            className="btn btn-soft"
                            onClick={() => openUserProfile(entry.user.id)}
                          >
                            Visa
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {profileTab === "messages" && (
              <div className="section">
                <div
                  className="messages-layout"
                  style={{
                    gridTemplateColumns: activeConversation
                      ? "320px 1fr"
                      : "1fr",
                  }}
                >
                  <div className="card" style={{ overflowY: "auto" }}>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
                      Meddelanden
                    </h3>
                    {conversations.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#6c6b7a",
                        }}
                      >
                        Inga konversationer än.
                      </div>
                    ) : (
                      <div>
                        {conversations.map((conv) => {
                          const otherUser = getUser(conv.other_user_id);
                          return (
                            <div
                              key={conv.id}
                              onClick={() => setActiveConversation(conv.id)}
                              style={{
                                padding: "1rem",
                                background:
                                  activeConversation === conv.id
                                    ? "#f0edff"
                                    : "transparent",
                                borderRadius: "12px",
                                cursor: "pointer",
                                marginBottom: "0.5rem",
                                border:
                                  activeConversation === conv.id
                                    ? "2px solid #e3ddff"
                                    : "2px solid transparent",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "1rem",
                                  alignItems: "center",
                                }}
                              >
                                {renderAvatar(otherUser, 32)}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "0.95rem",
                                    }}
                                  >
                                    {otherUser.full_name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      color: "#6c6b7a",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {conv.last_message ||
                                      "Ingen konversation än"}
                                  </div>
                                </div>
                                {conv.unread > 0 && (
                                  <div className="badge-inline">
                                    {conv.unread}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {activeConversation && (
                    <div
                      className="card"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div
                        style={{
                          padding: "1rem 1.5rem",
                          borderBottom: "2px solid #e3ddff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                          }}
                        >
                          {renderAvatar(
                            getUser(
                              conversations.find(
                                (c) => c.id === activeConversation,
                              ).other_user_id,
                            ),
                            32,
                          )}
                          <div>
                            <div
                              style={{ fontWeight: 600, fontSize: "1.1rem" }}
                            >
                              {
                                getUser(
                                  conversations.find(
                                    (c) => c.id === activeConversation,
                                  ).other_user_id,
                                ).full_name
                              }
                            </div>
                            <div
                              style={{ fontSize: "0.85rem", color: "#6c6b7a" }}
                            >
                              Vecka{" "}
                              {
                                getUser(
                                  conversations.find(
                                    (c) => c.id === activeConversation,
                                  ).other_user_id,
                                ).current_week
                              }
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

                      <div
                        style={{
                          flex: 1,
                          overflowY: "auto",
                          padding: "1.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        {(messages[activeConversation] || []).map((msg) => {
                          const isMe = msg.sender_id === currentUser.id;
                          return (
                            <div
                              key={msg.id}
                              style={{
                                alignSelf: isMe ? "flex-end" : "flex-start",
                                maxWidth: "70%",
                              }}
                            >
                              <div
                                style={{
                                  padding: "0.75rem 1rem",
                                  background: isMe ? "#7b6df0" : "#f3f2ff",
                                  color: isMe ? "white" : "#222",
                                  borderRadius: isMe
                                    ? "16px 16px 4px 16px"
                                    : "16px 16px 16px 4px",
                                  fontSize: "0.95rem",
                                  lineHeight: 1.5,
                                }}
                              >
                                {msg.content}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#6c6b7a",
                                  marginTop: "0.25rem",
                                  textAlign: isMe ? "right" : "left",
                                }}
                              >
                                {formatTime(msg.created_at)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div
                        style={{
                          padding: "1rem 1.5rem",
                          borderTop: "1px solid #f0f0f0",
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          placeholder="Skriv ett meddelande..."
                          className="input"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="btn btn-primary"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Send size={18} /> Skicka
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profileTab === "friends" && (
              <div className="section grid-2">
                <div className="card">
                  <h3 style={{ marginBottom: "0.75rem" }}>Jag följer</h3>
                  <div className="stack">
                    {users
                      .filter((u) => following.includes(u.id))
                      .map((user) => (
                        <div
                          key={user.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              alignItems: "center",
                            }}
                          >
                            {renderAvatar(user, 32)}
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                {user.full_name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#6c6b7a",
                                }}
                              >
                                Beräknat{" "}
                                {new Date(user.due_date).toLocaleDateString(
                                  "sv-SE",
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-outline"
                            onClick={() => startConversation(user.id)}
                          >
                            Meddela
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="card">
                  <h3 style={{ marginBottom: "0.75rem" }}>Följer mig</h3>
                  <div className="stack">
                    {users
                      .filter((u) => followers.includes(u.id))
                      .map((user) => (
                        <div
                          key={user.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              alignItems: "center",
                            }}
                          >
                            {renderAvatar(user, 32)}
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                {user.full_name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#6c6b7a",
                                }}
                              >
                                Beräknat{" "}
                                {new Date(user.due_date).toLocaleDateString(
                                  "sv-SE",
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-outline"
                            onClick={() => toggleFollow(user.id)}
                          >
                            {following.includes(user.id) ? "Följer" : "Följ"}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "musthaves" && (
          <MustHavesView
            isAuthenticated={isAuthenticated}
            onRequireAuth={() => {
              setAuthMode("signup");
              setView("auth");
            }}
            mustHaveCategories={mustHaveCategories}
            mustHaveCategory={mustHaveCategory}
            setMustHaveCategory={setMustHaveCategory}
            filteredMustHaves={filteredMustHaves}
            canInteract={canInteract}
            toggleMustHaveVote={toggleMustHaveVote}
            mustHaveRequests={mustHaveRequests}
            setMustHaveRequests={setMustHaveRequests}
          />
        )}
        {view === "tips" && (
          <TipsView
            isAuthenticated={isAuthenticated}
            onRequireAuth={() => {
              setAuthMode("signup");
              setView("auth");
            }}
            tips={tips}
            canInteract={canInteract}
            toggleTipVote={toggleTipVote}
          />
        )}
        {view === "post" && (
          <div className="section fade-in">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 className="section-title">Inlägg</h2>
              <button className="btn btn-ghost" onClick={backToPrevious}>
                Tillbaka
              </button>
            </div>
            {(() => {
              const post = posts.find((p) => p.id === detailId);
              if (!post) return <div>Inlägget hittades inte.</div>;
              const author = getUser(post.user_id);
              return (
                <div className="card">
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {renderAvatar(author, 36)}
                    <div>
                      <div style={{ fontWeight: 700 }}>{author.full_name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6c6b7a" }}>
                        @{author.username}
                      </div>
                    </div>
                  </div>
                  <p style={{ lineHeight: 1.6 }}>{post.content}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="grid-3" style={{ marginTop: "1rem" }}>
                      {post.media.map((item, idx) => (
                        <div
                          key={idx}
                          className="card"
                          style={{ padding: "0.5rem" }}
                        >
                          {item.type && item.type.startsWith("video") ? (
                            <video
                              src={item.url}
                              controls
                              style={{ width: "100%", borderRadius: 12 }}
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.name || `media-${idx}`}
                              style={{ width: "100%", borderRadius: 12 }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                  >
                    <button
                      className="btn btn-soft"
                      onClick={() => toggleLike(post.id)}
                    >
                      {post.likes_count}
                    </button>
                    <button
                      className="btn btn-soft"
                      onClick={() => setSelectedPost(post.id)}
                    >
                      {post.comments_count}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {view === "user" && (
          <div className="modal-overlay" onClick={backToPrevious}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const user = users.find((u) => u.id === detailId);
                if (!user) return <div>Profilen hittades inte.</div>;
                return (
                  <div className="stack">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "1.3rem" }}>
                        {user.full_name}
                      </div>
                      <button className="btn btn-ghost" onClick={backToPrevious}>
                        Stäng
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      {renderAvatar(user, 64)}
                      <div>
                        <div style={{ color: "#6c6b7a" }}>@{user.username}</div>
                        {user.due_date && (
                          <div className="chip" style={{ marginTop: "0.5rem" }}>
                            BF{" "}
                            {new Date(user.due_date).toLocaleDateString(
                              "sv-SE",
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {user.bio && <p style={{ marginTop: "0.5rem" }}>{user.bio}</p>}
                    <div className="subnav" style={{ marginTop: "0.5rem" }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => toggleFollow(user.id)}
                      >
                        {following.includes(user.id) ? "Följer" : "Följ"}
                      </button>
                      <button
                        className="btn btn-soft"
                        onClick={() => startConversation(user.id)}
                      >
                        Meddela
                      </button>
                    </div>
                    <div className="card card-border">
                      <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                        Skicka gåva
                      </div>
                      <div className="subnav">
                        <button className="btn btn-soft">Charma</button>
                        <button className="btn btn-soft">Presentkort</button>
                        <button className="btn btn-soft">Blombud</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {showTour && (
        <div className="modal-overlay" onClick={() => setShowTour(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Så funkar Knottz</h2>
              <button
                className="btn btn-ghost"
                onClick={() => setShowTour(false)}
              >
                Stäng
              </button>
            </div>
            <div className="grid-2" style={{ marginTop: "1rem" }}>
              {MOCK_SCREENSHOTS.map((shot) => (
                <div
                  key={shot.id}
                  className="card"
                  style={{
                    boxShadow: "none",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src={shot.src}
                    alt={shot.title}
                    style={{ width: "100%", borderRadius: 12 }}
                  />
                  <div style={{ marginTop: "0.6rem", fontWeight: 700 }}>
                    {shot.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {scbPanel && (
        <div className="modal-overlay" onClick={() => setScbPanel(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>SCB – födslar 2024</h2>
              <button
                className="btn btn-ghost"
                onClick={() => setScbPanel(false)}
              >
                Stäng
              </button>
            </div>
            <div className="section">
              <div className="grid-3">
                <div className="stat-card">
                  <div className="stat-value">
                    {SCB_STATS.births_2024_total}
                  </div>
                  <div>Totalt</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{SCB_STATS.births_2024_boys}</div>
                  <div>Pojkar</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {SCB_STATS.births_2024_girls}
                  </div>
                  <div>Flickor</div>
                </div>
              </div>
            </div>
            <div className="section">
              <h3 style={{ marginBottom: "0.75rem" }}>
                Födslar per månad (2024)
              </h3>
              <div className="stack">
                {SCB_BIRTHS_2024_MONTHS.map((item) => (
                  <div
                    key={item.month}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>{item.month}</div>
                    <span className="chip">{item.count}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  color: "#6c6b7a",
                  fontSize: "0.85rem",
                  marginTop: "0.75rem",
                }}
              >
                Källa: SCB/Skatteverket (2024).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
