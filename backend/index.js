const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

// Import routes
const AuthRouter = require("./Routes/AuthRouters")
const PatientRouter = require("./routes/PatientRoutes")
const DoctorRouter = require("./routes/DoctorRoutes")
const AppointmentRouter = require("./routes/AppointmentRoutes")
const DashboardRouter = require("./routes/DashboardRoutes")
const LabTestRouter = require("./Routes/LabTestRoutes")
const WardRouter = require("./routes/WardRoutes")
const MedicineRouter = require("./routes/MedicineRoutes")
const PrescriptionRouter = require("./routes/PrescriptionRoutes")
const MedicalHistoryRouter = require("./routes/MedicalHistoryRoutes")
const BillRouter = require("./routes/BillRoutes")

require("dotenv").config()
require("./Models/db")

const PORT = process.env.PORT || 8080

// Create uploads directory if it doesn't exist
const fs = require("fs")
const uploadsDir = path.join(__dirname, "uploads")
const medicalHistoryDir = path.join(uploadsDir, "medical-history")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}
if (!fs.existsSync(medicalHistoryDir)) {
  fs.mkdirSync(medicalHistoryDir, { recursive: true })
}

app.get("/ping", (req, res) => {
  res.send("PONG")
})

app.use(bodyParser.json())
app.use(cors())

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/auth", AuthRouter)
app.use("/api/patients", PatientRouter)
app.use("/api/doctors", DoctorRouter)
app.use("/api/appointments", AppointmentRouter)
app.use("/api/dashboard", DashboardRouter)
app.use("/api/lab-tests", LabTestRouter)
app.use("/api/wards", WardRouter)
app.use("/api/medicines", MedicineRouter)
app.use("/api/prescriptions", PrescriptionRouter)
app.use("/api/medical-history", MedicalHistoryRouter)
app.use("/api/bills", BillRouter)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
