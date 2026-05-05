import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart3, Package, Layers, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp, AlertCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      {sub && <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios.get(`${apiUrl}/report`)
      .then(res => { setReport(res.data); setLoading(false); })
      .catch(err => {
        setError(err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Unable to load report data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748b" }}>Loading report...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
        <AlertCircle size={20} color="#f87171" />
        <span style={{ color: "#f87171" }}>{error}</span>
      </div>
    </div>
  );

  const { spareSummary, spareParts = [], stockInSummary, stockOutSummary } = report || {};
  const totalQty = spareParts.reduce((s, i) => s + Number(i.Quantity || 0), 0);
  const totalVal = spareParts.reduce((s, i) => s + Number(i.TotalPrice || 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Inventory Report</h2>
          <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Summary of stock, transactions, and values</p>
        </div>
      </div>

      {/* Stat Cards — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon={Package} label="Total Parts" value={spareSummary?.totalParts ?? 0} sub="Items in catalog" color="linear-gradient(135deg,#3b82f6,#06b6d4)" />
        <StatCard icon={Layers} label="Total Quantity" value={spareSummary?.totalStockQuantity ?? 0} sub="Units available" color="linear-gradient(135deg,#8b5cf6,#3b82f6)" />
        <StatCard icon={DollarSign} label="Inventory Value" value={`$${Number(spareSummary?.totalStockValue ?? 0).toFixed(2)}`} sub="Total stock value" color="linear-gradient(135deg,#f59e0b,#ef4444)" />
      </div>

      {/* Stock In / Out cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowDownToLine size={18} color="#4ade80" />
            <p style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock In</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockInSummary?.totalStockIn ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Qty added: {stockInSummary?.totalStockInQuantity ?? 0}</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowUpFromLine size={18} color="#f87171" />
            <p style={{ color: "#f87171", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock Out</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockOutSummary?.totalStockOut ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Value moved: ${Number(stockOutSummary?.totalStockOutValue ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Spare Parts Table */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Spare Parts Inventory</h3>
            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>Detailed breakdown by item</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.3rem 0.9rem", fontSize: "0.78rem", color: "#94a3b8" }}>{spareParts.length} items</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["ID", "Name", "Category", "Qty", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: ["Qty", "Unit Price", "Total"].includes(h) ? "right" : "left", color: "#64748b", fontWeight: "500", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spareParts.map((item, i) => (
                <tr key={item.SparePartID} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontFamily: "monospace" }}>#{item.SparePartID}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "500" }}>{item.Name}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "0.2rem 0.6rem", color: "#a78bfa", fontSize: "0.78rem" }}>{item.Category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>{item.Quantity}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>${Number(item.UnitPrice).toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4ade80", textAlign: "right", fontWeight: "500" }}>${Number(item.TotalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <td colSpan="3" style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>TOTALS</td>
                <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "600", textAlign: "right" }}>{totalQty}</td>
                <td style={{ padding: "1rem 1.25rem" }} />
                <td style={{ padding: "1rem 1.25rem", color: "#4ade80", fontWeight: "600", textAlign: "right" }}>${totalVal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart3, Package, Layers, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp, AlertCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      {sub && <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios.get(`${apiUrl}/report`)
      .then(res => { setReport(res.data); setLoading(false); })
      .catch(err => {
        setError(err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Unable to load report data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748b" }}>Loading report...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
        <AlertCircle size={20} color="#f87171" />
        <span style={{ color: "#f87171" }}>{error}</span>
      </div>
    </div>
  );

  const { spareSummary, spareParts = [], stockInSummary, stockOutSummary } = report || {};
  const totalQty = spareParts.reduce((s, i) => s + Number(i.Quantity || 0), 0);
  const totalVal = spareParts.reduce((s, i) => s + Number(i.TotalPrice || 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Inventory Report</h2>
          <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Summary of stock, transactions, and values</p>
        </div>
      </div>

      {/* Stat Cards — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon={Package} label="Total Parts" value={spareSummary?.totalParts ?? 0} sub="Items in catalog" color="linear-gradient(135deg,#3b82f6,#06b6d4)" />
        <StatCard icon={Layers} label="Total Quantity" value={spareSummary?.totalStockQuantity ?? 0} sub="Units available" color="linear-gradient(135deg,#8b5cf6,#3b82f6)" />
        <StatCard icon={DollarSign} label="Inventory Value" value={`$${Number(spareSummary?.totalStockValue ?? 0).toFixed(2)}`} sub="Total stock value" color="linear-gradient(135deg,#f59e0b,#ef4444)" />
      </div>

      {/* Stock In / Out cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowDownToLine size={18} color="#4ade80" />
            <p style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock In</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockInSummary?.totalStockIn ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Qty added: {stockInSummary?.totalStockInQuantity ?? 0}</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowUpFromLine size={18} color="#f87171" />
            <p style={{ color: "#f87171", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock Out</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockOutSummary?.totalStockOut ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Value moved: ${Number(stockOutSummary?.totalStockOutValue ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Spare Parts Table */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Spare Parts Inventory</h3>
            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>Detailed breakdown by item</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.3rem 0.9rem", fontSize: "0.78rem", color: "#94a3b8" }}>{spareParts.length} items</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["ID", "Name", "Category", "Qty", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: ["Qty", "Unit Price", "Total"].includes(h) ? "right" : "left", color: "#64748b", fontWeight: "500", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spareParts.map((item, i) => (
                <tr key={item.SparePartID} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontFamily: "monospace" }}>#{item.SparePartID}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "500" }}>{item.Name}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "0.2rem 0.6rem", color: "#a78bfa", fontSize: "0.78rem" }}>{item.Category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>{item.Quantity}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>${Number(item.UnitPrice).toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4ade80", textAlign: "right", fontWeight: "500" }}>${Number(item.TotalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <td colSpan="3" style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>TOTALS</td>
                <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "600", textAlign: "right" }}>{totalQty}</td>
                <td style={{ padding: "1rem 1.25rem" }} />
                <td style={{ padding: "1rem 1.25rem", color: "#4ade80", fontWeight: "600", textAlign: "right" }}>${totalVal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart3, Package, Layers, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp, AlertCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      {sub && <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios.get(`${apiUrl}/report`)
      .then(res => { setReport(res.data); setLoading(false); })
      .catch(err => {
        setError(err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Unable to load report data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748b" }}>Loading report...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
        <AlertCircle size={20} color="#f87171" />
        <span style={{ color: "#f87171" }}>{error}</span>
      </div>
    </div>
  );

  const { spareSummary, spareParts = [], stockInSummary, stockOutSummary } = report || {};
  const totalQty = spareParts.reduce((s, i) => s + Number(i.Quantity || 0), 0);
  const totalVal = spareParts.reduce((s, i) => s + Number(i.TotalPrice || 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Inventory Report</h2>
          <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Summary of stock, transactions, and values</p>
        </div>
      </div>

      {/* Stat Cards — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon={Package} label="Total Parts" value={spareSummary?.totalParts ?? 0} sub="Items in catalog" color="linear-gradient(135deg,#3b82f6,#06b6d4)" />
        <StatCard icon={Layers} label="Total Quantity" value={spareSummary?.totalStockQuantity ?? 0} sub="Units available" color="linear-gradient(135deg,#8b5cf6,#3b82f6)" />
        <StatCard icon={DollarSign} label="Inventory Value" value={`$${Number(spareSummary?.totalStockValue ?? 0).toFixed(2)}`} sub="Total stock value" color="linear-gradient(135deg,#f59e0b,#ef4444)" />
      </div>

      {/* Stock In / Out cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowDownToLine size={18} color="#4ade80" />
            <p style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock In</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockInSummary?.totalStockIn ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Qty added: {stockInSummary?.totalStockInQuantity ?? 0}</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowUpFromLine size={18} color="#f87171" />
            <p style={{ color: "#f87171", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock Out</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockOutSummary?.totalStockOut ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Value moved: ${Number(stockOutSummary?.totalStockOutValue ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Spare Parts Table */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Spare Parts Inventory</h3>
            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>Detailed breakdown by item</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.3rem 0.9rem", fontSize: "0.78rem", color: "#94a3b8" }}>{spareParts.length} items</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["ID", "Name", "Category", "Qty", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: ["Qty", "Unit Price", "Total"].includes(h) ? "right" : "left", color: "#64748b", fontWeight: "500", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spareParts.map((item, i) => (
                <tr key={item.SparePartID} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontFamily: "monospace" }}>#{item.SparePartID}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "500" }}>{item.Name}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "0.2rem 0.6rem", color: "#a78bfa", fontSize: "0.78rem" }}>{item.Category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>{item.Quantity}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>${Number(item.UnitPrice).toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4ade80", textAlign: "right", fontWeight: "500" }}>${Number(item.TotalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <td colSpan="3" style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>TOTALS</td>
                <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "600", textAlign: "right" }}>{totalQty}</td>
                <td style={{ padding: "1rem 1.25rem" }} />
                <td style={{ padding: "1rem 1.25rem", color: "#4ade80", fontWeight: "600", textAlign: "right" }}>${totalVal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart3, Package, Layers, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp, AlertCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{label}</p>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      {sub && <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    axios.get(`${apiUrl}/report`)
      .then(res => { setReport(res.data); setLoading(false); })
      .catch(err => {
        setError(err.response ? `Error ${err.response.status}: ${err.response.statusText}` : "Unable to load report data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <span style={{ color: "#64748b" }}>Loading report...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
        <AlertCircle size={20} color="#f87171" />
        <span style={{ color: "#f87171" }}>{error}</span>
      </div>
    </div>
  );

  const { spareSummary, spareParts = [], stockInSummary, stockOutSummary } = report || {};
  const totalQty = spareParts.reduce((s, i) => s + Number(i.Quantity || 0), 0);
  const totalVal = spareParts.reduce((s, i) => s + Number(i.TotalPrice || 0), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Inventory Report</h2>
          <p style={{ color: "#64748b", fontSize: "0.8rem", margin: 0 }}>Summary of stock, transactions, and values</p>
        </div>
      </div>

      {/* Stat Cards — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard icon={Package} label="Total Parts" value={spareSummary?.totalParts ?? 0} sub="Items in catalog" color="linear-gradient(135deg,#3b82f6,#06b6d4)" />
        <StatCard icon={Layers} label="Total Quantity" value={spareSummary?.totalStockQuantity ?? 0} sub="Units available" color="linear-gradient(135deg,#8b5cf6,#3b82f6)" />
        <StatCard icon={DollarSign} label="Inventory Value" value={`$${Number(spareSummary?.totalStockValue ?? 0).toFixed(2)}`} sub="Total stock value" color="linear-gradient(135deg,#f59e0b,#ef4444)" />
      </div>

      {/* Stock In / Out cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowDownToLine size={18} color="#4ade80" />
            <p style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock In</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockInSummary?.totalStockIn ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Qty added: {stockInSummary?.totalStockInQuantity ?? 0}</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <ArrowUpFromLine size={18} color="#f87171" />
            <p style={{ color: "#f87171", fontSize: "0.8rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Stock Out</p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "#f1f5f9", margin: "0 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>{stockOutSummary?.totalStockOut ?? 0}</p>
          <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>Value moved: ${Number(stockOutSummary?.totalStockOutValue ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Spare Parts Table */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: "600", color: "#f1f5f9", margin: 0 }}>Spare Parts Inventory</h3>
            <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>Detailed breakdown by item</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.3rem 0.9rem", fontSize: "0.78rem", color: "#94a3b8" }}>{spareParts.length} items</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["ID", "Name", "Category", "Qty", "Unit Price", "Total"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: ["Qty", "Unit Price", "Total"].includes(h) ? "right" : "left", color: "#64748b", fontWeight: "500", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spareParts.map((item, i) => (
                <tr key={item.SparePartID} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontFamily: "monospace" }}>#{item.SparePartID}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "500" }}>{item.Name}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", padding: "0.2rem 0.6rem", color: "#a78bfa", fontSize: "0.78rem" }}>{item.Category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>{item.Quantity}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#cbd5e1", textAlign: "right" }}>${Number(item.UnitPrice).toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.25rem", color: "#4ade80", textAlign: "right", fontWeight: "500" }}>${Number(item.TotalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <td colSpan="3" style={{ padding: "1rem 1.25rem", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>TOTALS</td>
                <td style={{ padding: "1rem 1.25rem", color: "#f1f5f9", fontWeight: "600", textAlign: "right" }}>{totalQty}</td>
                <td style={{ padding: "1rem 1.25rem" }} />
                <td style={{ padding: "1rem 1.25rem", color: "#4ade80", fontWeight: "600", textAlign: "right" }}>${totalVal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
