import React from "react";

const StatCard = ({ label, value, hint }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div style={{ fontWeight: 700 }}>{label}</div>
    {hint ? <div style={{ color: "#6c6b7a", fontSize: "0.85rem" }}>{hint}</div> : null}
  </div>
);

const AdminDashboardView = ({
  isLoading,
  stats,
  recentActivity,
  pendingCelebTips,
  onModerateTip,
}) => {
  return (
    <div className="section fade-in">
      <div className="card card-strong">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="section-subtitle">
          Översikt över användare, aktivitet och moderering.
        </div>
      </div>

      <div className="section grid-3">
        <StatCard label="Användare" value={stats.users} hint="Totalt registrerade profiler" />
        <StatCard label="Inlägg" value={stats.posts} hint="Publicerade i flödet" />
        <StatCard label="Kommentarer" value={stats.comments} hint="Must Haves + Tips" />
        <StatCard label="Grupper" value={stats.groups} hint="Skapade grupper" />
        <StatCard label="Gruppmedlemskap" value={stats.groupMembers} hint="Totalt medlemskap" />
        <StatCard label="Tips väntar granskning" value={stats.pendingCelebTips} />
      </div>

      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Kändistips att granska</h3>
        {isLoading ? (
          <div style={{ color: "#6c6b7a" }}>Laddar…</div>
        ) : pendingCelebTips.length === 0 ? (
          <div style={{ color: "#6c6b7a" }}>Inga väntande tips.</div>
        ) : (
          <div className="stack">
            {pendingCelebTips.map((tip) => (
              <div key={tip.id} className="mini-row">
                <div style={{ flex: 1 }}>
                  <div className="mini-title">{tip.celeb_name}</div>
                  <div className="mini-sub">{tip.details}</div>
                  {tip.source ? <div className="mini-sub">Källa: {tip.source}</div> : null}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-soft" onClick={() => onModerateTip(tip.id, "rejected")}>
                    Avvisa
                  </button>
                  <button className="btn btn-primary" onClick={() => onModerateTip(tip.id, "approved")}>
                    Godkänn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Senaste aktivitet</h3>
        {isLoading ? (
          <div style={{ color: "#6c6b7a" }}>Laddar…</div>
        ) : recentActivity.length === 0 ? (
          <div style={{ color: "#6c6b7a" }}>Ingen aktivitet ännu.</div>
        ) : (
          <div className="stack">
            {recentActivity.map((item) => (
              <div key={item.id} className="mini-row">
                <div>
                  <div className="mini-title">{item.title}</div>
                  <div className="mini-sub">{item.meta}</div>
                </div>
                <span className="chip">{item.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardView;
