"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "../../components/Sidebar/Sidebar"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { handleError, handleSuccess } from "../../utils"
import { ToastContainer } from "react-toastify"
import "./MedicalHistory.css"

const MedicalHistory = () => {
  const { patientId } = useParams()
  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [activeTab, setActiveTab] = useState("history")
  const [historyForm, setHistoryForm] = useState({
    date: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    prescription: "",
    doctorName: "",
    notes: "",
    followUpDate: "",
    attachments: [],
  })

  useEffect(() => {
    if (patientId) {
      fetchPatient()
      fetchMedicalHistory()
    }
  }, [patientId])

  const fetchPatient = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      } else {
        handleError("Failed to fetch patient details")
      }
    } catch (error) {
      console.error("Fetch patient error:", error)
      handleError("Error loading patient details")
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicalHistory = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/medical-history/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMedicalHistory(data)
      } else {
        handleError("Failed to fetch medical history")
      }
    } catch (error) {
      console.error("Fetch medical history error:", error)
      handleError("Error loading medical history")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setHistoryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setHistoryForm((prev) => ({
      ...prev,
      attachments: files,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("patientId", patientId)

      Object.keys(historyForm).forEach((key) => {
        if (key === "attachments") {
          historyForm.attachments.forEach((file) => {
            formData.append("attachments", file)
          })
        } else {
          formData.append(key, historyForm[key])
        }
      })

      const token = localStorage.getItem("token")
      const url = editingRecord
        ? `http://localhost:8080/api/medical-history/${editingRecord._id}`
        : "http://localhost:8080/api/medical-history"

      const method = editingRecord ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        handleSuccess(editingRecord ? "Medical record updated successfully" : "Medical record added successfully")
        setShowModal(false)
        setEditingRecord(null)
        resetForm()
        fetchMedicalHistory()
      } else {
        const error = await response.json()
        handleError(error.message || "Operation failed")
      }
    } catch (error) {
      console.error("Submit error:", error)
      handleError("Error saving medical record")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setHistoryForm({
      date: record.date ? record.date.split("T")[0] : "",
      diagnosis: record.diagnosis || "",
      symptoms: record.symptoms || "",
      treatment: record.treatment || "",
      prescription: record.prescription || "",
      doctorName: record.doctorName || "",
      notes: record.notes || "",
      followUpDate: record.followUpDate ? record.followUpDate.split("T")[0] : "",
      attachments: [],
    })
    setShowModal(true)
  }

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/medical-history/${recordId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        handleSuccess("Medical record deleted successfully")
        fetchMedicalHistory()
      } else {
        handleError("Failed to delete medical record")
      }
    } catch (error) {
      console.error("Delete error:", error)
      handleError("Error deleting medical record")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setHistoryForm({
      date: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      prescription: "",
      doctorName: "",
      notes: "",
      followUpDate: "",
      attachments: [],
    })
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "N/A"
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  if (loading && !showModal) {
    return <LoadingSpinner message="Loading medical history..." />
  }

  if (!patient) {
    return (
      <div className="medical-history-container">
        <Sidebar />
        <div className="medical-history-content">
          <div className="error-message">
            <h2>Patient not found</h2>
            <p>The requested patient could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="medical-history-container">
      <Sidebar />
      <div className="medical-history-content">
        <div className="page-header">
          <h1>📋 Medical History</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingRecord(null)
              resetForm()
              setShowModal(true)
            }}
          >
            Add Medical Record
          </button>
        </div>

        <div className="patient-summary-card">
          <div className="patient-header">
            <div className="patient-avatar">{patient.name?.charAt(0).toUpperCase()}</div>
            <div className="patient-details">
              <h2>{patient.name}</h2>
              <p className="patient-id">Patient ID: {patient.patientId}</p>
              <div className="patient-info-grid">
                <div className="info-item">
                  <span className="label">Age:</span>
                  <span className="value">{calculateAge(patient.dateOfBirth)} years</span>
                </div>
                <div className="info-item">
                  <span className="label">Gender:</span>
                  <span className="value">{patient.gender}</span>
                </div>
                <div className="info-item">
                  <span className="label">Blood Group:</span>
                  <span className="value">{patient.bloodGroup || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="label">BMI:</span>
                  <span className="value">{calculateBMI(patient.height, patient.weight)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Contact:</span>
                  <span className="value">{patient.contact}</span>
                </div>
                <div className="info-item">
                  <span className="label">Emergency Contact:</span>
                  <span className="value">{patient.emergencyContact || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {(patient.allergies || patient.chronicDiseases) && (
            <div className="medical-alerts">
              {patient.allergies && (
                <div className="alert-item allergies">
                  <strong>⚠️ Allergies:</strong> {patient.allergies}
                </div>
              )}
              {patient.chronicDiseases && (
                <div className="alert-item chronic">
                  <strong>🩺 Chronic Conditions:</strong> {patient.chronicDiseases}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Medical History
            </button>
            <button
              className={`tab ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline View
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "history" && (
              <div className="history-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Diagnosis</th>
                      <th>Symptoms</th>
                      <th>Treatment</th>
                      <th>Doctor</th>
                      <th>Follow-up</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalHistory.map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <div className="diagnosis">{record.diagnosis}</div>
                        </td>
                        <td>
                          <div className="symptoms">{record.symptoms}</div>
                        </td>
                        <td>
                          <div className="treatment">{record.treatment}</div>
                        </td>
                        <td>{record.doctorName}</td>
                        <td>{record.followUpDate ? new Date(record.followUpDate).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(record)}>
                              Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(record._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {medicalHistory.length === 0 && (
                  <div className="no-data">
                    <p>No medical history found for this patient</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="timeline-container">
                {medicalHistory
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record, index) => (
                    <div key={record._id} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h3>{record.diagnosis}</h3>
                          <span className="timeline-date">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-body">
                          <div className="timeline-section">
                            <strong>Symptoms:</strong>
                            <p>{record.symptoms}</p>
                          </div>
                          <div className="timeline-section">
                            <strong>Treatment:</strong>
                            <p>{record.treatment}</p>
                          </div>
                          {record.prescription && (
                            <div className="timeline-section">
                              <strong>Prescription:</strong>
                              <p>{record.prescription}</p>
                            </div>
                          )}
                          <div className="timeline-footer">
                            <span className="doctor-name">Dr. {record.doctorName}</span>
                            {record.followUpDate && (
                              <span className="follow-up">
                                Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {medicalHistory.length === 0 && (
                  <div className="no-data">
                    <p>No medical history found for this patient</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal medical-record-modal">
              <div className="modal-header">
                <h2>{editingRecord ? "Edit Medical Record" : "Add Medical Record"}</h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false)
                    setEditingRecord(null)
                    resetForm()
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="medical-record-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-input"
                      value={historyForm.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Doctor Name *</label>
                    <input
                      type="text"
                      name="doctorName"
                      className="form-input"
                      value={historyForm.doctorName}
                      onChange={handleInputChange}
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input
                      type="date"
                      name="followUpDate"
                      className="form-input"
                      value={historyForm.followUpDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnosis *</label>
                  <input
                    type="text"
                    name="diagnosis"
                    className="form-input"
                    value={historyForm.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Primary diagnosis"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms *</label>
                  <textarea
                    name="symptoms"
                    className="form-input"
                    rows="3"
                    value={historyForm.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe the symptoms..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Treatment *</label>
                  <textarea
                    name="treatment"
                    className="form-input"
                    rows="3"
                    value={historyForm.treatment}
                    onChange={handleInputChange}
                    placeholder="Treatment provided..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prescription</label>
                  <textarea
                    name="prescription"
                    className="form-input"
                    rows="3"
                    value={historyForm.prescription}
                    onChange={handleInputChange}
                    placeholder="Medications prescribed..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    name="notes"
                    className="form-input"
                    rows="2"
                    value={historyForm.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attachments</label>
                  <input
                    type="file"
                    name="attachments"
                    className="form-input"
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <small className="file-help">You can upload multiple files (PDF, Images, Word documents)</small>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingRecord(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : editingRecord ? "Update Record" : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default MedicalHistory
