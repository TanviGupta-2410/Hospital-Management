const Appointment = require("../models/Appointment")
const { validationResult } = require("express-validator")

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name patientId")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .select("-__v")

    res.status(200).json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    })
  }
}

// Get appointments by date
const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params
    const startDate = new Date(date)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("patient", "name patientId")
      .populate("doctor", "name specialization")
      .sort({ appointmentTime: 1 })

    res.status(200).json(appointments)
  } catch (error) {
    console.error("Get appointments by date error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    })
  }
}

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name patientId")
      .populate("doctor", "name specialization")

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json(appointment)
  } catch (error) {
    console.error("Get appointment error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    })
  }
}

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: { $ne: "Cancelled" },
    })

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      })
    }

    const appointment = new Appointment(req.body)
    await appointment.save()

    await appointment.populate("patient", "name patientId")
    await appointment.populate("doctor", "name specialization")

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    })
  } catch (error) {
    console.error("Create appointment error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    })
  }
}

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("patient", "name patientId")
      .populate("doctor", "name specialization")

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    })
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    })
  }
}

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("patient", "name patientId")
      .populate("doctor", "name specialization")

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    })
  } catch (error) {
    console.error("Update appointment status error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    })
  }
}

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    console.error("Delete appointment error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    })
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentsByDate,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
}
