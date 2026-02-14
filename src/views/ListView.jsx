import React, { useState } from "react";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ListView = ({
  users,
  listFilter,
  setListFilter,
  renderAvatar,
  onOpenProfile,
  onOpenStats,
  onAddFriend,
  onShareInvite,
}) => {
  const [manualName, setManualName] = useState("");
  const [manualDueDate, setManualDueDate] = useState("");
  const [manualBirthday, setManualBirthday] = useState("");
  const entries = users.flatMap((user) => {
    const rows = [];
    if (user?.due_date) {
      rows.push({
        id: `${user.id}-due`,
        type: "Gravid",
        label: "BF",
        date: user.due_date,
        user,
      });
    }
    if (user?.child_birthdate) {
      rows.push({
        id: `${user.id}-birthday`,
        type: "Födelsedagar",
        label: "Fyller år",
        date: user.child_birthdate,
        user,
      });
    }
    return rows;
  });

  const filtered = entries.filter((entry) => {
    if (listFilter === "Alla") return true;
    return entry.type === listFilter;
  });

  return (
    <div className="section fade-in">
      <div className="card card-strong" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>Din lista</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {onShareInvite && (
              <button className="btn btn-primary" onClick={onShareInvite}>
                Bjud in vän
              </button>
            )}
            {onOpenStats && (
              <button className="btn btn-soft" onClick={onOpenStats}>
                SCB‑statistik
              </button>
            )}
          </div>
        </div>
        <div style={{ color: "#6c6b7a", marginTop: "0.25rem" }}>
          En enkel översikt över vänner som väntar barn och födelsedagar.
        </div>
        <div className="subnav" style={{ marginTop: "1rem" }}>
          {["Alla", "Gravid", "Födelsedagar"].map((filter) => (
            <button
              key={filter}
              className={`btn ${listFilter === filter ? "btn-primary" : "btn-soft"}`}
              onClick={() => setListFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Lägg till en vän manuellt
        </div>
        <div style={{ color: "#6c6b7a", marginBottom: "0.75rem" }}>
          Lägg in vänner som ännu inte har Knottz – så får du koll på BF och
          födelsedagar direkt.
        </div>
        <div className="stack">
          <input
            className="input"
            placeholder="Namn"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
          />
          <div className="grid-2">
            <input
              className="input"
              type="date"
              value={manualDueDate}
              onChange={(e) => setManualDueDate(e.target.value)}
              placeholder="BF"
            />
            <input
              className="input"
              type="date"
              value={manualBirthday}
              onChange={(e) => setManualBirthday(e.target.value)}
              placeholder="Födelsedag"
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={!manualName.trim()}
            onClick={() => {
              if (!manualName.trim()) return;
              onAddFriend?.({
                name: manualName.trim(),
                dueDate: manualDueDate,
                birthday: manualBirthday,
              });
              setManualName("");
              setManualDueDate("");
              setManualBirthday("");
            }}
          >
            Lägg till vän
          </button>
        </div>
      </div>

      <div className="card">
        <div className="stack">
          {filtered.length === 0 && (
            <div className="card card-dashed">
              <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
                Listan är tom ännu
              </div>
              <div style={{ color: "#6c6b7a" }}>
                Lägg till en vän manuellt eller bjud in någon – så fylls listan
                automatiskt när de registrerar sig.
              </div>
            </div>
          )}
          {filtered.map((entry) => (
            <div key={entry.id} className="list-row">
              <div
                className="list-user"
                onClick={() => onOpenProfile(entry.user.id)}
              >
                {renderAvatar(entry.user, 36)}
                <div>
                  <div className="list-name">{entry.user.full_name}</div>
                  <div className="list-sub">
                    {entry.label} {formatDate(entry.date)}
                  </div>
                </div>
              </div>
              <span className="chip">{entry.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListView;
