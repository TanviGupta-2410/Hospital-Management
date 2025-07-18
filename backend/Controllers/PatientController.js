const Patient = require("../models/Patient")
const { validationResult } = require("express-validator")

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true }).sort({ createdAt: -1 }).select("-__v")

    res.status(200).json(patients)
  } catch (error) {
    console.error("Get patients error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    })
  }
}

// Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("medicalHistory")
      .populate("appointments")
      .populate("bills")

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    res.status(200).json(patient)
  } catch (error) {
    console.error("Get patient error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching patient",
      error: error.message,
    })
  }
}

// Create new patient
const createPatient = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Check for duplicate patient (name + DOB or contact)
    const existingPatient = await Patient.findOne({
      $or: [
        {
          name: req.body.name,
          dateOfBirth: req.body.dateOfBirth,
        },
        { contact: req.body.contact },
      ],
    })

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient with same name & DOB or contact already exists",
      })
    }

    const patient = new Patient(req.body)
    await patient.save()

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    })
  } catch (error) {
    console.error("Create patient error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating patient",
      error: error.message,
    })
  }
}

// Update patient
const updatePatient = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    })
  } catch (error) {
    console.error("Update patient error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating patient",
      error: error.message,
    })
  }
}

// Delete patient (soft delete)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    })
  } catch (error) {
    console.error("Delete patient error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting patient",
      error: error.message,
    })
  }
}

// Search patients
const searchPatients = async (req, res) => {
  try {
    const { query } = req.query

    const patients = await Patient.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { patientId: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).limit(20)

    res.status(200).json(patients)
  } catch (error) {
    console.error("Search patients error:", error)
    res.status(500).json({
      success: false,
      message: "Error searching patients",
      error: error.message,
    })
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
}
