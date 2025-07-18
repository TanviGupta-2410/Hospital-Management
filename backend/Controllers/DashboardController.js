const Patient = require("../models/Patient")
const Doctor = require("../models/Doctor")
const Appointment = require("../models/Appointment")
const Bill = require("../models/Bill")
const Ward = require("../models/Ward")

const getDashboardData = async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Get counts
    const totalPatients = await Patient.countDocuments({ isActive: true })
    const totalDoctors = await Doctor.countDocuments({ isActive: true })

    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "Cancelled" },
    })

    // Calculate available beds
    const totalBeds = await Ward.aggregate([{ $group: { _id: null, total: { $sum: "$totalBeds" } } }])

    const occupiedBeds = await Ward.aggregate([{ $group: { _id: null, occupied: { $sum: "$occupiedBeds" } } }])

    const availableBeds = (totalBeds[0]?.total || 0) - (occupiedBeds[0]?.occupied || 0)

    // Calculate total revenue
    const revenueResult = await Bill.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const totalRevenue = revenueResult[0]?.total || 0

    // Get recent patients (last 5)
    const recentPatients = await Patient.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name patientId createdAt")

    // Get upcoming appointments (next 5)
    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: new Date() },
      status: "Scheduled",
    })
      .populate("patient", "name")
      .populate("doctor", "name")
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(5)

    const formattedAppointments = upcomingAppointments.map((apt) => ({
      patientName: apt.patient.name,
      doctorName: apt.doctor.name,
      date: apt.appointmentDate.toLocaleDateString(),
      time: apt.appointmentTime,
    }))

    res.status(200).json({
      totalPatients,
      totalDoctors,
      todayAppointments,
      availableBeds,
      totalRevenue,
      recentPatients,
      upcomingAppointments: formattedAppointments,
    })
  } catch (error) {
    console.error("Dashboard data error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    })
  }
}

module.exports = {
  getDashboardData,
}
