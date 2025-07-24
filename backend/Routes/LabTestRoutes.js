const express = require("express")
const { body } = require("express-validator")
const {
  getAllLabTests,
  getLabTestById,
  createLabTest,
  updateLabTest,
  updateLabTestStatus,
  deleteLabTest,
} = require("../controllers/LabTestController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Update the validation rules
const labTestValidation = [
  body("patient")
    .notEmpty()
    .withMessage("Patient is required")
    .isMongoId()
    .withMessage("Invalid patient ID"),
  body("testName")
    .notEmpty()
    .withMessage("Test name is required")
    .trim(),
  body("testType")
    .notEmpty()
    .withMessage("Test type is required")
    .isIn([
      "Blood Test",
      "Urine Test",
      "X-Ray",
      "CT Scan",
      "MRI",
      "Ultrasound",
      "ECG",
      "Echo",
      "Endoscopy",
      "Biopsy",
      "Pathology",
      "Microbiology",
    ])
    .withMessage("Invalid test type"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed", "Cancelled"])
    .withMessage("Invalid status"),
  body("description").optional().trim(),
  body("results").optional().trim(),
  body("normalRange").optional().trim(),
  body("notes").optional().trim(),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), getAllLabTests)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), getLabTestById)
router.post("/", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), labTestValidation, createLabTest)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), labTestValidation, updateLabTest)
router.patch("/:id/status", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), updateLabTestStatus)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteLabTest)

module.exports = router
