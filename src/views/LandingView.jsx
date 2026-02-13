import React from "react";

const formatShortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
  });
};

const LandingView = ({
  onSignup,
  onLogin,
  previewUsers,
  trendingMustHaves,
  trendingTips,
  renderAvatar,
}) => {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-pill">Knottz Beta</div>
          <h1>Håll koll på dina vänner som väntar barn</h1>
          <p>
            Se vänners beräknade datum, födelsedagar, must haves och tips. En
            enkel lista som gör det lätt att komma ihåg.
          </p>
          <div className="landing-actions">
            <button className="btn btn-primary" onClick={onSignup}>
              Skapa din lista
            </button>
            <button className="btn btn-soft" onClick={onLogin}>
              Logga in
            </button>
          </div>
          <div className="landing-note">
            Nyhet: Alla som registrerar sig får en välkomstgåva till bebisen.
          </div>
        </div>

        <div className="landing-phone">
          <div className="phone-header">
            <span>Min lista</span>
            <div className="phone-tabs">
              <span>Alla</span>
              <span>Gravid</span>
              <span>Födelsedagar</span>
            </div>
          </div>
          <div className="phone-list">
            {previewUsers.map((user) => (
              <div key={user.id} className="phone-row">
                {renderAvatar(user, 32)}
                <div>
                  <div className="phone-name">{user.full_name}</div>
                  <div className="phone-sub">
                    BF {formatShortDate(user.due_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={onSignup}>
            Skapa din lista
          </button>
        </div>
      </section>

      <section className="landing-grid">
        <div className="card landing-card">
          <div className="card-head">
            <h3>Must Haves (Top 3)</h3>
            <button className="btn btn-ghost" onClick={onSignup}>
              Visa fler
            </button>
          </div>
          <div className="stack">
            {trendingMustHaves.map((item) => (
              <div key={item.id} className="mini-row">
                <div>
                  <div className="mini-title">{item.title}</div>
                  <div className="mini-sub">{item.category}</div>
                </div>
                <span className="chip">{item.upvotes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card landing-card">
          <div className="card-head">
            <h3>Tips & Trix (Top 3)</h3>
            <button className="btn btn-ghost" onClick={onSignup}>
              Visa fler
            </button>
          </div>
          <div className="stack">
            {trendingTips.map((tip) => (
              <div key={tip.id} className="mini-row">
                <div>
                  <div className="mini-title">{tip.title}</div>
                  <div className="mini-sub">{tip.category}</div>
                </div>
                <span className="chip">{tip.helpful_count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card landing-card gift-card">
          <div>
          <div className="gift-title">Present till bebisen</div>
          <p>
            Registrera dig och få en välkomstgåva. Vi samarbetar med
            barnvarumärken du redan gillar.
          </p>
            <button className="btn btn-primary" onClick={onSignup}>
              Registrera dig gratis
            </button>
          </div>
        </div>

        <div className="card landing-card">
          <div className="gift-title">Dela ditt glädjebesked</div>
          <p>
            Skapa ett delningskort med Knottz‑logo och BF. Perfekt för stories.
          </p>
          <button className="btn btn-soft" onClick={onSignup}>
            Skapa delningskort
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
