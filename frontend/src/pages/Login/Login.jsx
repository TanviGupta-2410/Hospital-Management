"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { handleError, handleSuccess } from "../../utils"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import "./Login.css"

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginInfo

    if (!email || !password) {
      return handleError("Email and password are required")
    }

    setLoading(true)

    try {
      const url = "http://localhost:8080/auth/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      })

      const result = await response.json()
      const { success, message, jwtToken, name, role, error } = result

      if (success) {
        handleSuccess(message)
        localStorage.setItem("token", jwtToken)
        localStorage.setItem("loggedInUser", name)
        localStorage.setItem("userRole", role)
        setTimeout(() => navigate("/dashboard"), 1500)
      } else if (error?.details) {
        handleError(error.details[0].message)
      } else {
        handleError(message)
      }
    } catch (err) {
      console.error("Error in login request:", err)
      handleError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Logging in..." />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 Hospital Management System</h1>
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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
              value={loginInfo.email}
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
              value={loginInfo.password}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>

          <div className="login-footer">
            <span>Don't have an account? </span>
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
