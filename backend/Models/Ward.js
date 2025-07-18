const mongoose = require("mongoose")

const BedSchema = new mongoose.Schema({
  bedNumber: {
    type: Number,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  admissionDate: {
    type: Date,
  },
  expectedDischargeDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
})

const WardSchema = new mongoose.Schema(
  {
    wardNumber: {
      type: String,
      unique: true,
      required: true,
    },
    wardName: {
      type: String,
      required: true,
    },
    wardType: {
      type: String,
      required: true,
      enum: ["General", "Private", "ICU", "NICU", "CCU", "Emergency", "Maternity", "Pediatric"],
    },
    totalBeds: {
      type: Number,
      required: true,
      min: 1,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    floor: {
      type: Number,
      required: true,
      min: 1,
    },
    department: {
      type: String,
      required: true,
    },
    nurseInCharge: {
      type: String,
    },
    facilities: {
      type: String,
    },
    beds: [BedSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Initialize beds when ward is created
WardSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("totalBeds")) {
    this.beds = []
    for (let i = 1; i <= this.totalBeds; i++) {
      this.beds.push({
        bedNumber: i,
        isOccupied: false,
      })
    }
  }

  // Calculate occupied beds
  this.occupiedBeds = this.beds.filter((bed) => bed.isOccupied).length

  next()
})

module.exports = mongoose.model("Ward", WardSchema)
