require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoutes = require("./src/routes/admin");
const serviceRoutes = require("./src/routes/services");
const appointmentRoutes = require("./src/routes/appointments");

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Backend API running");
});
app.listen(process.env.DB_PORT, () => {
  console.log(`Server running on port ${process.env.DB_PORT}`);
});

