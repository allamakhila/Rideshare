import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaUser, FaCar, FaCalendarAlt, FaTimes, FaSync, FaThumbsUp, FaComment, FaUserCircle } from 'react-icons/fa';

function DriverReviews({ driverId, driverName, onClose, initialTab = "received", setReviewTab }) {
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driverId) {
      fetchAllReviews();
    }
  }, [driverId]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError('');

      try {
        const summaryRes = await axios.get(
          `http://localhost:8081/api/reviews/user/${driverId}/summary`
        );
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Summary fetch error:', err);
      }

      try {
        const receivedRes = await axios.get(
          `http://localhost:8081/api/reviews/user/${driverId}/details`
        );
        setReceivedReviews(receivedRes.data);
      } catch (err) {
        console.error('Received reviews fetch error:', err);
      }

      try {
        const givenRes = await axios.get(
          `http://localhost:8081/api/reviews/user/${driverId}/given`
        );
        setGivenReviews(givenRes.data);
      } catch (err) {
        console.error('Given reviews fetch error:', err);
      }

    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStarPercentage = (count) => {
    if (!summary || summary.totalReviews === 0) return 0;
    return (count / summary.totalReviews) * 100;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (setReviewTab) {
      setReviewTab(tab);
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{
              color: star <= rating ? '#f59e0b' : '#e2e8f0',
              fontSize: '14px'
            }}
          />
        ))}
      </div>
    );
  };

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '28px',
      width: '90%',
      maxWidth: '750px',
      maxHeight: '85vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      padding: '24px 28px',
      borderRadius: '28px 28px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    closeButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      transition: 'all 0.3s'
    },
    tabContainer: {
      display: 'flex',
      gap: '12px',
      padding: '20px 28px 0 28px',
      borderBottom: '2px solid #e2e8f0'
    },
    tab: {
      padding: '12px 24px',
      cursor: 'pointer',
      borderRadius: '12px 12px 0 0',
      fontWeight: '600',
      fontSize: '15px',
      border: 'none',
      background: 'none',
      transition: 'all 0.3s'
    },
    activeTab: {
      background: '#3b82f6',
      color: 'white'
    },
    inactiveTab: {
      background: '#f1f5f9',
      color: '#475569'
    },
    contentArea: {
      padding: '24px 28px'
    },
    errorContainer: {
      backgroundColor: '#fee2e2',
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    summarySection: {
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '24px'
    },
    overallRating: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    bigRating: {
      marginBottom: '10px'
    },
    ratingNumber: {
      fontSize: '56px',
      fontWeight: 'bold',
      color: '#f59e0b'
    },
    ratingMax: {
      fontSize: '24px',
      color: '#d97706'
    },
    starsLarge: {
      marginBottom: '10px'
    },
    totalReviews: {
      color: '#92400e',
      fontSize: '14px'
    },
    ratingBreakdown: {
      marginTop: '20px'
    },
    breakdownRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    starLabel: {
      width: '50px',
      fontSize: '14px',
      color: '#92400e'
    },
    progressBarContainer: {
      flex: 1,
      height: '8px',
      backgroundColor: '#fed7aa',
      borderRadius: '4px',
      margin: '0 12px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#f59e0b',
      borderRadius: '4px',
      transition: 'width 0.3s'
    },
    percentageCount: {
      width: '40px',
      fontSize: '14px',
      color: '#92400e',
      textAlign: 'right'
    },
    reviewsList: {
      marginTop: '20px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    reviewCard: {
      background: '#f8fafc',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '12px'
    },
    reviewerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    },
    reviewerName: {
      fontWeight: '600',
      fontSize: '16px',
      color: '#1e293b'
    },
    reviewerRole: {
      fontSize: '11px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontWeight: '500'
    },
    reviewDate: {
      fontSize: '12px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    reviewStars: {
      display: 'flex',
      gap: '2px'
    },
    reviewComment: {
      color: '#475569',
      marginBottom: '12px',
      fontStyle: 'italic',
      lineHeight: '1.6',
      padding: '12px',
      background: '#ffffff',
      borderRadius: '12px',
      borderLeft: '3px solid #3b82f6'
    },
    rideInfo: {
      background: '#ffffff',
      padding: '12px',
      borderRadius: '12px',
      fontSize: '12px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    },
    noReviews: {
      textAlign: 'center',
      padding: '60px',
      background: '#f8fafc',
      borderRadius: '20px',
      color: '#94a3b8'
    },
    retryButton: {
      padding: '8px 20px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      marginTop: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div>Loading reviews...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <FaStar /> {driverName}'s Reviews
          </h2>
          <button onClick={onClose} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p style={{ color: '#dc2626', marginBottom: '10px' }}>{error}</p>
            <button onClick={fetchAllReviews} style={styles.retryButton}>
              <FaSync /> Retry
            </button>
          </div>
        )}

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'received' ? styles.activeTab : styles.inactiveTab)
            }}
            onClick={() => handleTabChange('received')}
          >
            📥 Received ({receivedReviews.length})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'given' ? styles.activeTab : styles.inactiveTab)
            }}
            onClick={() => handleTabChange('given')}
          >
            📤 Given ({givenReviews.length})
          </button>
        </div>

        <div style={styles.contentArea}>
          {/* Summary Section */}
          {activeTab === 'received' && summary && summary.totalReviews > 0 && (
            <div style={styles.summarySection}>
              <div style={styles.overallRating}>
                <div style={styles.bigRating}>
                  <span style={styles.ratingNumber}>
                    {summary.averageRating ? summary.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span style={styles.ratingMax}>/5</span>
                </div>
                <div style={styles.starsLarge}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      style={{
                        fontSize: '28px',
                        color: star <= Math.round(summary.averageRating || 0) ? '#f59e0b' : '#fed7aa',
                        marginRight: '4px'
                      }}
                    />
                  ))}
                </div>
                <div style={styles.totalReviews}>
                  Based on {summary.totalReviews} reviews
                </div>
              </div>

              <div style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} style={styles.breakdownRow}>
                    <span style={styles.starLabel}>{star} ★</span>
                    <div style={styles.progressBarContainer}>
                      <div style={{
                        ...styles.progressBar,
                        width: `${getStarPercentage(
                          star === 5 ? (summary.fiveStarCount || 0) :
                          star === 4 ? (summary.fourStarCount || 0) :
                          star === 3 ? (summary.threeStarCount || 0) :
                          star === 2 ? (summary.twoStarCount || 0) :
                          (summary.oneStarCount || 0)
                        )}%`
                      }} />
                    </div>
                    <span style={styles.percentageCount}>
                      {star === 5 ? (summary.fiveStarCount || 0) :
                       star === 4 ? (summary.fourStarCount || 0) :
                       star === 3 ? (summary.threeStarCount || 0) :
                       star === 2 ? (summary.twoStarCount || 0) :
                       (summary.oneStarCount || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div style={styles.reviewsList}>
            {activeTab === 'received' && (
              <>
                <div style={styles.sectionTitle}>
                  <FaThumbsUp /> Reviews About You
                </div>
                {receivedReviews.length === 0 ? (
                  <div style={styles.noReviews}>
                    <FaStar style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
                    <p>No reviews received yet</p>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>Complete rides to get feedback from passengers</p>
                  </div>
                ) : (
                  receivedReviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewerInfo}>
                          <span style={styles.reviewerName}>
                            {review.reviewerName || 'Anonymous'}
                          </span>
                          <span style={{
                            ...styles.reviewerRole,
                            backgroundColor: review.reviewerRole === 'DRIVER' ? '#dbeafe' : '#d1fae5',
                            color: review.reviewerRole === 'DRIVER' ? '#1e40af' : '#065f46'
                          }}>
                            {review.reviewerRole === 'DRIVER' ? '🚗 Driver' : '👤 Passenger'}
                          </span>
                          <span style={styles.reviewDate}>
                            <FaCalendarAlt style={{ marginRight: '4px' }} />
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div style={styles.reviewStars}>
                          {renderStars(review.stars)}
                        </div>
                      </div>
                      
                      {review.comments && (
                        <div style={styles.reviewComment}>
                          <FaComment style={{ marginRight: '8px', color: '#3b82f6' }} />
                          "{review.comments}"
                        </div>
                      )}
                      
                      <div style={styles.rideInfo}>
                        <FaCar style={{ color: '#3b82f6' }} />
                        <span>
                          Ride: {review.rideSource || 'Unknown'} → {review.rideDestination || 'Unknown'}
                          {review.rideDate && ` on ${formatDate(review.rideDate)}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === 'given' && (
              <>
                <div style={styles.sectionTitle}>
                  <FaComment /> Reviews You've Written
                </div>
                {givenReviews.length === 0 ? (
                  <div style={styles.noReviews}>
                    <FaStar style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }} />
                    <p>You haven't written any reviews yet</p>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>Rate passengers after completing rides</p>
                  </div>
                ) : (
                  givenReviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewerInfo}>
                          <span style={styles.reviewerName}>
                            To: {review.revieweeName || 'Unknown'}
                          </span>
                          <span style={{
                            ...styles.reviewerRole,
                            backgroundColor: review.revieweeRole === 'DRIVER' ? '#dbeafe' : '#d1fae5',
                            color: review.revieweeRole === 'DRIVER' ? '#1e40af' : '#065f46'
                          }}>
                            {review.revieweeRole === 'DRIVER' ? '🚗 Driver' : '👤 Passenger'}
                          </span>
                          <span style={styles.reviewDate}>
                            <FaCalendarAlt style={{ marginRight: '4px' }} />
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div style={styles.reviewStars}>
                          {renderStars(review.stars)}
                        </div>
                      </div>
                      
                      {review.comments && (
                        <div style={styles.reviewComment}>
                          <FaComment style={{ marginRight: '8px', color: '#3b82f6' }} />
                          "{review.comments}"
                        </div>
                      )}
                      
                      <div style={styles.rideInfo}>
                        <FaCar style={{ color: '#3b82f6' }} />
                        <span>
                          Ride: {review.rideSource || 'Unknown'} → {review.rideDestination || 'Unknown'}
                          {review.rideDate && ` on ${formatDate(review.rideDate)}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverReviews;