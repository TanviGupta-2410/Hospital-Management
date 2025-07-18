const express = require("express")
const { body } = require("express-validator")
const {
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/AppointmentController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const appointmentValidation = [
  body("patient").notEmpty().withMessage("Patient is required"),
  body("doctor").notEmpty().withMessage("Doctor is required"),
  body("appointmentDate").isDate().withMessage("Valid appointment date is required"),
  body("appointmentTime").notEmpty().withMessage("Appointment time is required"),
  body("reason").notEmpty().withMessage("Reason for visit is required"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getAllAppointments)
router.get("/date/:date", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getAppointmentsByDate)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getAppointmentById)
router.post("/", authMiddleware, roleMiddleware(["admin", "receptionist"]), appointmentValidation, createAppointment)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "receptionist"]), appointmentValidation, updateAppointment)
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "doctor", "receptionist"]),
  updateAppointmentStatus,
)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteAppointment)

module.exports = router
