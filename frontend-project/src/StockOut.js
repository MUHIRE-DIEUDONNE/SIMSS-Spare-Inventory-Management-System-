import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpFromLine, Plus, Pencil, Trash2, PackageOpen } from "lucide-react";

function StockOut() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    axios.get("http://localhost:5000/stockout")
      .then(res => setList(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this stock-out record?")) return;
    axios.delete(`http://localhost:5000/stockout/${id}`).then(() => loadData());
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowUpFromLine size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Stock Out</h2>
            <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Manage outgoing stock records</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.35rem 1rem", fontSize: "0.8rem", color: "#94a3b8" }}>
            {list.length} record{list.length !== 1 ? "s" : ""}
          </span>
          <Link to="/stockout/add" style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(135deg, #ef4444, #f97316)",
            border: "none", borderRadius: "12px", padding: "0.6rem 1.1rem",
            color: "white", fontSize: "0.875rem", fontWeight: "600", textDecoration: "none",
          }}>
            <Plus size={16} />Add Stock Out
          </Link>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "480px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["ID", "Quantity", "Total Price", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.9rem 1.25rem", textAlign: h === "Actions" ? "center" : "left", color: "#64748b", fontWeight: "500", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: "3rem", textAlign: "center", color: "#475569" }}>Loading...</td></tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "3rem", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                      <PackageOpen size={36} color="#334155" />
                      <span style={{ color: "#475569", fontSize: "0.9rem" }}>No stock out records found</span>
                      <Link to="/stockout/add" style={{ color: "#38bdf8", fontSize: "0.875rem", textDecoration: "none" }}>Add your first record →</Link>
                    </div>
                  </td>
                </tr>
              ) : list.map((item, i) => (
                <tr key={item.StockOutID} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "500" }}>#{item.StockOutID}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1" }}>{item.StockOutQuantity}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1" }}>${Number(item.StockOutTotalPrice || 0).toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                      <Link to={`/stockout/edit/${item.StockOutID}`} style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)",
                        borderRadius: "8px", padding: "0.4rem 0.75rem", color: "#60a5fa",
                        fontSize: "0.8rem", fontWeight: "500", textDecoration: "none",
                      }}>
                        <Pencil size={13} />Edit
                      </Link>
                      <button onClick={() => handleDelete(item.StockOutID)} style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: "8px", padding: "0.4rem 0.75rem", color: "#f87171",
                        fontSize: "0.8rem", fontWeight: "500", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockOut;
