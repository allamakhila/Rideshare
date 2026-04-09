import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdCard, FaCar, FaCalendarAlt, FaStar, FaEdit, FaSave, FaTimes, FaArrowLeft, FaUserCircle } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  console.log(user);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ color: "#ef4444", textAlign: "center" }}>No user data found. Please login again.</p>
          <button style={styles.backButton} onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    card: {
      maxWidth: "600px",
      margin: "0 auto",
      background: "white",
      borderRadius: "28px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      padding: "30px",
      textAlign: "center",
      position: "relative",
    },
    avatar: {
      width: "100px",
      height: "100px",
      background: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    },
    avatarIcon: {
      fontSize: "60px",
      color: "#3b82f6",
    },
    name: {
      fontSize: "24px",
      fontWeight: "700",
      color: "white",
      marginBottom: "5px",
    },
    role: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      background: "rgba(255,255,255,0.2)",
      color: "white",
    },
    content: {
      padding: "30px",
    },
    section: {
      marginBottom: "25px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "8px",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f1f5f9",
    },
    infoIcon: {
      width: "35px",
      color: "#3b82f6",
      fontSize: "18px",
    },
    infoLabel: {
      width: "100px",
      fontWeight: "500",
      color: "#64748b",
      fontSize: "14px",
    },
    infoValue: {
      flex: 1,
      color: "#1e293b",
      fontWeight: "500",
      fontSize: "14px",
    },
    infoInput: {
      flex: 1,
      padding: "8px 12px",
      borderRadius: "10px",
      border: "2px solid #e2e8f0",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s",
      backgroundColor: "#f8fafc",
    },
    badge: {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      background: "#dcfce7",
      color: "#166534",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "25px",
      flexWrap: "wrap",
    },
    editButton: {
      flex: 1,
      padding: "12px 20px",
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    saveButton: {
      flex: 1,
      padding: "12px 20px",
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    cancelButton: {
      flex: 1,
      padding: "12px 20px",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
    },
    backButton: {
      padding: "12px 20px",
      background: "#64748b",
      color: "white",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      flex: 1,
    },
    driverCard: {
      background: "#f8fafc",
      borderRadius: "16px",
      padding: "15px",
      marginTop: "10px",
    },
    driverInfo: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      marginBottom: "8px",
    },
    driverIcon: {
      fontSize: "24px",
      color: "#3b82f6",
    },
    emptyState: {
      color: "#94a3b8",
      fontSize: "13px",
      fontStyle: "italic",
    },
  };

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    setIsEditing(false);
    alert("Profile updated successfully!");
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            <FaUserCircle style={styles.avatarIcon} />
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              style={{
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "8px 16px",
                color: "white",
                width: "80%",
                margin: "0 auto 5px",
                display: "block",
              }}
            />
          ) : (
            <h1 style={styles.name}>{user.name || "User"}</h1>
          )}
          <div style={styles.role}>{user.role === "DRIVER" ? "🚗 Driver" : "👤 Passenger"}</div>
        </div>

        <div style={styles.content}>
          {/* Personal Information */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaUser /> Personal Information
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}><FaEnvelope /></div>
              <div style={styles.infoLabel}>Email</div>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  style={styles.infoInput}
                />
              ) : (
                <div style={styles.infoValue}>{user.email}</div>
              )}
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}><FaIdCard /></div>
              <div style={styles.infoLabel}>User ID</div>
              <div style={styles.infoValue}>{user.id || "N/A"}</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}><FaStar /></div>
              <div style={styles.infoLabel}>Status</div>
              <div style={styles.infoValue}><span style={styles.badge}>Active</span></div>
            </div>
          </div>

          {/* Activity Section */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <FaCalendarAlt /> Activity
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}>🚗</div>
              <div style={styles.infoLabel}>Total Rides</div>
              <div style={styles.infoValue}>Coming soon</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoIcon}>⭐</div>
              <div style={styles.infoLabel}>Rating</div>
              <div style={styles.infoValue}>Coming soon</div>
            </div>
          </div>

          {/* Role Based Information */}
          {user.role === "DRIVER" && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <FaCar /> Vehicle Details
              </div>
              <div style={styles.driverCard}>
                <div style={styles.driverInfo}>
                  <FaCar style={styles.driverIcon} />
                  <div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>Vehicle Type</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>{user.vehicleType || "Not added yet"}</div>
                  </div>
                </div>
                <div style={styles.driverInfo}>
                  <FaIdCard style={styles.driverIcon} />
                  <div>
                    <div style={{ fontWeight: "600", color: "#1e293b" }}>License Plate</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>{user.licensePlate || "Not added yet"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user.role === "PASSENGER" && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                👤 Passenger Info
              </div>
              <div style={styles.driverCard}>
                <p style={{ color: "#64748b", margin: 0 }}>Enjoy your rides with us! 🚗✨</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <button style={styles.saveButton} onClick={handleSave}>
                  <FaSave /> Save Changes
                </button>
                <button style={styles.cancelButton} onClick={() => setIsEditing(false)}>
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            )}
            <button style={styles.backButton} onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;