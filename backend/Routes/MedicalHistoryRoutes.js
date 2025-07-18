const express = require("express")
const { body } = require("express-validator")
const {
  getMedicalHistoryByPatient,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  upload,
} = require("../controllers/MedicalHistoryController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const medicalHistoryValidation = [
  body("date").isDate().withMessage("Valid date is required"),
  body("diagnosis").notEmpty().withMessage("Diagnosis is required"),
  body("symptoms").notEmpty().withMessage("Symptoms are required"),
  body("treatment").notEmpty().withMessage("Treatment is required"),
  body("doctorName").notEmpty().withMessage("Doctor name is required"),
]

// Routes
router.get(
  "/:patientId",
  authMiddleware,
  roleMiddleware(["admin", "doctor", "receptionist"]),
  getMedicalHistoryByPatient,
)
router.get("/record/:id", authMiddleware, roleMiddleware(["admin", "doctor", "receptionist"]), getMedicalHistoryById)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  upload.array("attachments", 5),
  medicalHistoryValidation,
  createMedicalHistory,
)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "doctor"]),
  upload.array("attachments", 5),
  medicalHistoryValidation,
  updateMedicalHistory,
)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteMedicalHistory)

module.exports = router
