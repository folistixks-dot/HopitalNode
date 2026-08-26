const authRoutes = require("./routes/authRoutes");
const specialtyRoutes = require("./routes/specialtyRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminPatientRoutes = require("./routes/adminPatientRoutes");
const adminDoctorRoutes = require("./routes/adminDoctorRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminVerificationRoutes = require("./routes/adminVerificationRoutes");
const path = require("path");
const express = require("express");

const app = express();
let port = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin/patients", adminPatientRoutes);
app.use("/api/admin/doctors", adminDoctorRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/admin", adminVerificationRoutes);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
