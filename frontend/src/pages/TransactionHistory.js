import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSync, FaReceipt, FaRupeeSign, FaCalendarAlt, FaCar, FaIdCard, FaUser, FaMapMarkerAlt, FaTimes, FaEye } from "react-icons/fa";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "white",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    subtitle: {
      color: "#94a3b8",
      fontSize: "14px",
    },
    refreshButton: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "12px 24px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "14px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px",
      color: "#94a3b8",
      fontSize: "16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "24px",
      backdropFilter: "blur(10px)",
    },
    emptyIcon: {
      fontSize: "64px",
      color: "#475569",
      marginBottom: "16px",
    },
    emptyText: {
      color: "#94a3b8",
      fontSize: "16px",
    },
    transactionsGrid: {
      display: "grid",
      gap: "20px",
    },
    transactionCard: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "20px",
      padding: "20px",
      transition: "all 0.3s ease",
      border: "1px solid rgba(0,0,0,0.05)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      marginBottom: "15px",
      paddingBottom: "15px",
      borderBottom: "2px solid #e2e8f0",
    },
    routeInfo: {
      flex: 1,
    },
    route: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "5px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap",
    },
    routeArrow: {
      color: "#3b82f6",
      fontSize: "16px",
    },
    date: {
      fontSize: "12px",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "12px",
      fontWeight: "600",
      background: status === "PAID" || status === "SUCCESS" ? "#dcfce7" : "#fee2e2",
      color: status === "PAID" || status === "SUCCESS" ? "#166534" : "#991b1b",
    }),
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
      marginBottom: "15px",
    },
    detailItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    detailIcon: {
      color: "#3b82f6",
      fontSize: "16px",
      width: "24px",
    },
    detailLabel: {
      fontSize: "12px",
      color: "#64748b",
      marginBottom: "2px",
    },
    detailValue: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1e293b",
    },
    receiptButton: {
      background: "linear-gradient(135deg, #10b981, #059669)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "10px 20px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      marginTop: "10px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "white",
      borderRadius: "24px",
      width: "500px",
      maxWidth: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },
    modalHeader: {
      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
      padding: "20px",
      borderRadius: "24px 24px 0 0",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    modalClose: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      transition: "all 0.3s",
    },
    modalBody: {
      padding: "24px",
    },
    receiptRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #e2e8f0",
    },
    receiptLabel: {
      fontWeight: "500",
      color: "#64748b",
    },
    receiptValue: {
      fontWeight: "600",
      color: "#1e293b",
      textAlign: "right",
    },
    amountHighlight: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#10b981",
    },
    divider: {
      height: "1px",
      background: "#e2e8f0",
      margin: "15px 0",
    },
  };

  const fetchTransactions = async () => {
    if (!loggedInUser?.email) return;

    setLoading(true);

    try {
      let url = "";

      if (loggedInUser.role === "PASSENGER") {
        url = `http://localhost:8081/api/payment/history/passenger/${loggedInUser.email}`;
      } else if (loggedInUser.role === "DRIVER") {
        url = `http://localhost:8081/api/payment/history/driver/${loggedInUser.email}`;
      }

      const response = await axios.get(url);
      setTransactions(response.data.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusColor = (status) => {
    if (status === "PAID" || status === "SUCCESS") return "#10b981";
    if (status === "PENDING") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <FaReceipt /> Transaction History
          </h1>
          <p style={styles.subtitle}>View all your ride payments and receipts</p>
        </div>

        <button onClick={fetchTransactions} style={styles.refreshButton}>
          <FaSync /> Refresh Transactions
        </button>

        {loading ? (
          <div style={styles.loadingState}>
            <div>Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💰</div>
            <p style={styles.emptyText}>No transactions yet.</p>
            <p style={{ ...styles.emptyText, fontSize: "13px", marginTop: "8px" }}>
              Complete a ride payment to see your transaction history
            </p>
          </div>
        ) : (
          <div style={styles.transactionsGrid}>
            {transactions.map((transaction) => (
              <div key={transaction.id} style={styles.transactionCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.routeInfo}>
                    <div style={styles.route}>
                      <FaMapMarkerAlt style={{ color: "#ef4444", fontSize: "14px" }} />
                      {transaction.ride?.source}
                      <span style={styles.routeArrow}>→</span>
                      <FaMapMarkerAlt style={{ color: "#10b981", fontSize: "14px" }} />
                      {transaction.ride?.destination}
                    </div>
                    <div style={styles.date}>
                      <FaCalendarAlt /> {new Date(transaction.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={styles.statusBadge(transaction.status)}>
                    {transaction.status}
                  </div>
                </div>

                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <FaRupeeSign style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Amount</div>
                      <div style={styles.detailValue}>₹{transaction.amount}</div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaIdCard style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Payment ID</div>
                      <div style={styles.detailValue}>
                        {transaction.razorpayPaymentId?.slice(-8) || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaCar style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>Vehicle</div>
                      <div style={styles.detailValue}>
                        {transaction.ride?.vehicleType || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <FaUser style={styles.detailIcon} />
                    <div>
                      <div style={styles.detailLabel}>
                        {loggedInUser?.role === "PASSENGER" ? "Driver" : "Passenger"}
                      </div>
                      <div style={styles.detailValue}>
                        {loggedInUser?.role === "PASSENGER" 
                          ? transaction.ride?.driverEmail?.split('@')[0] 
                          : transaction.passengerEmail?.split('@')[0] || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  style={styles.receiptButton}
                  onClick={() => setSelectedReceipt(transaction)}
                >
                  <FaEye /> View Full Receipt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div style={styles.modalOverlay} onClick={() => setSelectedReceipt(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FaReceipt /> Payment Receipt
              </h3>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedReceipt(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Ride</span>
                <span style={styles.receiptValue}>
                  {selectedReceipt.ride?.source} → {selectedReceipt.ride?.destination}
                </span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Amount</span>
                <span style={{ ...styles.receiptValue, ...styles.amountHighlight }}>
                  ₹{selectedReceipt.amount}
                </span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Payment ID</span>
                <span style={styles.receiptValue}>{selectedReceipt.razorpayPaymentId}</span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Status</span>
                <span style={{ ...styles.receiptValue, color: getStatusColor(selectedReceipt.status) }}>
                  {selectedReceipt.status}
                </span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Date & Time</span>
                <span style={styles.receiptValue}>
                  {new Date(selectedReceipt.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div style={styles.divider} />
              
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Driver</span>
                <span style={styles.receiptValue}>
                  {selectedReceipt.ride?.driverEmail || "N/A"}
                </span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>Vehicle</span>
                <span style={styles.receiptValue}>
                  {selectedReceipt.ride?.vehicleType || "N/A"}
                </span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptLabel}>License Plate</span>
                <span style={styles.receiptValue}>
                  {selectedReceipt.ride?.licensePlate || "N/A"}
                </span>
              </div>
              
              <div style={styles.divider} />
              
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Thank you for riding with RideShare!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;