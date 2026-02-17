import React from "react";

const TipsView = ({
  isAuthenticated,
  onRequireAuth,
  tips,
  canInteract,
  toggleTipVote,
  comments,
  pendingComments,
  setPendingComments,
  onAddComment,
  onVoteComment,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="section fade-in">
        <div className="card card-strong">
          <h2 className="section-title">Tips & Trix</h2>
          <p style={{ color: "#6c6b7a" }}>
            Skapa konto för att se alla tips och rösta.
          </p>
          <button className="btn btn-primary" onClick={onRequireAuth}>
            Registrera dig gratis
          </button>
        </div>
        <div className="stack" style={{ marginTop: "1rem" }}>
          {tips.slice(0, 3).map((tip) => (
            <div key={tip.id} className="card">
              <div style={{ fontWeight: 700 }}>{tip.title}</div>
              <div style={{ color: "#6c6b7a", fontSize: "0.85rem" }}>
                {tip.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 className="section-title">Tips & Trix</h2>
      </div>
      <div className="stack">
        {tips.map((tip) => (
          <div key={tip.id} className="card" style={{ boxShadow: "none" }}>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {tip.title}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6c6b7a" }}>
              {tip.category}
            </div>
            <p style={{ marginTop: "0.5rem" }}>{tip.content}</p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <button
                className="btn btn-soft"
                disabled={!canInteract}
                onClick={() => toggleTipVote(tip.id, "up")}
              >
                Rösta {tip.upvotes}
              </button>
              <button
                className="btn btn-soft"
                disabled={!canInteract}
                onClick={() => toggleTipVote(tip.id, "helpful")}
              >
                Hjälpte {tip.helpful_count}
              </button>
            </div>
            <div className="card card-border" style={{ marginTop: "0.9rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Kommentarer
              </div>
              <div className="stack">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    className="input"
                    placeholder="Skriv tips-feedback..."
                    value={pendingComments[tip.id] || ""}
                    onChange={(e) =>
                      setPendingComments((prev) => ({
                        ...prev,
                        [tip.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-soft"
                    disabled={!canInteract}
                    onClick={() => onAddComment(tip.id)}
                  >
                    Skicka
                  </button>
                </div>
                {(comments[tip.id] || []).slice(0, 4).map((comment) => (
                  <div key={comment.id} className="mini-row">
                    <div style={{ flex: 1 }}>
                      <div className="mini-title">{comment.user_name}</div>
                      <div className="mini-sub">{comment.content}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        className="btn btn-soft"
                        disabled={!canInteract}
                        onClick={() => onVoteComment(tip.id, comment.id, "up")}
                      >
                        👍 {comment.upvotes || 0}
                      </button>
                      <button
                        className="btn btn-soft"
                        disabled={!canInteract}
                        onClick={() => onVoteComment(tip.id, comment.id, "down")}
                      >
                        👎 {comment.downvotes || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsView;
