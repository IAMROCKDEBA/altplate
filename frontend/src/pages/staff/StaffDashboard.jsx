import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { plateChoiceAPI, foodParcelAPI } from '../../services/api';
import { getGreeting, formatDate, formatTime } from '../../utils/timeUtils';
import StatisticsCard from '../../components/common/StatisticsCard';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plateChoices');
  
  // Statistics
  const [plateStats, setPlateStats] = useState({ today: 0, week: 0, total: 0 });
  const [parcelStats, setParcelStats] = useState({ approvedToday: 0, approvedWeek: 0, approvedTotal: 0 });

  // Plate Choices
  const [plateChoices, setPlateChoices] = useState([]);
  const [filteredPlateChoices, setFilteredPlateChoices] = useState([]);
  const [plateSearchTerm, setPlateSearchTerm] = useState('');
  const [plateSelectedDate, setPlateSelectedDate] = useState('');
  const [selectedPlateChoice, setSelectedPlateChoice] = useState(null);

  // Food Parcels
  const [foodParcels, setFoodParcels] = useState([]);
  const [filteredFoodParcels, setFilteredFoodParcels] = useState([]);
  const [parcelSearchTerm, setParcelSearchTerm] = useState('');
  const [parcelSelectedDate, setParcelSelectedDate] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Report - NEW: Sub-tab state
  const [activeReportTab, setActiveReportTab] = useState('plateChoice');
  const [plateReportDate, setPlateReportDate] = useState('');
  const [parcelReportDate, setParcelReportDate] = useState('');
  const [generatingPlateReport, setGeneratingPlateReport] = useState(false);
  const [generatingParcelReport, setGeneratingParcelReport] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/staff-portal');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    applyPlateFilters();
  }, [plateChoices, plateSearchTerm, plateSelectedDate]);

  useEffect(() => {
    applyParcelFilters();
  }, [foodParcels, parcelSearchTerm, parcelSelectedDate]);

  const fetchData = async () => {
    try {
      const [plateStatsRes, parcelStatsRes, plateChoicesRes, parcelsRes] = await Promise.all([
        plateChoiceAPI.getStats(),
        foodParcelAPI.getStats(),
        plateChoiceAPI.getAll({ limit: 100 }),
        foodParcelAPI.getAll({ status: 'Approved', limit: 100 }),
      ]);

      if (plateStatsRes.data.success) setPlateStats(plateStatsRes.data.data);
      if (parcelStatsRes.data.success) setParcelStats(parcelStatsRes.data.data);
      if (plateChoicesRes.data.success) setPlateChoices(plateChoicesRes.data.data);
      if (parcelsRes.data.success) setFoodParcels(parcelsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyPlateFilters = () => {
    let filtered = [...plateChoices];

    if (plateSelectedDate) {
      filtered = filtered.filter((item) => item.submissionDate === plateSelectedDate);
    }

    if (plateSearchTerm) {
      const search = plateSearchTerm.toLowerCase();
      filtered = filtered.filter((item) => item.studentName.toLowerCase().includes(search));
    }

    setFilteredPlateChoices(filtered);
  };

  const applyParcelFilters = () => {
    let filtered = [...foodParcels];

    if (parcelSelectedDate) {
      filtered = filtered.filter((item) => item.approvalDate === parcelSelectedDate);
    }

    if (parcelSearchTerm) {
      const search = parcelSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.studentName.toLowerCase().includes(search) ||
          item.hostelName.toLowerCase().includes(search) ||
          item.collectorName.toLowerCase().includes(search)
      );
    }

    setFilteredFoodParcels(filtered);
  };

  // NEW: Generate Plate Choice Report
  const handleGeneratePlateReport = async () => {
    if (!plateReportDate) {
      alert('Please select a date for the plate choice report');
      return;
    }

    setGeneratingPlateReport(true);
    try {
      const response = await plateChoiceAPI.downloadReport(plateReportDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PlateChoice_Report_${plateReportDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = error.response?.status === 404
        ? `No plate choices found for ${plateReportDate}`
        : 'Failed to generate plate choice report. Please try again.';
      alert(errorMessage);
    } finally {
      setGeneratingPlateReport(false);
    }
  };

  // Existing Food Parcel Report Function
  const handleGenerateParcelReport = async () => {
    if (!parcelReportDate) {
      alert('Please select a date for the food parcel report');
      return;
    }

    setGeneratingParcelReport(true);
    try {
      const response = await foodParcelAPI.downloadReport(parcelReportDate);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FoodParcel_Report_${parcelReportDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to generate food parcel report. Please try again.');
    } finally {
      setGeneratingParcelReport(false);
    }
  };

  const getFoodSummary = (selections) => {
    const items = [];
    if (selections.aluChokha?.isSelected) items.push('Alu Chokha');
    if (selections.aluBhaja) items.push('Alu Bhaja');
    if (selections.bread?.isSelected) items.push('Bread');
    if (selections.suji) items.push('Suji');
    if (selections.pureVeg) items.push('Pure Veg');
    if (selections.doiChire?.isSelected) items.push('Doi Chire');
    return items.join(', ') || 'None';
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
          {getGreeting()}, Staff!
        </h1>
        <p className="text-gray-600">Manage plate choices, parcels, and generate reports</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticsCard title="Plate Choices Today" value={plateStats.today} icon="🍽️" gradient="purple" />
        <StatisticsCard title="Parcels Approved Today" value={parcelStats.approvedToday} icon="📦" gradient="green" />
        <StatisticsCard title="Submissions This Week" value={plateStats.week + parcelStats.approvedWeek} icon="📊" gradient="blue" />
        <StatisticsCard title="Total Submissions" value={plateStats.total + parcelStats.approvedTotal} icon="🎯" gradient="orange" />
      </div>

      {/* Main Tabs */}
      <div className="glass-card mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('plateChoices')}
            className={`px-6 py-4 font-semibold transition-all ${
              activeTab === 'plateChoices'
                ? 'border-b-4 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Plate Choices
          </button>
          <button
            onClick={() => setActiveTab('foodParcels')}
            className={`px-6 py-4 font-semibold transition-all ${
              activeTab === 'foodParcels'
                ? 'border-b-4 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Food Parcels
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-4 font-semibold transition-all ${
              activeTab === 'reports'
                ? 'border-b-4 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Generate Reports
          </button>
        </div>
      </div>

      {/* Tab: Plate Choices */}
      {activeTab === 'plateChoices' && (
        <div>
          {/* Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={plateSearchTerm}
                  onChange={(e) => setPlateSearchTerm(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Date</label>
                <input
                  type="date"
                  value={plateSelectedDate}
                  onChange={(e) => setPlateSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            {(plateSearchTerm || plateSelectedDate) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {filteredPlateChoices.length} results</p>
                <button
                  onClick={() => {
                    setPlateSearchTerm('');
                    setPlateSelectedDate('');
                  }}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Plate Choices List */}
          {filteredPlateChoices.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500 text-lg">No plate choices found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPlateChoices.map((choice) => (
                <div key={choice._id} className="glass-card-hover p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{choice.studentName}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(choice.submittedAt)} - {formatTime(choice.submittedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Selections: {getFoodSummary(choice.selections)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPlateChoice(choice);
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
      )}

      {/* Tab: Food Parcels */}
      {activeTab === 'foodParcels' && (
        <div>
          {/* Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, hostel, or collector..."
                  value={parcelSearchTerm}
                  onChange={(e) => setParcelSearchTerm(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Approval Date</label>
                <input
                  type="date"
                  value={parcelSelectedDate}
                  onChange={(e) => setParcelSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            {(parcelSearchTerm || parcelSelectedDate) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing {filteredFoodParcels.length} results</p>
                <button
                  onClick={() => {
                    setParcelSearchTerm('');
                    setParcelSelectedDate('');
                  }}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Food Parcels List */}
          {filteredFoodParcels.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500 text-lg">No approved parcels found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFoodParcels.map((parcel) => (
                <div key={parcel._id} className="glass-card-hover p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{parcel.studentName}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {parcel.hostelName}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          Collector: {parcel.collectorName}
                        </span>
                        <span className="badge-approved">Approved</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Approved: {formatDate(parcel.approvedAt)} at {formatTime(parcel.approvedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedParcel(parcel);
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
      )}

      {/* Tab: Reports - ENHANCED WITH SUB-TABS */}
      {activeTab === 'reports' && (
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold gradient-text mb-6">Generate Excel Reports</h2>
          
          {/* Sub-Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveReportTab('plateChoice')}
              className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
                activeReportTab === 'plateChoice'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Plate Choice Report
            </button>
            <button
              onClick={() => setActiveReportTab('foodParcel')}
              className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
                activeReportTab === 'foodParcel'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Food Parcel Report
            </button>
          </div>

          {/* Sub-Tab Content: Plate Choice Report */}
          {activeReportTab === 'plateChoice' && (
            <div className="animate-fadeIn">
              <p className="text-gray-600 mb-6">
                Generate a detailed Excel report for all plate choices submitted on a specific date.
              </p>

              <div className="max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Report Date
                </label>
                <input
                  type="date"
                  value={plateReportDate}
                  onChange={(e) => setPlateReportDate(e.target.value)}
                  className="input-field mb-4"
                />

                <button
                  onClick={handleGeneratePlateReport}
                  disabled={generatingPlateReport || !plateReportDate}
                  className="btn-primary w-full"
                >
                  {generatingPlateReport ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner w-5 h-5"></div>
                      Generating Report...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Plate Choice Report
                    </span>
                  )}
                </button>
              </div>

              <div className="glass-card bg-blue-50 p-6 mt-6">
                <h3 className="font-bold text-gray-800 mb-3">Report Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Report includes all plate choices for the selected date
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Columns: Student Name, Alu Chokha, Alu Bhaja, Bread, Suji, Pure Veg, Doi Chire, Submission Time
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    File format: Excel (.xlsx)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Sub-Tab Content: Food Parcel Report */}
          {activeReportTab === 'foodParcel' && (
            <div className="animate-fadeIn">
              <p className="text-gray-600 mb-6">
                Generate a detailed Excel report for all approved food parcels on a specific date.
              </p>

              <div className="max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Report Date
                </label>
                <input
                  type="date"
                  value={parcelReportDate}
                  onChange={(e) => setParcelReportDate(e.target.value)}
                  className="input-field mb-4"
                />

                <button
                  onClick={handleGenerateParcelReport}
                  disabled={generatingParcelReport || !parcelReportDate}
                  className="btn-primary w-full"
                >
                  {generatingParcelReport ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner w-5 h-5"></div>
                      Generating Report...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Food Parcel Report
                    </span>
                  )}
                </button>
              </div>

              <div className="glass-card bg-blue-50 p-6 mt-6">
                <h3 className="font-bold text-gray-800 mb-3">Report Information</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Report includes all approved parcels for the selected date
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    File format: Excel (.xlsx)
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Includes student details, hostel info, and approval data
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plate Choice Detail Modal - (Keep existing code) */}
      {selectedPlateChoice && (
        <Modal isOpen={showModal && !!selectedPlateChoice} onClose={() => { setShowModal(false); setSelectedPlateChoice(null); }} title="Plate Choice Details" size="md">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Student Name</p>
                <p className="font-semibold text-gray-800">{selectedPlateChoice.studentName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Submitted At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedPlateChoice.submittedAt)} at {formatTime(selectedPlateChoice.submittedAt)}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-800 mb-4">Food Selections</h3>
              <div className="space-y-3">
                {selectedPlateChoice.selections.aluChokha?.isSelected && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800 mb-1">✅ Alu Chokha</p>
                    <p className="text-sm text-gray-600">
                      Meal Times: {selectedPlateChoice.selections.aluChokha.mealTimes.join(', ')}
                    </p>
                  </div>
                )}

                {selectedPlateChoice.selections.aluBhaja && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800">✅ Alu Bhaja</p>
                  </div>
                )}

                {selectedPlateChoice.selections.bread?.isSelected && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800 mb-1">✅ Bread</p>
                    <p className="text-sm text-gray-600">
                      Meal Times: {selectedPlateChoice.selections.bread.mealTimes.join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Bread Types: {selectedPlateChoice.selections.bread.breadTypes.join(', ')}
                    </p>
                  </div>
                )}

                {selectedPlateChoice.selections.suji && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800">✅ Suji</p>
                  </div>
                )}

                {selectedPlateChoice.selections.pureVeg && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800">✅ Pure Veg</p>
                  </div>
                )}

                {selectedPlateChoice.selections.doiChire?.isSelected && (
                  <div className="glass-card p-4 bg-green-50">
                    <p className="font-semibold text-gray-800 mb-1">✅ Doi Chire</p>
                    <p className="text-sm text-gray-600">
                      Meal Times: {selectedPlateChoice.selections.doiChire.mealTimes.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Food Parcel Detail Modal - (Keep existing code) */}
      {selectedParcel && (
        <Modal isOpen={showModal && !!selectedParcel} onClose={() => { setShowModal(false); setSelectedParcel(null); }} title="Food Parcel Details" size="md">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Student Name</p>
                <p className="font-semibold text-gray-800">{selectedParcel.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Hostel</p>
                <p className="font-semibold text-gray-800">{selectedParcel.hostelName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                <p className="font-semibold text-gray-800">{selectedParcel.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Number</p>
                <p className="font-semibold text-gray-800">{selectedParcel.roomNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Collector Name</p>
                <p className="font-semibold text-gray-800">{selectedParcel.collectorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="badge-approved">{selectedParcel.status}</span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Submitted At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedParcel.submittedAt)} at {formatTime(selectedParcel.submittedAt)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Approved By</p>
                <p className="font-semibold text-gray-800">{selectedParcel.approvedBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Approved At</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(selectedParcel.approvedAt)} at {formatTime(selectedParcel.approvedAt)}
                </p>
              </div>
            </div>

            <div className="glass-card bg-green-50 p-4">
              <p className="text-green-800 font-semibold">✅ Approval for the food parcel is confirmed. Kindly proceed with delivery.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffDashboard;
