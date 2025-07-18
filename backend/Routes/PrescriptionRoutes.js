const express = require("express")
const { body } = require("express-validator")
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require("../controllers/PrescriptionController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const prescriptionValidation = [
  body("patient").notEmpty().withMessage("Patient is required"),
  body("prescribedBy").notEmpty().withMessage("Prescribed by is required"),
  body("medicines").isArray({ min: 1 }).withMessage("At least one medicine is required"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor"]), getAllPrescriptions)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), getPrescriptionById)
router.post("/", authMiddleware, roleMiddleware(["admin", "doctor"]), prescriptionValidation, createPrescription)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), prescriptionValidation, updatePrescription)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deletePrescription)

module.exports = router
