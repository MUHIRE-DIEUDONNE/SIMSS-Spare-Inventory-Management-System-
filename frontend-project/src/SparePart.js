import axios from "axios";
import { useState } from "react";
import { Package, Tag, Hash, DollarSign, Save, CheckCircle, AlertCircle } from "lucide-react";

const S = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'DM Sans', sans-serif" },
  card: { width: "100%", maxWidth: "520px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "2rem" },
  label: { display: "block", fontSize: "0.8rem", fontWeight: "500", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" },
  inputWrap: { position: "relative" },
  icon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.75rem 1rem 0.75rem 2.75rem", color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
};

function Field({ label, icon: Icon, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={S.label}>{label}</label>
      <div style={S.inputWrap}>
        <div style={S.icon}><Icon size={16} color="#475569" /></div>
        <input type={type} value={value} placeholder={placeholder} style={S.input}
          onChange={onChange}
          onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>
    </div>
  );
}

function SparePart() {
  const [data, setData] = useState({ name: "", category: "", quantity: "", unitPrice: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }

  const handleSubmit = async () => {
    if (!data.name || !data.category || !data.quantity || !data.unitPrice) {
      setStatus({ type: "error", msg: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await axios.post("http://localhost:5000/spare", data);
      setStatus({ type: "success", msg: res.data.message || "Spare part saved successfully." });
      setData({ name: "", category: "", quantity: "", unitPrice: "" });
    } catch {
      setStatus({ type: "error", msg: "Failed to save. Check server connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Add Spare Part</h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Enter details for the new part</p>
          </div>
        </div>

        {status && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: status.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${status.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius: "12px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
            {status.type === "success" ? <CheckCircle size={16} color="#4ade80" /> : <AlertCircle size={16} color="#f87171" />}
            <span style={{ color: status.type === "success" ? "#4ade80" : "#f87171", fontSize: "0.875rem" }}>{status.msg}</span>
          </div>
        )}

        <Field label="Part Name" icon={Package} placeholder="e.g. Brake Pad" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
        <Field label="Category" icon={Tag} placeholder="e.g. Braking System" value={data.category} onChange={e => setData({ ...data, category: e.target.value })} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Quantity" icon={Hash} type="number" placeholder="0" value={data.quantity} onChange={e => setData({ ...data, quantity: e.target.value })} />
          <Field label="Unit Price" icon={DollarSign} type="number" placeholder="0.00" value={data.unitPrice} onChange={e => setData({ ...data, unitPrice: e.target.value })} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
          border: "none", borderRadius: "12px", padding: "0.85rem", color: "white",
          fontSize: "0.95rem", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
          cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem",
        }}>
          {loading ? <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving...</> : <><Save size={17} />Save Part</>}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

export default SparePart;
