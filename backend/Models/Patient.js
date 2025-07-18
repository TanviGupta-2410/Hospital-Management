const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
      type: String,
    },
    allergies: {
      type: String,
    },
    chronicDiseases: {
      type: String,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    bmi: {
      type: Number,
    },
    aadhaarNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    medicalHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalHistory",
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    bills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
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

// Auto-generate patient ID
PatientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const count = await mongoose.model("Patient").countDocuments()
    this.patientId = `PAT${String(count + 1).padStart(6, "0")}`
  }

  // Calculate age
  if (this.dateOfBirth) {
    const today = new Date()
    const birthDate = new Date(this.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    this.age = age
  }

  // Calculate BMI
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100
    this.bmi = Number.parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  next()
})

module.exports = mongoose.model("Patient", PatientSchema)
