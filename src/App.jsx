import { useState, useEffect } from "react";

const MANAGERS = ["Raj", "Shubham", "Happy"];

const PROPERTIES = {
  "Shaam-e-Banaras": {
    defaultManager: "Raj",
    rooms: ["101", "102", "103", "201", "202", "203", "204", "205", "206", "B101", "B102", "B104", "B105"],
  },
  "Subah-e-Banaras": {
    defaultManager: "Shubham",
    rooms: ["101", "102", "103", "201", "202", "203", "204", "301", "302", "401", "402"],
  },
};

const CHECKLISTS = {
  "room-ready": {
    label: "Room Ready",
    icon: "🛏️",
    needsRoom: true,
    sections: [
      {
        title: "Bed & Room",
        color: "#2c3e50",
        items: [
          "Bedsheet fresh with no stain",
          "Pillow covers clean",
          "Blanket clean",
          "2 bath towels on bed",
          "Kettle, lamp/plant in correct positions",
          "Water bottles placed",
          "Dustbin empty",
          "All cupboards/drawers empty and clean",
          "No dust on tables",
          "Floor mopping done",
          "Room freshener done",
          "AC remote + TV remote present & working",
        ],
      },
      {
        title: "Bathroom",
        color: "#2980b9",
        items: [
          "Shampoo present",
          "Soap present",
          "Handwash present",
          "Toilet clean",
          "Mirror clean",
          "Toilet paper present",
          "Hand towel placed",
          "Dustbin empty",
          "Bathroom freshener present",
          "Washroom is dry, no water",
        ],
      },
    ],
  },
  "check-in": {
    label: "Guest Check-In",
    icon: "🔑",
    needsRoom: true,
    sections: [
      {
        title: "Check-In",
        color: "#27ae60",
        items: [
          "Guest ID collected and recorded",
          "Booking payment received",
          "Room key given",
          "Cook and meals explained with food menu",
          "House rules explained",
          "WiFi password shared",
          "Property manager number shared for any issues",
        ],
      },
    ],
  },
  "daily-close": {
    label: "Daily Property Close",
    icon: "🌙",
    needsRoom: false,
    timeNote: "10:00 PM",
    sections: [
      {
        title: "Kitchen",
        color: "#e67e22",
        items: [
          "Cleaned at least once today",
          "All food items in containers, nothing in the open",
          "All food orders added on food bill",
          "Fridge is clean",
          "Groceries for tomorrow present",
          "Dirty utensils kept separate or cleaned",
          "All empty water bottles in the fridge",
        ],
      },
      {
        title: "Housekeeping & Close",
        color: "#8e44ad",
        items: [
          "Common areas cleaned today",
          "Dirty laundry washed & stored",
          "Terrace cleaned today",
          "Cash accounting done",
          "Any guest complaint",
          "Any maintenance issue today",
          "Lights shut down and doors closed",
          "Prepare tomorrow's room allotment message",
        ],
      },
    ],
  },
};

const font = "'Figtree', 'DM Sans', -apple-system, sans-serif";

function CheckItem({ text, checked, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: "14px", width: "100%",
      padding: "15px 16px", border: "none", borderBottom: "1px solid #f0f0f0",
      background: checked ? "#f0faf3" : "#fff", cursor: "pointer",
      textAlign: "left", transition: "background 0.15s", fontFamily: font,
    }}>
      <span style={{
        width: "26px", height: "26px", borderRadius: "8px",
        border: checked ? "none" : "2px solid #d0d0d0",
        background: checked ? "#27ae60" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s", fontSize: "15px",
        color: "#fff", fontWeight: "bold",
      }}>{checked ? "✓" : ""}</span>
      <span style={{
        fontSize: "15px", color: checked ? "#888" : "#1a1a1a",
        textDecoration: checked ? "line-through" : "none", lineHeight: "1.4",
      }}>{text}</span>
    </button>
  );
}

