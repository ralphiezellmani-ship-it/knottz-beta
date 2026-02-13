import React from "react";

const TipsView = ({
  isAuthenticated,
  onRequireAuth,
  tips,
  canInteract,
  toggleTipVote,
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsView;
