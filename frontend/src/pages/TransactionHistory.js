import React, { useEffect, useState } from "react";
import axios from "axios";

function TransactionHistory() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const styles = {
    container: {
  padding: "30px",
  fontFamily: "Arial",
  background: "linear-gradient(135deg,#c7d2fe,#a5b4fc,#c4b5fd)",
  minHeight: "100vh"
},
    section: {
  background: "linear-gradient(135deg,#eef2ff,#ffffff)",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
},
    transactionCard: {
      marginBottom: "15px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "white"
    },
    button: {
  padding: "8px 15px",
  backgroundColor: "#6366F1",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "20px"
},
    receiptButton: {
      padding: "8px 15px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px"
    },

    /* Modal Styles */
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    modalContent: {
      backgroundColor: "#fff3cd",
      padding: "25px",
      borderRadius: "10px",
      width: "400px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
    },
    closeButton: {
      marginTop: "15px",
      padding: "8px 15px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }
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

  return (
    <div style={styles.container}>

      <div style={styles.section}>

        <h2>Transaction History</h2>

        <button onClick={fetchTransactions} style={styles.button}>
          Refresh Transactions
        </button>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (

            <div key={transaction.id} style={styles.transactionCard}>

              <h3>
                {transaction.ride?.source} → {transaction.ride?.destination}
              </h3>

              <p><strong>Amount:</strong> ₹{transaction.amount}</p>

              <p><strong>Payment ID:</strong> {transaction.razorpayPaymentId}</p>

              <p><strong>Status:</strong> {transaction.status}</p>

              <p>
                <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}
              </p>

              <button
                style={styles.receiptButton}
                onClick={() => setSelectedReceipt(transaction)}
              >
                View Receipt
              </button>

            </div>

          ))
        )}

      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>

            <h3>Payment Receipt</h3>

            <p><strong>Ride:</strong> {selectedReceipt.ride?.source} → {selectedReceipt.ride?.destination}</p>

            <p><strong>Amount:</strong> ₹{selectedReceipt.amount}</p>

            <p><strong>Payment ID:</strong> {selectedReceipt.razorpayPaymentId}</p>

            <p><strong>Status:</strong> {selectedReceipt.status}</p>

            <p><strong>Date:</strong> {new Date(selectedReceipt.createdAt).toLocaleString()}</p>

            <p><strong>Driver:</strong> {selectedReceipt.ride?.driverEmail}</p>

            <p><strong>Vehicle:</strong> {selectedReceipt.ride?.vehicleType}</p>

            <p><strong>License Plate:</strong> {selectedReceipt.ride?.licensePlate}</p>

            <button
              style={styles.closeButton}
              onClick={() => setSelectedReceipt(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default TransactionHistory;