function Pill({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", border: selected ? "2px solid #1a1a2e" : "1.5px solid #e0e0e0",
      borderRadius: "10px", background: selected ? "#1a1a2e" : "#fff",
      color: selected ? "#fff" : "#333", fontSize: "15px", fontWeight: 600,
      cursor: "pointer", fontFamily: font, transition: "all 0.12s",
    }}>{label}</button>
  );
}

export default function SOPApp() {
  const [screen, setScreen] = useState("home");
  const [property, setProperty] = useState("");
  const [manager, setManager] = useState("");
  const [selectedSOP, setSelectedSOP] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [checks, setChecks] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (property && PROPERTIES[property]) {
      setManager(PROPERTIES[property].defaultManager);
    }
  }, [property]);

  const reset = () => {
    setScreen("home"); setProperty(""); setManager("");
    setSelectedSOP(""); setRoomNo(""); setChecks({}); setSubmitted(false);
  };

  const goToSops = () => {
    setSelectedSOP(""); setRoomNo(""); setChecks({}); setSubmitted(false);
    setScreen("sops");
  };

  const KITCHEN_ROOMS = ["301", "302", "401", "402"];
  const getEffectiveSections = () => {
    if (!selectedSOP) return [];
    const sections = [...CHECKLISTS[selectedSOP].sections];
    if (selectedSOP === "room-ready" && property === "Subah-e-Banaras" && KITCHEN_ROOMS.includes(roomNo)) {
      sections.push({
        title: "Kitchen",
        color: "#e67e22",
        items: ["Dustbin empty", "Utensils cleaned", "Kitchen clean"],
      });
    }
    return sections;
  };

  const toggleCheck = (sIdx, iIdx) => {
    const key = `${sIdx}-${iIdx}`;
    setChecks((p) => ({ ...p, [key]: !p[key] }));
  };

  const getTotalItems = () => {
    if (!selectedSOP) return 0;
    return getEffectiveSections().reduce((s, sec) => s + sec.items.length, 0);
  };

  const getCheckedCount = () => Object.values(checks).filter(Boolean).length;
  const allChecked = getTotalItems() > 0 && getCheckedCount() === getTotalItems();

  const generateMessage = () => {
    const sop = CHECKLISTS[selectedSOP];
    const total = getTotalItems();
    const done = getCheckedCount();

    let msg = `*${sop.label}* - ${manager}`;
    if (sop.needsRoom && roomNo) msg += ` - ${roomNo}`;
    msg += `\n\n`;

    getEffectiveSections().forEach((section, sIdx) => {
      msg += `*${section.title}*\n`;
      section.items.forEach((item, iIdx) => {
        const c = checks[`${sIdx}-${iIdx}`];
        msg += `${c ? "[done]" : "[X]"} ${item}\n`;
      });
      msg += `\n`;
    });

    msg += done === total
      ? `All ${total} checks done`
      : `${done}/${total} done - ${total - done} pending`;

    return msg;
  };

  const sendWhatsApp = () => {
    const msg = generateMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  // ===== HOME =====
  if (screen === "home") {
    return (
      <div style={{ fontFamily: font, maxWidth: "440px", margin: "0 auto", minHeight: "100vh", background: "#f8f8fa" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#fff", padding: "32px 22px 28px", borderRadius: "0 0 28px 28px",
        }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Property SOPs</h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: 0.6 }}>Daily checklists & operations</p>
        </div>
        <div style={{ padding: "24px 18px" }}>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Select Property</p>
          {Object.keys(PROPERTIES).map((p) => (
            <button key={p} onClick={() => { setProperty(p); setScreen("sops"); }}
              style={{
                display: "block", width: "100%", padding: "20px 22px", marginBottom: "12px",
                border: "none", borderRadius: "16px", background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontSize: "17px", fontWeight: 700,
                color: "#1a1a2e", cursor: "pointer", textAlign: "left", fontFamily: font,
              }}>
              🏨&nbsp;&nbsp;{p}
              <span style={{ display: "block", fontSize: "12px", color: "#aaa", fontWeight: 400, marginTop: "4px" }}>
                Default: {PROPERTIES[p].defaultManager} · {PROPERTIES[p].rooms.length} rooms
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== SOP LIST =====
  if (screen === "sops") {
    return (
      <div style={{ fontFamily: font, maxWidth: "440px", margin: "0 auto", minHeight: "100vh", background: "#f8f8fa" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#fff", padding: "18px 22px 22px",
        }}>
          <button onClick={reset} style={{ background: "none", border: "none", color: "#fff", fontSize: "14px", cursor: "pointer", padding: 0, opacity: 0.6, fontFamily: font }}>← Back</button>
          <h1 style={{ margin: "8px 0 0", fontSize: "20px", fontWeight: 800 }}>{property}</h1>
          <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
            {MANAGERS.map((m) => (
              <button key={m} onClick={() => setManager(m)} style={{
                padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: font,
                background: manager === m ? "#fff" : "rgba(255,255,255,0.12)",
                color: manager === m ? "#1a1a2e" : "rgba(255,255,255,0.7)",
                transition: "all 0.15s",
              }}>{m}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 18px" }}>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Select Checklist</p>
          {Object.entries(CHECKLISTS).map(([key, sop]) => (
            <button key={key}
              onClick={() => {
                setSelectedSOP(key); setChecks({});
                setScreen(sop.needsRoom ? "room-select" : "checklist");
              }}
              style={{
                display: "flex", alignItems: "center", gap: "16px", width: "100%",
                padding: "18px 20px", marginBottom: "12px", border: "none", borderRadius: "16px",
                background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontSize: "16px",
                fontWeight: 700, color: "#1a1a2e", cursor: "pointer", textAlign: "left", fontFamily: font,
              }}>
              <span style={{ fontSize: "28px" }}>{sop.icon}</span>
              <div>
                <div>{sop.label}</div>
                <div style={{ fontSize: "12px", color: "#aaa", fontWeight: 400, marginTop: "3px" }}>
                  {sop.sections.map((s) => s.title).join(" · ")}
                  {sop.timeNote ? ` · ${sop.timeNote}` : ""}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== ROOM SELECT =====
  if (screen === "room-select") {
    const sop = CHECKLISTS[selectedSOP];
    const rooms = PROPERTIES[property].rooms;
    return (
      <div style={{ fontFamily: font, maxWidth: "440px", margin: "0 auto", minHeight: "100vh", background: "#f8f8fa" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#fff", padding: "18px 22px 22px",
        }}>
          <button onClick={goToSops} style={{ background: "none", border: "none", color: "#fff", fontSize: "14px", cursor: "pointer", padding: 0, opacity: 0.6, fontFamily: font }}>← Back</button>
          <h1 style={{ margin: "8px 0 0", fontSize: "20px", fontWeight: 800 }}>{sop.icon} {sop.label}</h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.5 }}>{property} · {manager}</p>
        </div>
        <div style={{ padding: "24px 18px" }}>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Select Room</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {rooms.map((r) => (
              <Pill key={r} label={r} selected={roomNo === r} onClick={() => setRoomNo(r)} />
            ))}
          </div>
          <button
            onClick={() => { if (roomNo) setScreen("checklist"); }}
            disabled={!roomNo}
            style={{
              width: "100%", padding: "16px", marginTop: "28px", border: "none", borderRadius: "14px",
              background: !roomNo ? "#ddd" : "#27ae60", color: "#fff", fontSize: "16px",
              fontWeight: 700, cursor: !roomNo ? "default" : "pointer", fontFamily: font,
            }}>
            {roomNo ? `Start → Room ${roomNo}` : "Select a room"}
          </button>
        </div>
      </div>
    );
  }

  // ===== CHECKLIST =====
  if (screen === "checklist") {
    const sop = CHECKLISTS[selectedSOP];
    return (
      <div style={{ fontFamily: font, maxWidth: "440px", margin: "0 auto", minHeight: "100vh", background: "#f8f8fa", paddingBottom: "100px" }}>
        {/* Sticky header */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#fff", padding: "16px 22px 18px", position: "sticky", top: 0, zIndex: 10,
        }}>
          <button onClick={() => { setChecks({}); setScreen(sop.needsRoom ? "room-select" : "sops"); }}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "14px", cursor: "pointer", padding: 0, opacity: 0.6, fontFamily: font }}>← Back</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>{sop.icon} {sop.label}</h1>
            <span style={{
              fontSize: "13px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px",
              background: allChecked ? "rgba(46,204,113,0.25)" : "rgba(255,255,255,0.12)",
              color: allChecked ? "#2ecc71" : "rgba(255,255,255,0.8)",
            }}>{getCheckedCount()}/{getTotalItems()}</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.5 }}>
            {manager} · {property}{sop.needsRoom && roomNo ? ` · Room ${roomNo}` : ""}
            {sop.timeNote ? ` · ${sop.timeNote}` : ""}
          </p>
          <div style={{ marginTop: "12px", height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
            <div style={{
              height: "100%", borderRadius: "2px", transition: "width 0.3s ease",
              width: `${getTotalItems() > 0 ? (getCheckedCount() / getTotalItems()) * 100 : 0}%`,
              background: allChecked ? "#2ecc71" : "#fff",
            }} />
          </div>
        </div>

        {/* Sections */}
        {getEffectiveSections().map((section, sIdx) => (
          <div key={sIdx} style={{ marginTop: "16px" }}>
            <div style={{
              margin: "0 18px", padding: "10px 16px", background: section.color,
              color: "#fff", borderRadius: "14px 14px 0 0", fontSize: "14px", fontWeight: 700,
            }}>{section.title}</div>
            <div style={{
              margin: "0 18px", borderRadius: "0 0 14px 14px", overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
              {section.items.map((item, iIdx) => (
                <CheckItem key={iIdx} text={item} checked={!!checks[`${sIdx}-${iIdx}`]}
                  onToggle={() => toggleCheck(sIdx, iIdx)} />
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 18px calc(12px + env(safe-area-inset-bottom, 0px))",
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
          borderTop: "1px solid #eee", display: "flex", justifyContent: "center", zIndex: 10,
        }}>
          <button onClick={sendWhatsApp} style={{
            width: "100%", maxWidth: "440px", padding: "16px", border: "none", borderRadius: "14px",
            background: allChecked ? "#25D366" : "#f39c12", color: "#fff", fontSize: "16px",
            fontWeight: 700, cursor: "pointer", fontFamily: font,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}>
            💬 {allChecked ? "Send on WhatsApp ✓" : `Send on WhatsApp (${getTotalItems() - getCheckedCount()} pending)`}
          </button>
        </div>

        {/* Success modal */}
        {submitted && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 20, padding: "20px",
          }}>
            <div style={{
              background: "#fff", borderRadius: "24px", padding: "36px 28px",
              textAlign: "center", maxWidth: "340px", width: "100%",
            }}>
              <div style={{ fontSize: "52px", marginBottom: "14px" }}>✅</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontFamily: font, fontWeight: 800 }}>Sent!</h2>
              <p style={{ color: "#888", fontSize: "14px", margin: "0 0 16px", fontFamily: font }}>
                Checklist shared on WhatsApp
              </p>
              {selectedSOP === "room-ready" && (
                <div style={{
                  background: "#fff3e0", borderRadius: "12px", padding: "14px 16px",
                  marginBottom: "20px", fontSize: "14px", fontWeight: 600, color: "#e65100",
                }}>
                  📸 Now send 1 pic of bedroom + 1 pic of bathroom
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => { setChecks({}); setSubmitted(false); setRoomNo(""); setScreen(sop.needsRoom ? "room-select" : "sops"); }}
                  style={{
                    flex: 1, padding: "14px", border: "1.5px solid #e0e0e0", borderRadius: "12px",
                    background: "#fff", color: "#333", fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", fontFamily: font,
                  }}>{sop.needsRoom ? "Next Room" : "Done"}</button>
                <button onClick={reset}
                  style={{
                    flex: 1, padding: "14px", border: "none", borderRadius: "12px",
                    background: "#1a1a2e", color: "#fff", fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", fontFamily: font,
                  }}>Home</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
