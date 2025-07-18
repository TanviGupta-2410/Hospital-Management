const mongoose = require("mongoose")

const MedicineSchema = new mongoose.Schema(
  {
    medicineId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    genericName: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Antibiotics",
        "Analgesics",
        "Antacids",
        "Antihistamines",
        "Cardiovascular",
        "Diabetes",
        "Respiratory",
        "Neurological",
        "Vitamins",
        "Supplements",
      ],
    },
    dosageForm: {
      type: String,
      required: true,
      enum: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops", "Inhaler"],
    },
    strength: {
      type: String,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minStockLevel: {
      type: Number,
      default: 10,
    },
    expiryDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate medicine ID
MedicineSchema.pre("save", async function (next) {
  if (!this.medicineId) {
    const count = await mongoose.model("Medicine").countDocuments()
    this.medicineId = `MED${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Medicine", MedicineSchema)
