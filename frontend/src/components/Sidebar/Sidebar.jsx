"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { handleSuccess } from "../../utils"
import "./Sidebar.css"

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const userRole = localStorage.getItem("userRole") || "admin"
  const loggedInUser = localStorage.getItem("loggedInUser")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("loggedInUser")
    localStorage.removeItem("userRole")
    handleSuccess("User Logged Out")
    setTimeout(() => {
      navigate("/login")
    }, 1000)
  }

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "doctor", "receptionist", "lab_staff"] },
    { path: "/patients", label: "Patient Management", icon: "👤", roles: ["admin", "doctor", "receptionist"] },
    { path: "/doctors", label: "Doctor Management", icon: "🩺", roles: ["admin"] },
    { path: "/appointments", label: "Appointments", icon: "📆", roles: ["admin", "doctor", "receptionist"] },
    { path: "/billing", label: "Billing & Payments", icon: "💵", roles: ["admin", "receptionist"] },
    { path: "/lab-tests", label: "Lab Tests", icon: "🧪", roles: ["admin", "doctor", "lab_staff"] },
    { path: "/wards", label: "Ward Management", icon: "🛏️", roles: ["admin", "doctor"] },
    { path: "/pharmacy", label: "Pharmacy", icon: "💊", roles: ["admin", "doctor"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🏥 HMS</h2>
        <p>Hospital Management System</p>
      </div>

      <div className="user-info">
        <div className="user-avatar">{loggedInUser?.charAt(0).toUpperCase()}</div>
        <div className="user-details">
          <p className="user-name">{loggedInUser}</p>
          <p className="user-role">{userRole.replace("_", " ").toUpperCase()}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
