const MedicalHistory = require("../models/MedicalHistory")
const { validationResult } = require("express-validator")
const multer = require("multer")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/medical-history/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only images, PDFs, and Word documents are allowed"))
    }
  },
})

// Get medical history by patient ID
const getMedicalHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params
    const medicalHistory = await MedicalHistory.find({ patient: patientId })
      .populate("patient", "name patientId")
      .sort({ date: -1 })
      .select("-__v")

    res.status(200).json(medicalHistory)
  } catch (error) {
    console.error("Get medical history error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching medical history",
      error: error.message,
    })
  }
}

// Get medical history record by ID
const getMedicalHistoryById = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findById(req.params.id).populate("patient", "name patientId")

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history record not found",
      })
    }

    res.status(200).json(medicalHistory)
  } catch (error) {
    console.error("Get medical history record error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching medical history record",
      error: error.message,
    })
  }
}

// Create new medical history record
const createMedicalHistory = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const medicalHistoryData = { ...req.body }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      medicalHistoryData.attachments = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      }))
    }

    const medicalHistory = new MedicalHistory(medicalHistoryData)
    await medicalHistory.save()

    await medicalHistory.populate("patient", "name patientId")

    res.status(201).json({
      success: true,
      message: "Medical history record created successfully",
      medicalHistory,
    })
  } catch (error) {
    console.error("Create medical history error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating medical history record",
      error: error.message,
    })
  }
}

// Update medical history record
const updateMedicalHistory = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const updateData = { ...req.body }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      updateData.attachments = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      }))
    }

    const medicalHistory = await MedicalHistory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("patient", "name patientId")

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history record not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Medical history record updated successfully",
      medicalHistory,
    })
  } catch (error) {
    console.error("Update medical history error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating medical history record",
      error: error.message,
    })
  }
}

// Delete medical history record
const deleteMedicalHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findByIdAndDelete(req.params.id)

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history record not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Medical history record deleted successfully",
    })
  } catch (error) {
    console.error("Delete medical history error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting medical history record",
      error: error.message,
    })
  }
}

module.exports = {
  getMedicalHistoryByPatient,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  upload,
}
