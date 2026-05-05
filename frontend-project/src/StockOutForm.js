import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hash, DollarSign, Calendar, ArrowUpFromLine, Save, AlertCircle, CheckCircle } from "lucide-react";

const inputStyle = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.75rem 1rem 0.75rem 2.75rem", color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", colorScheme: "dark" };
const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: "500", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" };

function StockOutForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [data, setData] = useState({ sparePartID: "", quantity: "", unitPrice: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5000/stockout/${id}`)
        .then(res => setData(res.data))
        .catch(() => setStatus({ type: "error", msg: "Failed to load record." }));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!data.sparePartID || !data.quantity || !data.unitPrice || !data.date) {
      setStatus({ type: "error", msg: "Please fill in all fields." });
      return;
    }
    setLoading(true); setStatus(null);
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/stockout/${id}`, data);
      } else {
        await axios.post("http://localhost:5000/stockout", data);
      }
      setStatus({ type: "success", msg: isEdit ? "Record updated successfully." : "Stock out recorded successfully." });
      setTimeout(() => navigate("/stockout"), 1200);
    } catch {
      setStatus({ type: "error", msg: "Failed to save. Check server connection." });
    } finally { setLoading(false); }
  };

  const fields = [
    { label: "Spare Part ID", key: "sparePartID", icon: Hash, type: "text", placeholder: "Enter spare part ID" },
    { label: "Quantity", key: "quantity", icon: Hash, type: "number", placeholder: "Enter quantity" },
    { label: "Unit Price", key: "unitPrice", icon: DollarSign, type: "number", placeholder: "0.00" },
    { label: "Date", key: "date", icon: Calendar, type: "date", placeholder: "" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: "480px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "2rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.75rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowUpFromLine size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>
              {isEdit ? "Edit Stock Out" : "New Stock Out"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>{isEdit ? "Update the stock-out record" : "Create a new stock-out entry"}</p>
          </div>
        </div>

        {status && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: status.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${status.type === "success" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`, borderRadius: "12px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
            {status.type === "success" ? <CheckCircle size={16} color="#4ade80" /> : <AlertCircle size={16} color="#f87171" />}
            <span style={{ color: status.type === "success" ? "#4ade80" : "#f87171", fontSize: "0.875rem" }}>{status.msg}</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {fields.map(({ label, key, icon: Icon, type, placeholder }) => (
            <div key={key} style={{ marginBottom: "0.25rem", gridColumn: key === "sparePartID" ? "1 / -1" : "auto" }}>
              <label style={labelStyle}>{label}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Icon size={16} color="#475569" /></div>
                <input type={type} value={data[key]} placeholder={placeholder} style={inputStyle}
                  onChange={e => setData({ ...data, [key]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = "rgba(239,68,68,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button onClick={() => navigate("/stockout")} style={{
            flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", padding: "0.85rem", color: "#94a3b8", fontSize: "0.9rem",
            fontWeight: "600", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            background: loading ? "rgba(239,68,68,0.5)" : "linear-gradient(135deg, #ef4444, #f97316)",
            border: "none", borderRadius: "12px", padding: "0.85rem", color: "white",
            fontSize: "0.95rem", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving...</> : <><Save size={17} />{isEdit ? "Update Record" : "Save Record"}</>}
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

export default StockOutForm;
