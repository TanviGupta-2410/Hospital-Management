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

// Validation rules
const labTestValidation = [
  body("patient").notEmpty().withMessage("Patient is required"),
  body("testName").notEmpty().withMessage("Test name is required"),
  body("testType").notEmpty().withMessage("Test type is required"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), getAllLabTests)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), getLabTestById)
router.post("/", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), labTestValidation, createLabTest)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), labTestValidation, updateLabTest)
router.patch("/:id/status", authMiddleware, roleMiddleware(["admin", "doctor", "lab_staff"]), updateLabTestStatus)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteLabTest)

module.exports = router
