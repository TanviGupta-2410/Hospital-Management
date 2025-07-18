const LabTest = require("../models/LabTest")
const { validationResult } = require("express-validator")

// Get all lab tests
const getAllLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find().populate("patient", "name patientId").sort({ createdAt: -1 }).select("-__v")

    res.status(200).json(labTests)
  } catch (error) {
    console.error("Get lab tests error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching lab tests",
      error: error.message,
    })
  }
}

// Get lab test by ID
const getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id).populate("patient", "name patientId")

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      })
    }

    res.status(200).json(labTest)
  } catch (error) {
    console.error("Get lab test error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching lab test",
      error: error.message,
    })
  }
}

// Create new lab test
const createLabTest = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const labTest = new LabTest(req.body)
    await labTest.save()

    await labTest.populate("patient", "name patientId")

    res.status(201).json({
      success: true,
      message: "Lab test created successfully",
      labTest,
    })
  } catch (error) {
    console.error("Create lab test error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating lab test",
      error: error.message,
    })
  }
}

// Update lab test
const updateLabTest = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const labTest = await LabTest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("patient", "name patientId")

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Lab test updated successfully",
      labTest,
    })
  } catch (error) {
    console.error("Update lab test error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating lab test",
      error: error.message,
    })
  }
}

// Update lab test status
const updateLabTestStatus = async (req, res) => {
  try {
    const { status } = req.body
    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate("patient", "name patientId")

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Lab test status updated successfully",
      labTest,
    })
  } catch (error) {
    console.error("Update lab test status error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating lab test status",
      error: error.message,
    })
  }
}

// Delete lab test
const deleteLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndDelete(req.params.id)

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Lab test deleted successfully",
    })
  } catch (error) {
    console.error("Delete lab test error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting lab test",
      error: error.message,
    })
  }
}

module.exports = {
  getAllLabTests,
  getLabTestById,
  createLabTest,
  updateLabTest,
  updateLabTestStatus,
  deleteLabTest,
}
