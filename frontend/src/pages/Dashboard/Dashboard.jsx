"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/Sidebar/Sidebar"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { handleError } from "../../utils"
import "./Dashboard.css"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    availableBeds: 0,
    totalRevenue: 0,
    recentPatients: [],
    upcomingAppointments: [],
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        handleError("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      handleError("Error loading dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening at your hospital today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{dashboardData.totalPatients}</h3>
              <p>Total Patients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🩺</div>
            <div className="stat-info">
              <h3>{dashboardData.totalDoctors}</h3>
              <p>Total Doctors</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{dashboardData.todayAppointments}</h3>
              <p>Today's Appointments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛏️</div>
            <div className="stat-info">
              <h3>{dashboardData.availableBeds}</h3>
              <p>Available Beds</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>₹{dashboardData.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Patients</h3>
            </div>
            <div className="recent-patients">
              {dashboardData.recentPatients.length > 0 ? (
                dashboardData.recentPatients.map((patient, index) => (
                  <div key={index} className="patient-item">
                    <div className="patient-avatar">{patient.name?.charAt(0).toUpperCase()}</div>
                    <div className="patient-info">
                      <p className="patient-name">{patient.name}</p>
                      <p className="patient-id">ID: {patient.patientId}</p>
                    </div>
                    <div className="patient-status">
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent patients</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Appointments</h3>
            </div>
            <div className="upcoming-appointments">
              {dashboardData.upcomingAppointments.length > 0 ? (
                dashboardData.upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <div className="appointment-time">
                      <span className="time">{appointment.time}</span>
                      <span className="date">{appointment.date}</span>
                    </div>
                    <div className="appointment-info">
                      <p className="patient-name">{appointment.patientName}</p>
                      <p className="doctor-name">Dr. {appointment.doctorName}</p>
                    </div>
                    <div className="appointment-status">
                      <span className="status-badge pending">Pending</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
