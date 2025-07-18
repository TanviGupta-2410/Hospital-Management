const mongoose = require("mongoose")

const MedicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
    },
    doctorName: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("MedicalHistory", MedicalHistorySchema)
