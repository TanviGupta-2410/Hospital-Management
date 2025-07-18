const Prescription = require("../models/Prescription")
const { validationResult } = require("express-validator")

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patient", "name patientId")
      .sort({ createdAt: -1 })
      .select("-__v")

    res.status(200).json(prescriptions)
  } catch (error) {
    console.error("Get prescriptions error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    })
  }
}

// Get prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate("patient", "name patientId")

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      })
    }

    res.status(200).json(prescription)
  } catch (error) {
    console.error("Get prescription error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching prescription",
      error: error.message,
    })
  }
}

// Create new prescription
const createPrescription = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const prescription = new Prescription(req.body)
    await prescription.save()

    await prescription.populate("patient", "name patientId")

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    })
  } catch (error) {
    console.error("Create prescription error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    })
  }
}

// Update prescription
const updatePrescription = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("patient", "name patientId")

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    })
  } catch (error) {
    console.error("Update prescription error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    })
  }
}

// Delete prescription
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id)

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    })
  } catch (error) {
    console.error("Delete prescription error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting prescription",
      error: error.message,
    })
  }
}

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
}
