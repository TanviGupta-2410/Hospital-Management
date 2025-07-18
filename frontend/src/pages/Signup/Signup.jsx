"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { handleError, handleSuccess } from "../../utils"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./Signup.css"

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    const { name, email, password, role } = signupInfo

    if (!name || !email || !password) {
      return handleError("Name, email and password are required")
    }

    setLoading(true)

    try {
      const url = "http://localhost:8080/auth/signup"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      })
      console.log(response);
      const result = await response.json()
      console.log("Signup response:", result)
      const { success, message, error } = result

      if (success) {
        handleSuccess(message || "Signup successful")
        setTimeout(() => navigate("/login"), 1500)
      } else if (error?.details) {
        handleError(error.details[0].message)
      } else {
        handleError(message || "Signup failed")
      }
    } catch (err) {
      console.error("Error in signup request:", err)
      handleError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Creating account..." />
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>🏥 Hospital Management System</h1>
          <h2>Create Account</h2>
          <p>Join our hospital management system</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
              value={signupInfo.name}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={signupInfo.email}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={signupInfo.password}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              onChange={handleChange}
              name="role"
              id="role"
              className="form-select"
              value={signupInfo.role}
              required
            >
              <option value="receptionist">Receptionist</option>
              <option value="doctor">Doctor</option>
              <option value="lab_staff">Lab Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary signup-btn">
            Create Account
          </button>

          <div className="signup-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Signup
