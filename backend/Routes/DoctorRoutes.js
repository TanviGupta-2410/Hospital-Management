const express = require("express")
const { body } = require("express-validator")
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
} = require("../controllers/DoctorController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const doctorValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("specialization").notEmpty().withMessage("Specialization is required"),
  body("qualification").notEmpty().withMessage("Qualification is required"),
  body("experience").isInt({ min: 0 }).withMessage("Experience must be a non-negative integer"),
  body("consultationFee").isFloat({ min: 0 }).withMessage("Consultation fee must be a positive number"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getAllDoctors)
router.get("/search", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), searchDoctors)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getDoctorById)
router.post("/", authMiddleware, roleMiddleware(["admin"]), doctorValidation, createDoctor)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), doctorValidation, updateDoctor)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteDoctor)

module.exports = router
