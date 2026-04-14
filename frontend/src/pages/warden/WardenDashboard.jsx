import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { foodParcelAPI } from '../../services/api';
import { getGreeting, formatDate, formatTime } from '../../utils/timeUtils';
import StatisticsCard from '../../components/common/StatisticsCard';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const WardenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approvedToday: 0, approvedWeek: 0, approvedTotal: 0 });
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [wardenName, setWardenName] = useState('');
  const [approving, setApproving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'warden') {
      navigate('/warden-portal');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    applyFilters();
  }, [requests, filterStatus, searchTerm, selectedDate]);

  const fetchData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        foodParcelAPI.getStats(),
        foodParcelAPI.getAll({ limit: 100 }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (requestsRes.data.success) {
        setRequests(requestsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((req) => req.submissionDate === selectedDate);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.studentName.toLowerCase().includes(search) ||
          req.hostelName.toLowerCase().includes(search) ||
          req.registrationNumber.toLowerCase().includes(search)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = async () => {
    if (!wardenName.trim() || wardenName.trim().length < 2) {
      alert('Please enter your name');
      return;
    }

    setApproving(true);
    try {
      const response = await foodParcelAPI.approve(selectedRequest._id, wardenName.trim());
      if (response.data.success) {
        setShowModal(false);
        setWardenName('');
        fetchData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Approval failed');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
          {getGreeting()}, Warden!
        </h1>
        <p className="text-gray-600">Manage food parcel approval requests</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard title="Pending Requests" value={stats.pending} icon="⏳" gradient="orange" />
        <StatisticsCard title="Approved Today" value={stats.approvedToday} icon="✅" gradient="green" />
        <StatisticsCard title="Approved This Week" value={stats.approvedWeek} icon="📊" gradient="blue" />
        <StatisticsCard title="Total Approved" value={stats.approvedTotal} icon="🎯" gradient="purple" />
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, hostel, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending Only</option>
              <option value="Approved">Approved Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        {searchTerm || selectedDate || filterStatus !== 'All' ? (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing {filteredRequests.length} results</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
                setFilterStatus('All');
              }}
              className="text-sm text-purple-600 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Requests List */}
      <div>
        <h2 className="text-2xl font-bold mb-6 gradient-text">Food Parcel Approval Requests</h2>
        {filteredRequests.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500 text-lg">No requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="glass-card-hover p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{request.studentName}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {request.hostelName}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(request.submittedAt)} - {formatTime(request.submittedAt)}
                      </span>
                      <span className={request.status === 'Pending' ? 'badge-pending' : 'badge-approved'}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowModal(true);
                    }}
                    className="btn-secondary ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Details" size="md">
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Student Name</p>
                <p className="font-semibold text-gray-800">{selectedRequest.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Hostel</p>
                <p className="font-semibold text-gray-800">{selectedRequest.hostelName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                <p className="font-semibold text-gray-800">{selectedRequest.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Number</p>
                <p className="font-semibold text-gray-800">{selectedRequest.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Collector Name</p>
                <p className="font-semibold text-gray-800">{selectedRequest.collectorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={selectedRequest.status === 'Pending' ? 'badge-pending' : 'badge-approved'}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Submitted At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedRequest.submittedAt)} at {formatTime(selectedRequest.submittedAt)}
                </p>
              </div>
            </div>

            {selectedRequest.status === 'Approved' ? (
              <div className="glass-card bg-green-50 p-4">
                <p className="text-green-800 font-semibold mb-2">✅ Already Approved</p>
                <p className="text-sm text-gray-700">
                  Approved by: <strong>{selectedRequest.approvedBy}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Approved at: {formatDate(selectedRequest.approvedAt)} at {formatTime(selectedRequest.approvedAt)}
                </p>
              </div>
            ) : (
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-800 mb-4">Approve Request</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wardenName}
                    onChange={(e) => setWardenName(e.target.value)}
                    placeholder="Enter your name to approve"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handleApprove}
                  disabled={approving || !wardenName.trim()}
                  className="btn-primary w-full"
                >
                  {approving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner w-5 h-5"></div>
                      Approving...
                    </span>
                  ) : (
                    'Approve Request'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WardenDashboard;
