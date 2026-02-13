import React from "react";

const MustHavesView = ({
  isAuthenticated,
  onRequireAuth,
  mustHaveCategories,
  mustHaveCategory,
  setMustHaveCategory,
  filteredMustHaves,
  canInteract,
  toggleMustHaveVote,
  mustHaveRequests,
  setMustHaveRequests,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="section fade-in">
        <div className="card card-strong">
          <h2 className="section-title">Must Haves</h2>
          <p style={{ color: "#6c6b7a" }}>
            Skapa konto för att se hela listan och rösta.
          </p>
          <button className="btn btn-primary" onClick={onRequireAuth}>
            Registrera dig gratis
          </button>
        </div>
        <div className="stack" style={{ marginTop: "1rem" }}>
          {filteredMustHaves.slice(0, 3).map((item) => (
            <div key={item.id} className="card">
              <div style={{ fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: "#6c6b7a", fontSize: "0.85rem" }}>
                {item.category}
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
        <h2 className="section-title">Must Haves</h2>
      </div>
      <div className="subnav" style={{ flexWrap: "wrap", marginBottom: "1rem" }}>
        {mustHaveCategories.map((cat) => (
          <button
            key={cat}
            className={`btn ${mustHaveCategory === cat ? "btn-primary" : "btn-soft"}`}
            onClick={() => setMustHaveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="stack">
        {filteredMustHaves.map((item) => (
          <div key={item.id} className="card" style={{ boxShadow: "none" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#6c6b7a" }}>
                  {item.category} · {item.price_range}
                </div>
                <p style={{ marginTop: "0.5rem" }}>{item.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  minWidth: "140px",
                }}
              >
                <button
                  className="btn btn-soft"
                  disabled={!canInteract}
                  onClick={() => toggleMustHaveVote(item.id, "up")}
                >
                  Rösta {item.upvotes}
                </button>
                <button
                  className="btn btn-soft"
                  disabled={!canInteract}
                  onClick={() => toggleMustHaveVote(item.id, "verified")}
                >
                  {item.verified_count} har den
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Föreslå produkt</h3>
        <div className="stack">
          <input className="input" placeholder="Produktnamn" id="mh-title" />
          <input
            className="input"
            placeholder="Länk till produkt (valfritt)"
            id="mh-link"
          />
          <input className="input" placeholder="Kategori" id="mh-category" />
          <textarea className="textarea" placeholder="Kort beskrivning" id="mh-desc" />
          <button
            className="btn btn-primary"
            onClick={() => {
              const title = document.getElementById("mh-title")?.value || "";
              if (!title.trim()) return;
              const link = document.getElementById("mh-link")?.value || "";
              const category = document.getElementById("mh-category")?.value || "";
              const desc = document.getElementById("mh-desc")?.value || "";
              const next = [
                {
                  id: Date.now().toString(),
                  title,
                  link,
                  category,
                  desc,
                },
                ...mustHaveRequests,
              ];
              setMustHaveRequests(next);
            }}
          >
            Skicka för granskning
          </button>
          {mustHaveRequests.length > 0 && (
            <div style={{ color: "#6c6b7a", fontSize: "0.85rem" }}>
              Senaste förslag: {mustHaveRequests[0].title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MustHavesView;
