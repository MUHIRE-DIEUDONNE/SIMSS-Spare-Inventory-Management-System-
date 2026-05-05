const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sendReportResponse = (res) => {
  db.query(
    "SELECT COUNT(*) AS totalParts, COALESCE(SUM(Quantity), 0) AS totalStockQuantity, COALESCE(SUM(TotalPrice), 0) AS totalStockValue FROM spare_part",
    (err, spareSummary) => {
      if (err) return res.json(err);
      db.query(
        "SELECT SparePartID, Name, Category, Quantity, UnitPrice, TotalPrice FROM spare_part ORDER BY SparePartID",
        (err, spareParts) => {
          if (err) return res.json(err);
          db.query(
            "SELECT COUNT(*) AS totalStockIn, COALESCE(SUM(StockInQuantity), 0) AS totalStockInQuantity FROM stock_in",
            (err, stockInSummary) => {
              if (err) return res.json(err);
              db.query(
                "SELECT COUNT(*) AS totalStockOut, COALESCE(SUM(StockOutQuantity), 0) AS totalStockOutQuantity, COALESCE(SUM(StockOutTotalPrice), 0) AS totalStockOutValue FROM stock_out",
                (err, stockOutSummary) => {
                  if (err) return res.json(err);
                  res.json({
                    spareSummary: spareSummary[0],
                    spareParts,
                    stockInSummary: stockInSummary[0],
                    stockOutSummary: stockOutSummary[0],
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

/* =========================
   AUTH (REGISTER + LOGIN)
========================= */

// REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("REGISTER HIT:", req.body);

  db.query(
    "SELECT * FROM users WHERE Username = ?",
    [username],
    (err, result) => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }

      if (result.length > 0) {
        return res.json({ success: false, message: "Username already exists" });
      }

      db.query(
        "INSERT INTO users (Username, Password) VALUES (?, ?)",
        [username, password],
        (err) => {
          if (err) {
            return res.json({ success: false, message: err.message });
          }

          res.json({
            success: true,
            message: "Account created successfully"
          });
        }
      );
    }
  );
});


// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "All fields are required." });
  }

  db.query(
    "SELECT * FROM users WHERE Username = ? AND Password = ?",  // ← lowercase
    [username, password],
    (err, result) => {
      if (err) return res.json({ success: false, message: err.message });

      if (result.length > 0) {
        res.json({ success: true, message: "Login successful." });
      } else {
        res.json({ success: false, message: "Invalid username or password." });
      }
    }
  );
});

/* =========================
   INSERT (ALL TABLES)
========================= */

// Spare Part
app.post("/spare", (req, res) => {
  const { name, category, quantity, unitPrice } = req.body;
  const total = quantity * unitPrice;

  db.query(
    "INSERT INTO spare_part (Name, Category, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)",
    [name, category, quantity, unitPrice, total],
    (err) => {
      if (err) return res.json({ success: false, message: err.message });
      res.json({ success: true, message: "Spare Part Added" });
    }
  );
});

// Stock In
app.post("/stockin", (req, res) => {
  const { sparePartID, quantity, date } = req.body;

  db.query(
    "INSERT INTO stock_in (SparePartID, StockInQuantity, StockInDate) VALUES (?, ?, ?)",
    [sparePartID, quantity, date],
    (err) => {
      if (err) return res.json({ success: false, message: err.message });

      db.query(
        "UPDATE spare_part SET Quantity = Quantity + ? WHERE SparePartID = ?",
        [quantity, sparePartID]
      );

      res.json({ success: true, message: "Stock In Added" });
    }
  );
});

// Stock Out
app.post("/stockout", (req, res) => {
  const { sparePartID, quantity, unitPrice, date } = req.body;
  const total = quantity * unitPrice;

  db.query(
    "INSERT INTO stock_out (SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate) VALUES (?, ?, ?, ?, ?)",
    [sparePartID, quantity, unitPrice, total, date],
    (err) => {
      if (err) return res.json({ success: false, message: err.message });

      db.query(
        "UPDATE spare_part SET Quantity = Quantity - ? WHERE SparePartID = ?",
        [quantity, sparePartID]
      );

      res.json({ success: true, message: "Stock Out Added" });
    }
  );
});

/* =========================
   STOCK OUT CRUD
========================= */

// GET ALL
app.get("/stockout", (req, res) => {
  db.query("SELECT * FROM stock_out", (err, result) => {
    if (err) return res.json({ success: false, message: err.message });
    res.json(result);
  });
});

// REPORT
app.get("/report", (req, res) => { sendReportResponse(res); });
app.get("/api/report", (req, res) => { sendReportResponse(res); });

// GET BY ID
app.get("/stockout/:id", (req, res) => {
  db.query(
    "SELECT * FROM stock_out WHERE StockOutID = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.json({ success: false, message: err.message });
      if (result.length === 0) return res.json({});
      res.json(result[0]);
    }
  );
});

// UPDATE
app.put("/stockout/:id", (req, res) => {
  const { quantity, unitPrice } = req.body;
  const total = quantity * unitPrice;

  db.query(
    "UPDATE stock_out SET StockOutQuantity=?, StockOutUnitPrice=?, StockOutTotalPrice=? WHERE StockOutID=?",
    [quantity, unitPrice, total, req.params.id],
    (err) => {
      if (err) return res.json({ success: false, message: err.message });
      res.json({ success: true, message: "Updated" });
    }
  );
});

// DELETE
app.delete("/stockout/:id", (req, res) => {
  db.query(
    "DELETE FROM stock_out WHERE StockOutID=?",
    [req.params.id],
    (err) => {
      if (err) return res.json({ success: false, message: err.message });
      res.json({ success: true, message: "Deleted" });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
