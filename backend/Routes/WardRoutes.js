const express = require("express")
const { body } = require("express-validator")
const {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  assignBed,
  dischargeBed,
  deleteWard,
} = require("../controllers/WardController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const wardValidation = [
  body("wardNumber").notEmpty().withMessage("Ward number is required"),
  body("wardName").notEmpty().withMessage("Ward name is required"),
  body("wardType").notEmpty().withMessage("Ward type is required"),
  body("totalBeds").isInt({ min: 1 }).withMessage("Total beds must be at least 1"),
  body("floor").isInt({ min: 1 }).withMessage("Floor must be at least 1"),
  body("department").notEmpty().withMessage("Department is required"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor"]), getAllWards)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), getWardById)
router.post("/", authMiddleware, roleMiddleware(["admin"]), wardValidation, createWard)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), wardValidation, updateWard)
router.post("/:id/assign-bed", authMiddleware, roleMiddleware(["admin", "doctor"]), assignBed)
router.post("/:id/discharge-bed", authMiddleware, roleMiddleware(["admin", "doctor"]), dischargeBed)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteWard)

module.exports = router
