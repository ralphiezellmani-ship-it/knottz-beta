import React, { useState } from "react";

const CelebWatchView = ({
  celebrities,
  rumors,
  onSubmitRumor,
  isAuthenticated,
  onRequireAuth,
}) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [source, setSource] = useState("");

  return (
    <div className="section fade-in">
      <div className="card card-strong">
        <h2 className="section-title">Gravida kändislistan</h2>
        <div className="section-subtitle">
          En samlad lista över kända profiler som väntar barn.
        </div>
      </div>

      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Aktuella namn</h3>
        <div className="stack">
          {celebrities.map((item) => (
            <div key={item.id} className="mini-row">
              <div>
                <div className="mini-title">{item.name}</div>
                <div className="mini-sub">
                  {item.status} · {item.due_window}
                </div>
                <div className="mini-sub">Källa: {item.source}</div>
              </div>
              <span className="chip">{item.updated_at}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Skicka tips till teamet</h3>
        <div className="stack">
          <input
            className="input"
            placeholder="Namn på kändis"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Vad har du sett/hört? (kort sammanfattning)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <input
            className="input"
            placeholder="Källa (länk eller beskrivning)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <button
            className="btn btn-primary"
            disabled={!name.trim() || !details.trim()}
            onClick={() => {
              if (!isAuthenticated) {
                onRequireAuth?.();
                return;
              }
              onSubmitRumor({
                celeb_name: name.trim(),
                details: details.trim(),
                source: source.trim(),
              });
              setName("");
              setDetails("");
              setSource("");
            }}
          >
            Skicka tips
          </button>
        </div>
      </div>

      <div className="section card">
        <h3 style={{ marginBottom: "0.75rem" }}>Inskickade tips</h3>
        <div className="stack">
          {rumors.length === 0 ? (
            <div style={{ color: "#6c6b7a" }}>Inga tips ännu.</div>
          ) : (
            rumors.slice(0, 20).map((item) => (
              <div key={item.id} className="mini-row">
                <div>
                  <div className="mini-title">{item.celeb_name}</div>
                  <div className="mini-sub">{item.details}</div>
                  {item.source ? (
                    <div className="mini-sub">Källa: {item.source}</div>
                  ) : null}
                </div>
                <span className="chip">{item.status || "pending"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CelebWatchView;
