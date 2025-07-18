const Medicine = require("../models/Medicine")
const { validationResult } = require("express-validator")

// Get all medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isActive: true }).sort({ createdAt: -1 }).select("-__v")

    res.status(200).json(medicines)
  } catch (error) {
    console.error("Get medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message,
    })
  }
}

// Get medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    res.status(200).json(medicine)
  } catch (error) {
    console.error("Get medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message,
    })
  }
}

// Create new medicine
const createMedicine = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const medicine = new Medicine(req.body)
    await medicine.save()

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      medicine,
    })
  } catch (error) {
    console.error("Create medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating medicine",
      error: error.message,
    })
  }
}

// Update medicine
const updateMedicine = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine,
    })
  } catch (error) {
    console.error("Update medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating medicine",
      error: error.message,
    })
  }
}

// Delete medicine
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    })
  } catch (error) {
    console.error("Delete medicine error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting medicine",
      error: error.message,
    })
  }
}

// Search medicines
const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query

    const medicines = await Medicine.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { genericName: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).limit(20)

    res.status(200).json(medicines)
  } catch (error) {
    console.error("Search medicines error:", error)
    res.status(500).json({
      success: false,
      message: "Error searching medicines",
      error: error.message,
    })
  }
}

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
}
