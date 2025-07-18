const express = require("express")
const { getDashboardData } = require("../controllers/DashboardController")
const authMiddleware = require("../middlewares/AuthMiddleware")

const router = express.Router()

router.get("/", authMiddleware, getDashboardData)

module.exports = router
