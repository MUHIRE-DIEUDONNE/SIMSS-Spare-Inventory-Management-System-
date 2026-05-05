import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from "react-router-dom";
import { Package, ArrowDownToLine, ArrowUpFromLine, BarChart3, LogOut, User } from "lucide-react";
import Login from "./Login";
import Register from "./Register";
import SparePart from "./SparePart";
import StockIn from "./StockIn";
import StockOut from "./StockOut";
import StockOutForm from "./StockOutForm";
import Report from "./Report";
import ProtectedRoute from "./ProtectedRoute";

const navLinks = [
  { to: "/spare",    label: "Spare Parts",  icon: Package },
  { to: "/stockin",  label: "Stock In",     icon: ArrowDownToLine },
  { to: "/stockout", label: "Stock Out",    icon: ArrowUpFromLine },
  { to: "/report",   label: "Report",       icon: BarChart3 },
];

function Layout() {
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          min-height: 100vh;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0.45rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.07);
          color: #e2e8f0;
        }
        .nav-link.active {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* TOP NAVBAR */}
        {isLoggedIn && (
          <header style={{
            background: "rgba(15,23,42,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}>
            <div style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 1.5rem",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}>

              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
                }}>
                  <Package size={18} color="white" />
                </div>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  color: "#f1f5f9",
                  letterSpacing: "-0.3px",
                }}>
                  SIMS
                </span>
              </div>

              {/* Nav Links */}
              <nav style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flex: 1,
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  >
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* User + Logout */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "50px",
                  padding: "0.35rem 0.85rem 0.35rem 0.6rem",
                }}>
                  <div style={{
                    width: "24px", height: "24px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={13} color="white" />
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "#cbd5e1", fontWeight: "500" }}>
                    {user}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "50px",
                    padding: "0.4rem 0.9rem",
                    color: "#f87171",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <main style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: isLoggedIn ? "2rem 1.5rem" : "0",
        }}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/spare" replace /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/spare" replace /> : <Register />} />

            <Route path="/spare"    element={<ProtectedRoute><SparePart /></ProtectedRoute>} />
            <Route path="/stockin"  element={<ProtectedRoute><StockIn /></ProtectedRoute>} />
            <Route path="/stockout" element={<ProtectedRoute><StockOut /></ProtectedRoute>} />
            <Route path="/stockout/add"      element={<ProtectedRoute><StockOutForm /></ProtectedRoute>} />
            <Route path="/stockout/edit/:id" element={<ProtectedRoute><StockOutForm /></ProtectedRoute>} />
            <Route path="/report"   element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
