const mongoose = require("mongoose")

const PrescriptionMedicineSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  instructions: {
    type: String,
  },
})

const PrescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: String,
      unique: true,
      // required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicines: [PrescriptionMedicineSchema],
    prescribedBy: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate prescription ID
PrescriptionSchema.pre("save", async function (next) {
  if (!this.prescriptionId) {
    const count = await mongoose.model("Prescription").countDocuments()
    this.prescriptionId = `PRE${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Prescription", PrescriptionSchema)
