const mongoose = require("mongoose")

const BillSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      unique: true,
      // required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    gstAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance"],
    },
    insuranceDetails: {
      provider: String,
      policyNumber: String,
      claimAmount: Number,
    },
    billDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate bill ID
BillSchema.pre("save", async function (next) {
  if (!this.billId) {
    const count = await mongoose.model("Bill").countDocuments()
    this.billId = `BILL${String(count + 1).padStart(6, "0")}`
  }
  next()
})

module.exports = mongoose.model("Bill", BillSchema)
