// ============================================================================
// useSupabasePosts.js – Hook för att hantera posts via Supabase
// ============================================================================
// Lägg denna fil i src/hooks/useSupabasePosts.js
//
// Använd i KnottzApp.jsx:
//   import { useSupabasePosts } from './hooks/useSupabasePosts';
//   const { posts, loading, createPost, toggleLike, ... } = useSupabasePosts(supabase, authUserId);
// ============================================================================

import { useState, useEffect, useCallback } from "react";

export function useSupabasePosts(supabase, authUserId) {
  const [posts, setPosts] = useState([]);
  const [myLikes, setMyLikes] = useState(new Set()); // Set av post_id:s jag gillat
  const [comments, setComments] = useState({}); // { post_id: [comment, ...] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Hämta alla posts ───────────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      console.error("Kunde inte hämta posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // ─── Hämta mina likes ──────────────────────────────────────────────
  const loadMyLikes = useCallback(async () => {
    if (!supabase || !authUserId) return;
    try {
      const { data } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", authUserId);
      if (data) {
        setMyLikes(new Set(data.map((row) => row.post_id)));
      }
    } catch (err) {
      console.error("Kunde inte hämta likes:", err);
    }
  }, [supabase, authUserId]);

  // ─── Hämta kommentarer för ett inlägg ──────────────────────────────
  const loadComments = useCallback(
    async (postId) => {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true });
        if (data) {
          setComments((prev) => ({ ...prev, [postId]: data }));
        }
      } catch (err) {
        console.error("Kunde inte hämta kommentarer:", err);
      }
    },
    [supabase],
  );

  // ─── Skapa nytt inlägg ─────────────────────────────────────────────
  const createPost = useCallback(
    async ({ content, visibility = "public", media = [], groupId = null }) => {
      if (!supabase || !authUserId) return null;
      if (!content.trim()) return null;

      try {
        const { data, error: insertError } = await supabase
          .from("posts")
          .insert({
            user_id: authUserId,
            content: content.trim(),
            visibility,
            media,
            group_id: groupId,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Lägg till i lokal state direkt (optimistic update)
        setPosts((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        console.error("Kunde inte skapa inlägg:", err);
        setError(err.message);
        return null;
      }
    },
    [supabase, authUserId],
  );

  // ─── Gilla / avgilla inlägg ────────────────────────────────────────
  const toggleLike = useCallback(
    async (postId) => {
      if (!supabase || !authUserId) return;

      const alreadyLiked = myLikes.has(postId);

      // Optimistic update
      setMyLikes((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) {
          next.delete(postId);
        } else {
          next.add(postId);
        }
        return next;
      });

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: alreadyLiked
                ? Math.max(0, post.likes_count - 1)
                : post.likes_count + 1,
            };
          }
          return post;
        }),
      );

      try {
        if (alreadyLiked) {
          await supabase
            .from("post_likes")
            .delete()
            .eq("user_id", authUserId)
            .eq("post_id", postId);

          // Uppdatera likes_count i posts-tabellen
          await supabase
            .rpc("decrement_likes", { post_row_id: postId })
            .catch(() => {
              // Om RPC inte finns, kör manuell update
              supabase
                .from("posts")
                .update({
                  likes_count: Math.max(
                    0,
                    (posts.find((p) => p.id === postId)?.likes_count || 1) - 1,
                  ),
                })
                .eq("id", postId);
            });
        } else {
          await supabase
            .from("post_likes")
            .insert({ user_id: authUserId, post_id: postId });

          await supabase
            .rpc("increment_likes", { post_row_id: postId })
            .catch(() => {
              supabase
                .from("posts")
                .update({
                  likes_count:
                    (posts.find((p) => p.id === postId)?.likes_count || 0) + 1,
                })
                .eq("id", postId);
            });
        }
      } catch (err) {
        console.error("Like-fel:", err);
        // Rollback on error
        loadPosts();
        loadMyLikes();
      }
    },
    [supabase, authUserId, myLikes, posts, loadPosts, loadMyLikes],
  );

  // ─── Lägg till kommentar ───────────────────────────────────────────
  const addComment = useCallback(
    async (postId, content) => {
      if (!supabase || !authUserId || !content.trim()) return null;

      try {
        const { data, error: insertError } = await supabase
          .from("comments")
          .insert({
            user_id: authUserId,
            post_id: postId,
            content: content.trim(),
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Optimistic update
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data],
        }));

        // Uppdatera comments_count
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, comments_count: post.comments_count + 1 }
              : post,
          ),
        );

        // Uppdatera i databasen
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost) {
          await supabase
            .from("posts")
            .update({ comments_count: currentPost.comments_count + 1 })
            .eq("id", postId);
        }

        return data;
      } catch (err) {
        console.error("Kunde inte lägga till kommentar:", err);
        return null;
      }
    },
    [supabase, authUserId, posts],
  );

  // ─── Ta bort inlägg ────────────────────────────────────────────────
  const deletePost = useCallback(
    async (postId) => {
      if (!supabase || !authUserId) return false;

      try {
        const { error: deleteError } = await supabase
          .from("posts")
          .delete()
          .eq("id", postId)
          .eq("user_id", authUserId);

        if (deleteError) throw deleteError;

        setPosts((prev) => prev.filter((p) => p.id !== postId));
        return true;
      } catch (err) {
        console.error("Kunde inte ta bort inlägg:", err);
        return false;
      }
    },
    [supabase, authUserId],
  );

  // ─── Ladda vid start ───────────────────────────────────────────────
  useEffect(() => {
    if (authUserId) {
      loadPosts();
      loadMyLikes();
    }
  }, [authUserId, loadPosts, loadMyLikes]);

  // ─── Realtime-prenumeration (nya inlägg dyker upp live) ────────────
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          // Lägg till nya inlägg om de inte redan finns
          setPosts((prev) => {
            if (prev.some((p) => p.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return {
    posts,
    myLikes,
    comments,
    loading,
    error,
    createPost,
    toggleLike,
    addComment,
    deletePost,
    loadComments,
    loadPosts,
    isLikedByMe: (postId) => myLikes.has(postId),
  };
}