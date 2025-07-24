const express = require("express")
const router = express.Router()
const auth = require("../middlewares/AuthMiddleware")
const Bill = require("../models/Bill")

// Create a new bill
router.post("/", auth, async (req, res) => {
  try {
    // Validate required fields
    const { patient, items, subtotal, gstAmount, totalAmount } = req.body
    
    if (!patient || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: "Invalid bill data. Patient and at least one item are required." 
      })
    }

    // Validate each item
    for (const item of items) {
      if (!item.description || !item.quantity || !item.unitPrice || !item.total) {
        return res.status(400).json({ 
          message: "Each item must have description, quantity, unitPrice, and total" 
        })
      }
    }

    // Create and save bill
    const bill = new Bill(req.body)
    const savedBill = await bill.save()
    
    // Populate patient details before sending response
    const populatedBill = await Bill.findById(savedBill._id).populate("patient")
    res.status(201).json(populatedBill)
  } catch (error) {
    console.error("Bill creation error:", error)
    res.status(400).json({ 
      message: error.message || "Failed to create bill",
      details: error.errors || {} 
    })
  }
})

// Get all bills
router.get("/", auth, async (req, res) => {
  try {
    const bills = await Bill.find().populate("patient")
    res.json(bills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update bill payment status
router.patch("/:id/payment-status", auth, async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    )
    if (!bill) return res.status(404).json({ message: "Bill not found" })
    res.json(bill)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update bill
router.put("/:id", auth, async (req, res) => {
  try {
    // Validate required fields
    const { patient, items, subtotal, gstAmount, totalAmount } = req.body
    
    if (!patient || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: "Invalid bill data. Patient and at least one item are required." 
      })
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate("patient")

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" })
    }

    res.json(bill)
  } catch (error) {
    console.error("Bill update error:", error)
    res.status(400).json({ 
      message: error.message || "Failed to update bill",
      details: error.errors || {}
    })
  }
})

// Generate PDF for bill
router.get("/:id/pdf", auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("patient")
    if (!bill) return res.status(404).json({ message: "Bill not found" })
    // Add PDF generation logic here
    res.json({ message: "PDF generation endpoint" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router