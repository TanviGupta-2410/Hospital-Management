const Doctor = require("../models/Doctor")
const { validationResult } = require("express-validator")

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ createdAt: -1 }).select("-__v")

    res.status(200).json(doctors)
  } catch (error) {
    console.error("Get doctors error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    })
  }
}

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("appointments").populate("patients")

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      })
    }

    res.status(200).json(doctor)
  } catch (error) {
    console.error("Get doctor error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error.message,
    })
  }
}

// Create new doctor
const createDoctor = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Check for duplicate doctor email
    const existingDoctor = await Doctor.findOne({ email: req.body.email })
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      })
    }

    const doctor = new Doctor(req.body)
    await doctor.save()

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    })
  } catch (error) {
    console.error("Create doctor error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating doctor",
      error: error.message,
    })
  }
}

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    })
  } catch (error) {
    console.error("Update doctor error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: error.message,
    })
  }
}

// Delete doctor (soft delete)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    })
  } catch (error) {
    console.error("Delete doctor error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: error.message,
    })
  }
}

// Search doctors
const searchDoctors = async (req, res) => {
  try {
    const { query } = req.query

    const doctors = await Doctor.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { doctorId: { $regex: query, $options: "i" } },
      ],
    }).limit(20)

    res.status(200).json(doctors)
  } catch (error) {
    console.error("Search doctors error:", error)
    res.status(500).json({
      success: false,
      message: "Error searching doctors",
      error: error.message,
    })
  }
}

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
}
