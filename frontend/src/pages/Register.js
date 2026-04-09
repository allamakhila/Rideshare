import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaCar, FaUserFriends } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("PASSENGER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState({
    fullName: false,
    email: false,
    password: false,
    contact: false,
    otp: false,
  });

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
      padding: "20px",
    },

    bgCircle1: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      top: "-150px",
      right: "-100px",
      opacity: 0.3,
      animation: "float 6s ease-in-out infinite",
    },

    bgCircle2: {
      position: "absolute",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      bottom: "-200px",
      left: "-150px",
      opacity: 0.3,
      animation: "float 8s ease-in-out infinite reverse",
    },

    card: {
      background: "rgba(255,255,255,0.98)",
      backdropFilter: "blur(0px)",
      padding: "40px 40px",
      borderRadius: "32px",
      width: "460px",
      maxWidth: "100%",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      zIndex: 10,
      transition: "transform 0.3s ease",
    },

    logoSection: {
      textAlign: "center",
      marginBottom: "8px",
    },

    logoIcon: {
      fontSize: "40px",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      width: "65px",
      height: "65px",
      borderRadius: "18px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
    },

    title: {
      fontSize: "28px",
      fontWeight: "700",
      textAlign: "center",
      color: "#0f172a",
      marginBottom: "4px",
      letterSpacing: "-0.5px",
    },

    subtitle: {
      fontSize: "14px",
      textAlign: "center",
      color: "#64748b",
      marginBottom: "8px",
    },

    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    inputIcon: {
      position: "absolute",
      left: "16px",
      color: "#94a3b8",
      fontSize: "16px",
    },

    input: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      outline: "none",
      fontSize: "14px",
      background: "#ffffff",
      transition: "all 0.3s ease",
      fontWeight: "500",
      color: "#0f172a",
      boxSizing: "border-box",
    },

    inputFocus: {
      border: "2px solid #6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },

    eye: {
      position: "absolute",
      right: "16px",
      cursor: "pointer",
      color: "#94a3b8",
      fontSize: "18px",
      transition: "color 0.2s",
      zIndex: 2,
    },

    roleContainer: {
      display: "flex",
      gap: "12px",
      marginTop: "4px",
    },

    roleBtn: {
      flex: 1,
      padding: "12px",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      cursor: "pointer",
      background: "white",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },

    activeRole: {
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      border: "2px solid #6366f1",
      color: "white",
    },

    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "14px",
      border: "none",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
      marginTop: "8px",
    },

    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },

    link: {
      textAlign: "center",
      marginTop: "8px",
      color: "#6366f1",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "color 0.2s",
    },

    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#94a3b8",
      fontSize: "12px",
      marginTop: "8px",
    },

    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#e2e8f0",
    },

    otpSection: {
      marginTop: "4px",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/send-otp", {
        email: formData.email,
      });

      alert("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      console.log("Full error:", error);
      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Server not reachable");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      await axios.post("http://localhost:8081/api/auth/register", {
        ...formData,
        role: role,
      });

      alert("Registered Successfully!");
      navigate("/login");
    } catch (error) {
      alert("Invalid OTP or Registration Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: "fullName", placeholder: "Full Name", icon: FaUser, type: "text" },
    { name: "email", placeholder: "Email Address", icon: FaEnvelope, type: "email" },
    { name: "password", placeholder: "Password", icon: FaLock, type: "password", showToggle: true },
    { name: "contact", placeholder: "Phone Number", icon: FaPhone, type: "tel" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <FaUserFriends style={{ fontSize: "28px", color: "white" }} />
          </div>
          <div style={styles.title}>Create Account</div>
          <div style={styles.subtitle}>Join our community of riders</div>
        </div>

        {inputFields.map((field) => (
          <div key={field.name}>
            <div style={styles.inputWrapper}>
              <field.icon style={styles.inputIcon} />
              <input
                type={field.type === "password" && !field.showToggle ? "password" : field.type}
                name={field.name}
                placeholder={field.placeholder}
                style={{
                  ...styles.input,
                  ...(inputFocus[field.name] ? styles.inputFocus : {}),
                }}
                value={formData[field.name]}
                onChange={handleChange}
                onFocus={() => setInputFocus({ ...inputFocus, [field.name]: true })}
                onBlur={() => setInputFocus({ ...inputFocus, [field.name]: false })}
              />
              {field.showToggle && (
                <span
                  style={styles.eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>
          </div>
        ))}

        <div style={styles.roleContainer}>
          <button
            type="button"
            style={{
              ...styles.roleBtn,
              ...(role === "PASSENGER" ? styles.activeRole : {}),
            }}
            onClick={() => setRole("PASSENGER")}
          >
            <FaUserFriends size={14} /> Passenger
          </button>
          <button
            type="button"
            style={{
              ...styles.roleBtn,
              ...(role === "DRIVER" ? styles.activeRole : {}),
            }}
            onClick={() => setRole("DRIVER")}
          >
            <FaCar size={14} /> Driver
          </button>
        </div>

        {!otpSent ? (
          <button
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            onClick={handleSendOtp}
            disabled={isLoading}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <div style={styles.otpSection}>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                name="otp"
                placeholder="Enter OTP Code"
                style={{
                  ...styles.input,
                  ...(inputFocus.otp ? styles.inputFocus : {}),
                }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setInputFocus({ ...inputFocus, otp: true })}
                onBlur={() => setInputFocus({ ...inputFocus, otp: false })}
              />
            </div>

            <button
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
              onClick={handleVerifyAndRegister}
              disabled={isLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isLoading ? "Registering..." : "Verify & Register"}
            </button>
          </div>
        )}

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>Already have an account?</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.link} onClick={() => navigate("/login")}>
          Sign In →
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        div[style*="card"] {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Register;