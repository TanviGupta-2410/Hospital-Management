const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
      
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No Show"],
      default: "Scheduled",
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    prescription: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate appointment ID
AppointmentSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    const count = await mongoose.model("Appointment").countDocuments()
    this.appointmentId = `APT${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Appointment", AppointmentSchema)
