const express = require("express")
const { body } = require("express-validator")
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
} = require("../controllers/PatientController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const patientValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("dateOfBirth").isDate().withMessage("Valid date of birth is required"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Valid gender is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getAllPatients)
router.get("/search", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), searchPatients)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getPatientById)
router.post("/", authMiddleware, roleMiddleware(["admin", "receptionist"]), patientValidation, createPatient)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "receptionist"]), patientValidation, updatePatient)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deletePatient)

module.exports = router
