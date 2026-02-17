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
  friendNotes,
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
  const [manualWish, setManualWish] = useState("");
  const [manualFavorite, setManualFavorite] = useState("");
  const [showAdd, setShowAdd] = useState(false);
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

  const sorted = [...filtered].sort((a, b) => {
    const aDate = new Date(a.date || 0).getTime();
    const bDate = new Date(b.date || 0).getTime();
    return aDate - bDate;
  });

  const grouped = sorted.reduce((acc, entry) => {
    const label = entry.date
      ? new Date(entry.date).toLocaleDateString("sv-SE", {
          month: "long",
          year: "numeric",
        })
      : "Okänt datum";
    if (!acc[label]) acc[label] = [];
    acc[label].push(entry);
    return acc;
  }, {});

  return (
    <div className="section fade-in">
      <div className="card card-strong" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>Din lista</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {onAddFriend && (
              <button
                className="btn btn-soft"
                onClick={() => setShowAdd(true)}
                aria-label="Lägg till vän"
              >
                +
              </button>
            )}
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

      <div className="card">
        <div className="stack">
          {sorted.length === 0 && (
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
          {Object.keys(grouped).map((month) => (
            <div key={month} className="stack">
              <div style={{ fontWeight: 700, color: "#6c6b7a" }}>{month}</div>
              {grouped[month].map((entry) => (
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
                      {(friendNotes?.[entry.user.id]?.wish ||
                        friendNotes?.[entry.user.id]?.favorite) && (
                        <div
                          className="list-sub"
                          style={{ marginTop: "0.1rem", fontSize: "0.78rem" }}
                        >
                          {friendNotes?.[entry.user.id]?.wish
                            ? `Önskar: ${friendNotes[entry.user.id].wish}`
                            : `Favorit: ${friendNotes[entry.user.id].favorite}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="chip">{entry.type}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              Lägg till vän
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
              <input
                className="input"
                placeholder="Önskelista (valfritt)"
                value={manualWish}
                onChange={(e) => setManualWish(e.target.value)}
              />
              <input
                className="input"
                placeholder="Favoritgodis/favorit (valfritt)"
                value={manualFavorite}
                onChange={(e) => setManualFavorite(e.target.value)}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-soft"
                  onClick={() => setShowAdd(false)}
                >
                  Avbryt
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!manualName.trim()}
                  onClick={() => {
                    if (!manualName.trim()) return;
                    onAddFriend?.({
                      name: manualName.trim(),
                      dueDate: manualDueDate,
                      birthday: manualBirthday,
                      wishNote: manualWish,
                      favoriteTreat: manualFavorite,
                    });
                    setManualName("");
                    setManualDueDate("");
                    setManualBirthday("");
                    setManualWish("");
                    setManualFavorite("");
                    setShowAdd(false);
                  }}
                >
                  Spara
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
