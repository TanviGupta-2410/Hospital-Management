const express = require("express")
const { body } = require("express-validator")
const {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
} = require("../controllers/MedicineController")
const authMiddleware = require("../middlewares/AuthMiddleware")
const roleMiddleware = require("../middlewares/RoleMiddleware")

const router = express.Router()

// Validation rules
const medicineValidation = [
  body("name").notEmpty().withMessage("Medicine name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("dosageForm").notEmpty().withMessage("Dosage form is required"),
  body("unitPrice").isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),
  body("stockQuantity").isInt({ min: 0 }).withMessage("Stock quantity must be a non-negative integer"),
]

// Routes
router.get("/", authMiddleware, roleMiddleware(["admin", "doctor"]), getAllMedicines)
router.get("/search", authMiddleware, roleMiddleware(["admin", "doctor"]), searchMedicines)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "doctor"]), getMedicineById)
router.post("/", authMiddleware, roleMiddleware(["admin"]), medicineValidation, createMedicine)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), medicineValidation, updateMedicine)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteMedicine)

module.exports = router
