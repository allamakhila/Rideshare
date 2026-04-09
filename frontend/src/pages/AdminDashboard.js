import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Dynamic states from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEarnings: 0,
    totalBookings: 0,
    cancelledRides: 0,
    totalRides: 0
  });
  
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Add these with your other useState declarations
const [reportData, setReportData] = useState(null);
const [reportType, setReportType] = useState('daily');
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [reportFormat, setReportFormat] = useState('JSON');
const [generating, setGenerating] = useState(false);

// Settings state
const [settings, setSettings] = useState({
  baseFare: 50,
  perKmRate: 10,
  commission: 10,
  maxSeats: 4,
  emailNotifications: true,
  smsAlerts: false,
  pushNotifications: true
});

const [chartData, setChartData] = useState([]);
  
  // Calculate additional stats
  const [calculatedStats, setCalculatedStats] = useState({
    totalDrivers: 0,
    totalPassengers: 0,
    totalAdmins: 0,
    activeRides: 0,
    completedRides: 0,
    pendingRides: 0,
    totalReviews: 0,
    averageRating: 0
  });

  // Filter states
  const [userFilters, setUserFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  
  const [rideFilters, setRideFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  
  const [bookingFilters, setBookingFilters] = useState({
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Check if admin is logged in
  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all dashboard data
  useEffect(() => {
    fetchAllDashboardData();
     fetchChartData(); // ✅ ADD THIS LINE
  }, []);

  // ✅ DEBUG: Check paid bookings
useEffect(() => {
  if (bookings.length > 0) {
    const paidBookings = bookings.filter(b => b.status === 'PAID');
    console.log('Total Bookings:', bookings.length);
    console.log('Paid Bookings:', paidBookings.length);
    console.log('Paid Bookings Data:', paidBookings);
    paidBookings.forEach(b => {
      console.log(`Booking ${b.id}: amount = ${b.totalAmount}, status = ${b.status}`);
    });
  }
}, [bookings]);

  const fetchAllDashboardData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Fetch all data in parallel
    const [statsRes, usersRes, ridesRes, bookingsRes] = await Promise.all([
      axios.get('http://localhost:8081/api/admin/stats', config).catch(err => ({ data: {} })),
      axios.get('http://localhost:8081/api/admin/users', config).catch(err => ({ data: [] })),
      axios.get('http://localhost:8081/api/admin/rides', config).catch(err => ({ data: [] })),
      axios.get('http://localhost:8081/api/admin/bookings', config).catch(err => ({ data: [] }))
    ]);
    
    const bookingsData = bookingsRes.data || [];
    
    // ✅ FIX: Calculate earnings from paid bookings
    const calculatedEarnings = bookingsData
      .filter(booking => booking.status === 'PAID')
      .reduce((sum, booking) => {
        // Use totalAmount if available
        if (booking.totalAmount) {
          return sum + booking.totalAmount;
        }
        // Otherwise calculate from ride price
        else if (booking.ride && booking.ride.price) {
          return sum + (booking.ride.price * booking.seatsBooked);
        }
        return sum;
      }, 0);
    
    // Merge API stats with calculated earnings
    setStats({
      ...statsRes.data,
      totalEarnings: calculatedEarnings || statsRes.data.totalEarnings || 0
    });
    
    setUsers(usersRes.data);
    setRides(ridesRes.data);
    setBookings(bookingsData);
    
    // Calculate additional stats
    calculateAdditionalStats(usersRes.data, ridesRes.data, bookingsData);
    
  } catch (error) {
    console.error('Error fetching admin data:', error);
  } finally {
    setLoading(false);
  }
};

  const calculateAdditionalStats = (usersData, ridesData, bookingsData) => {
    const drivers = usersData.filter(u => u.role === 'DRIVER').length;
    const passengers = usersData.filter(u => u.role === 'PASSENGER').length;
    const admins = usersData.filter(u => u.role === 'ADMIN').length;
    
    const activeRides = ridesData.filter(r => r.rideStatus === 'ACTIVE' || r.rideStatus === 'POSTED').length;
    const completedRides = ridesData.filter(r => r.rideStatus === 'COMPLETED').length;
    const pendingRides = ridesData.filter(r => !r.rideStatus || r.rideStatus === 'PENDING').length;
    
    // Calculate average rating from users
    const usersWithRating = usersData.filter(u => u.averageRating !== null && u.averageRating > 0);
    const avgRating = usersWithRating.length > 0 
      ? usersWithRating.reduce((sum, u) => sum + u.averageRating, 0) / usersWithRating.length 
      : 0;
    
    setCalculatedStats({
      totalDrivers: drivers,
      totalPassengers: passengers,
      totalAdmins: admins,
      activeRides,
      completedRides,
      pendingRides,
      totalReviews: usersWithRating.length,
      averageRating: avgRating
    });
  };

  // ✅ ADD THIS NEW FUNCTION
const fetchChartData = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get('http://localhost:8081/api/admin/chart-data', config);
    setChartData(response.data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    // Fallback to sample data
    setChartData([
      { name: 'Mon', rides: 10 },
      { name: 'Tue', rides: 15 },
      { name: 'Wed', rides: 8 },
      { name: 'Thu', rides: 12 },
      { name: 'Fri', rides: 20 },
      { name: 'Sat', rides: 18 },
      { name: 'Sun', rides: 5 },
    ]);
  }
};

  // Filter functions
  const fetchFilteredUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get('http://localhost:8081/api/admin/users', {
        params: userFilters,
        ...config
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  };

  const fetchFilteredRides = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get('http://localhost:8081/api/admin/rides', {
        params: rideFilters,
        ...config
      });
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching filtered rides:', error);
    }
  };

  const fetchFilteredBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.get('http://localhost:8081/api/admin/bookings', {
        params: bookingFilters,
        ...config
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching filtered bookings:', error);
    }
  };

  // User management actions
  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:8081/api/admin/users/${userId}/verify`, {}, config);
      alert('User verified successfully');
      fetchAllDashboardData();
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:8081/api/admin/users/${userId}/block`, {}, config);
      alert('User blocked successfully');
      fetchAllDashboardData();
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:8081/api/admin/users/${userId}/unblock`, {}, config);
      alert('User unblocked successfully');
      fetchAllDashboardData();
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f1f5f9',
      fontFamily: 'Segoe UI, sans-serif'
    },
    sidebar: {
      width: '280px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      padding: '20px 0',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    },
    logo: {
      padding: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
      borderBottom: '1px solid #334155',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#60a5fa'
    },
    menuItem: {
      padding: '12px 20px',
      margin: '4px 10px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    activeMenuItem: {
      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
      boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
    },
    mainContent: {
      flex: 1,
      padding: '30px',
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#0f172a'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statIcon: {
      fontSize: '40px',
      background: '#e0f2fe',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    table: {
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      padding: '12px 0',
      borderBottom: '2px solid #e2e8f0',
      fontWeight: '600',
      color: '#475569'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0',
      alignItems: 'center'
    },
    badge: (status) => ({
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      width: 'fit-content',
      background: 
        status === 'VERIFIED' || status === 'ACTIVE' || status === 'PAID' || status === 'RESOLVED' || status === 'COMPLETED' ? '#dcfce7' :
        status === 'PENDING' ? '#fed7aa' :
        status === 'CANCELLED' || status === 'BLOCKED' ? '#fee2e2' : '#e2e8f0',
      color: 
        status === 'VERIFIED' || status === 'ACTIVE' || status === 'PAID' || status === 'RESOLVED' || status === 'COMPLETED' ? '#166534' :
        status === 'PENDING' ? '#9a3412' :
        status === 'CANCELLED' || status === 'BLOCKED' ? '#991b1b' : '#475569'
    }),
    button: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '12px',
      fontWeight: '500'
    },
    searchBar: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #cbd5e1',
      width: '300px',
      marginRight: '10px'
    },
    filterBar: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#64748b'
    }
  };

  const menuItems = [
    { id: 'overview', label: '📊 Dashboard Overview', icon: '📊' },
    { id: 'users', label: '👥 User Management', icon: '👥' },
    { id: 'rides', label: '🚗 Ride Monitoring', icon: '🚗' },
    { id: 'bookings', label: '💰 Booking Transactions', icon: '💰' },
    { id: 'reports', label: '📈 Reports & Analytics', icon: '📈' },
    { id: 'disputes', label: '⚠️ Disputes & Support', icon: '⚠️' },
    { id: 'settings', label: '⚙️ System Settings', icon: '⚙️' },
  ];

  const renderOverview = () => (
  <>
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Rides</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalRides || 0}</div>
          <div style={{ color: '#10b981', fontSize: '12px' }}>Active: {calculatedStats.activeRides}</div>
        </div>
        <div style={styles.statIcon}>🚗</div>
      </div>
      <div style={styles.statCard}>
        <div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Users</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers || 0}</div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>
            Drivers: {calculatedStats.totalDrivers} | Passengers: {calculatedStats.totalPassengers}
          </div>
        </div>
        <div style={styles.statIcon}>👥</div>
      </div>
      <div style={styles.statCard}>
        <div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Bookings</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings || 0}</div>
          <div style={{ color: '#ef4444', fontSize: '12px' }}>Cancelled: {stats.cancelledRides || 0}</div>
        </div>
        <div style={styles.statIcon}>📅</div>
      </div>
      <div style={styles.statCard}>
        <div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Earnings</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{stats.totalEarnings?.toLocaleString() || 0}</div>
          <div style={{ color: '#64748b', fontSize: '12px' }}>Avg Rating: {calculatedStats.averageRating.toFixed(1)} ★</div>
        </div>
        <div style={styles.statIcon}>💰</div>
      </div>
    </div>

    {/* ✅ ADD THIS CHART SECTION */}
    <div style={{ ...styles.table, marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>📊 Rides Overview (Last 7 Days)</h3>
      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
        <LineChart
          width={600}
          height={250}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rides" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </div>
    </div>

    <div style={{ ...styles.table, marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px' }}>📈 Recent Bookings</h3>
      {bookings.slice(0, 5).length > 0 ? (
        <div>
          {bookings.slice(0, 5).map((booking, index) => (
            <div key={index} style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Booking #{booking.id}</strong> - {booking.passengerName || 'Unknown'}</span>
              <span style={{ color: '#3b82f6' }}>Status: {booking.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ height: '200px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          No recent bookings
        </div>
      )}
    </div>
  </>
);

  const renderUsers = () => (
    <div style={styles.table}>
      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search users..." 
          style={styles.searchBar}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setUserFilters({...userFilters, search: e.target.value});
          }}
        />
        <select 
          style={{ ...styles.searchBar, width: '150px' }}
          value={userFilters.role}
          onChange={(e) => {
            setUserFilters({...userFilters, role: e.target.value});
            fetchFilteredUsers();
          }}
        >
          <option value="">All Roles</option>
          <option value="DRIVER">Drivers</option>
          <option value="PASSENGER">Passengers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div style={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Email</div>
        <div>Role</div>
        <div>Phone</div>
        <div>Rating</div>
        <div>Actions</div>
      </div>

      {users.length > 0 ? (
        users.map(user => (
          <div key={user.id} style={styles.tableRow}>
            <div>{user.id}</div>
            <div>{user.name || 'N/A'}</div>
            <div>{user.email}</div>
            <div><span style={styles.badge(user.role)}>{user.role}</span></div>
            <div>{user.phone || 'N/A'}</div>
            <div>{user.averageRating ? user.averageRating.toFixed(1) + ' ★' : 'N/A'}</div>
            <div>
              {user.role === 'DRIVER' && (
                <button 
                  style={{...styles.button, background: '#3b82f6', color: 'white', marginRight: '5px'}}
                  onClick={() => handleVerifyUser(user.id)}
                >
                  Verify
                </button>
              )}
              {!user.blocked ? (
                <button 
                  style={{...styles.button, background: '#ef4444', color: 'white'}}
                  onClick={() => handleBlockUser(user.id)}
                >
                  Block
                </button>
              ) : (
                <button 
                  style={{...styles.button, background: '#10b981', color: 'white'}}
                  onClick={() => handleUnblockUser(user.id)}
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No users found</div>
      )}
    </div>
  );

  const renderRides = () => (
    <div style={styles.table}>
      <div style={styles.filterBar}>
        <select 
          style={{ ...styles.searchBar, width: '200px' }}
          value={rideFilters.status}
          onChange={(e) => {
            setRideFilters({...rideFilters, status: e.target.value});
            fetchFilteredRides();
          }}
        >
          <option value="">All Status</option>
          <option value="POSTED">Posted</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div style={styles.tableHeader}>
        <div>ID</div>
        <div>Route</div>
        <div>Driver</div>
        <div>Date</div>
        <div>Price</div>
        <div>Seats</div>
        <div>Status</div>
      </div>

      {rides.length > 0 ? (
        rides.map(ride => (
          <div key={ride.id} style={styles.tableRow}>
            <div>{ride.id}</div>
            <div>{ride.source} → {ride.destination}</div>
            <div>{ride.driverEmail}</div>
            <div>{ride.date}</div>
            <div>₹{ride.price}</div>
            <div>{ride.availableSeats}</div>
            <div><span style={styles.badge(ride.rideStatus || 'PENDING')}>{ride.rideStatus || 'PENDING'}</span></div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No rides found</div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div style={styles.table}>
      <div style={styles.filterBar}>
        <select 
          style={{ ...styles.searchBar, width: '200px' }}
          value={bookingFilters.paymentStatus}
          onChange={(e) => {
            setBookingFilters({...bookingFilters, paymentStatus: e.target.value});
            fetchFilteredBookings();
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PAID">Paid</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div style={styles.tableHeader}>
        <div>ID</div>
        <div>Passenger</div>
        <div>Ride ID</div>
        <div>Seats</div>
        <div>Status</div>
        <div>Driver Reviewed</div>
        <div>Passenger Reviewed</div>
      </div>

      {bookings.length > 0 ? (
        bookings.map(booking => (
          <div key={booking.id} style={styles.tableRow}>
            <div>{booking.id}</div>
            <div>{booking.passengerName || booking.passengerEmail}</div>
            <div>{booking.ride?.id || 'N/A'}</div>
            <div>{booking.seatsBooked}</div>
            <div><span style={styles.badge(booking.status)}>{booking.status}</span></div>
            <div>{booking.driverReviewed ? '✅' : '❌'}</div>
            <div>{booking.passengerReviewed ? '✅' : '❌'}</div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No bookings found</div>
      )}
    </div>
  );

  const renderReports = () => {
  const generateReport = async () => {
    setGenerating(true);
    try {
      // Use existing data instead of API call
      const data = {
        rides: rides,
        bookings: bookings,
        users: users
      };
      
      setReportData(data);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    const filename = `report-${reportType}-${new Date().toISOString().split('T')[0]}`;
    
    if (reportFormat === 'CSV') {
      const csv = convertToCSV(reportData);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else if (reportFormat === 'PDF') {
      alert('PDF download requires jsPDF library');
    } else {
      const jsonStr = JSON.stringify(reportData, null, 2);
      downloadFile(jsonStr, `${filename}.json`, 'application/json');
    }
  };

  const convertToCSV = (data) => {
    if (!data.rides || data.rides.length === 0) return 'No data';
    
    const headers = ['ID', 'Source', 'Destination', 'Driver', 'Status', 'Price', 'Date'];
    const rows = data.rides.map(ride => 
      [ride.id, ride.source, ride.destination, ride.driverEmail, ride.rideStatus, ride.price, ride.date]
    );
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.table}>
      <h3 style={{ marginBottom: '20px' }}>Generate Reports</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>Report Type</label>
          <select 
            style={{ ...styles.searchBar, width: '100%' }}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>Format</label>
          <select 
            style={{ ...styles.searchBar, width: '100%' }}
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
          >
            <option value="JSON">JSON</option>
            <option value="CSV">CSV</option>
            <option value="PDF">PDF</option>
          </select>
        </div>
      </div>

      {reportType === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px' }}>Start Date</label>
            <input 
              type="date" 
              style={{ ...styles.searchBar, width: '100%' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '10px' }}>End Date</label>
            <input 
              type="date" 
              style={{ ...styles.searchBar, width: '100%' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          style={{...styles.button, background: '#3b82f6', color: 'white', padding: '10px 20px'}}
          onClick={generateReport}
          disabled={generating}
        >
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
        
        {reportData && (
          <button 
            style={{...styles.button, background: '#10b981', color: 'white', padding: '10px 20px'}}
            onClick={downloadReport}
          >
            Download as {reportFormat}
          </button>
        )}
      </div>

      {reportData && (
        <div style={{ marginTop: '30px' }}>
          <h4>Report Summary</h4>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div>Total Rides</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{reportData.rides?.length || 0}</div>
            </div>
            <div style={styles.statCard}>
              <div>Total Bookings</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{reportData.bookings?.length || 0}</div>
            </div>
            <div style={styles.statCard}>
              <div>Total Users</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{reportData.users?.length || 0}</div>
            </div>
            <div style={styles.statCard}>
              <div>Total Earnings</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                ₹{stats.totalEarnings?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  const renderDisputes = () => (
  <div style={styles.table}>
    <h3 style={{ marginBottom: '20px' }}>Disputes & Support</h3>
    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
      <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>⚠️</span>
      <h4 style={{ marginBottom: '10px', color: '#475569' }}>No Disputes Found</h4>
      <p style={{ color: '#94a3b8' }}>All disputes are currently resolved. Check back later.</p>
    </div>
  </div>
);

  const renderSettings = () => {
  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // You can add your API endpoint here
      // await axios.post('http://localhost:8081/api/admin/settings', settings, config);
      alert('Settings saved (demo mode)');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div style={styles.table}>
      <h3 style={{ marginBottom: '20px' }}>System Configuration</h3>
      
      <div style={{ marginBottom: '30px' }}>
        <h4>Fare Settings</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Base Fare (₹)</label>
            <input 
              type="number" 
              style={styles.searchBar} 
              value={settings.baseFare}
              onChange={(e) => setSettings({...settings, baseFare: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Per Km Rate (₹)</label>
            <input 
              type="number" 
              style={styles.searchBar} 
              value={settings.perKmRate}
              onChange={(e) => setSettings({...settings, perKmRate: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Commission (%)</label>
            <input 
              type="number" 
              style={styles.searchBar} 
              value={settings.commission}
              onChange={(e) => setSettings({...settings, commission: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Max Seats per Ride</label>
            <input 
              type="number" 
              style={styles.searchBar} 
              value={settings.maxSeats}
              onChange={(e) => setSettings({...settings, maxSeats: parseInt(e.target.value)})}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h4>Notification Settings</h4>
        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
            /> Email Notifications
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={settings.smsAlerts}
              onChange={(e) => setSettings({...settings, smsAlerts: e.target.checked})}
            /> SMS Alerts
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
            /> Push Notifications
          </label>
        </div>
      </div>

      <button 
        style={{...styles.button, background: '#3b82f6', color: 'white', padding: '10px 30px'}}
        onClick={saveSettings}
      >
        Save Changes
      </button>
    </div>
  );
};

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          🚗 Admin<span style={{color: '#f59e0b'}}>Panel</span>
        </div>
        
        {menuItems.map(item => (
          <div
            key={item.id}
            style={{
              ...styles.menuItem,
              ...(activeTab === item.id ? styles.activeMenuItem : {})
            }}
            onClick={() => setActiveTab(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        
        <div 
          style={{...styles.menuItem, marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '20px'}}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div style={{display: 'flex', gap: '10px'}}>
            <span style={{padding: '8px 16px', background: 'white', borderRadius: '8px'}}>
              🕒 {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'rides' && renderRides()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'disputes' && renderDisputes()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}

export default AdminDashboard;