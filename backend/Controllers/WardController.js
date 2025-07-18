const Ward = require("../models/Ward")
const { validationResult } = require("express-validator")

// Get all wards
const getAllWards = async (req, res) => {
  try {
    const wards = await Ward.find({ isActive: true })
      .populate("beds.patient", "name patientId")
      .sort({ createdAt: -1 })
      .select("-__v")

    res.status(200).json(wards)
  } catch (error) {
    console.error("Get wards error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching wards",
      error: error.message,
    })
  }
}

// Get ward by ID
const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id).populate("beds.patient", "name patientId")

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      })
    }

    res.status(200).json(ward)
  } catch (error) {
    console.error("Get ward error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching ward",
      error: error.message,
    })
  }
}

// Create new ward
const createWard = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const ward = new Ward(req.body)
    await ward.save()

    res.status(201).json({
      success: true,
      message: "Ward created successfully",
      ward,
    })
  } catch (error) {
    console.error("Create ward error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating ward",
      error: error.message,
    })
  }
}

// Update ward
const updateWard = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const ward = await Ward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Ward updated successfully",
      ward,
    })
  } catch (error) {
    console.error("Update ward error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating ward",
      error: error.message,
    })
  }
}

// Assign bed
const assignBed = async (req, res) => {
  try {
    const { bedNumber, patient, admissionDate, expectedDischargeDate, notes } = req.body
    const ward = await Ward.findById(req.params.id)

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      })
    }

    const bed = ward.beds.find((b) => b.bedNumber === bedNumber)
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      })
    }

    if (bed.isOccupied) {
      return res.status(400).json({
        success: false,
        message: "Bed is already occupied",
      })
    }

    bed.isOccupied = true
    bed.patient = patient
    bed.admissionDate = admissionDate
    bed.expectedDischargeDate = expectedDischargeDate
    bed.notes = notes

    await ward.save()

    res.status(200).json({
      success: true,
      message: "Bed assigned successfully",
      ward,
    })
  } catch (error) {
    console.error("Assign bed error:", error)
    res.status(500).json({
      success: false,
      message: "Error assigning bed",
      error: error.message,
    })
  }
}

// Discharge bed
const dischargeBed = async (req, res) => {
  try {
    const { bedNumber } = req.body
    const ward = await Ward.findById(req.params.id)

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      })
    }

    const bed = ward.beds.find((b) => b.bedNumber === bedNumber)
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      })
    }

    bed.isOccupied = false
    bed.patient = null
    bed.admissionDate = null
    bed.expectedDischargeDate = null
    bed.notes = null

    await ward.save()

    res.status(200).json({
      success: true,
      message: "Patient discharged successfully",
      ward,
    })
  } catch (error) {
    console.error("Discharge bed error:", error)
    res.status(500).json({
      success: false,
      message: "Error discharging patient",
      error: error.message,
    })
  }
}

// Delete ward
const deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Ward deleted successfully",
    })
  } catch (error) {
    console.error("Delete ward error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting ward",
      error: error.message,
    })
  }
}

module.exports = {
  getAllWards,
  getWardById,
  createWard,
  updateWard,
  assignBed,
  dischargeBed,
  deleteWard,
}
