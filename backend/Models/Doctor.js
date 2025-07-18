const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      unique: true,
  
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    schedule: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate doctor ID
DoctorSchema.pre("save", async function (next) {
  if (!this.doctorId) {
    const count = await mongoose.model("Doctor").countDocuments()
    this.doctorId = `DOC${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Doctor", DoctorSchema)
