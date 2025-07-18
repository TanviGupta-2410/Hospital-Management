const mongoose = require("mongoose")

const LabTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      unique: true,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
      required: true,
      enum: [
        "Blood Test",
        "Urine Test",
        "X-Ray",
        "CT Scan",
        "MRI",
        "Ultrasound",
        "ECG",
        "Echo",
        "Endoscopy",
        "Biopsy",
        "Pathology",
        "Microbiology",
      ],
    },
    description: {
      type: String,
    },
    results: {
      type: String,
    },
    normalRange: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    reportFile: {
      type: String,
    },
    notes: {
      type: String,
    },
    conductedBy: {
      type: String,
    },
    reportDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate test ID
LabTestSchema.pre("save", async function (next) {
  if (!this.testId) {
    const count = await mongoose.model("LabTest").countDocuments()
    this.testId = `LAB${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("LabTest", LabTestSchema)
