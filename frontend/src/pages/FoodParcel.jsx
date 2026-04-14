import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodParcelAPI } from '../services/api';

const FoodParcel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    hostelName: '',
    registrationNumber: '',
    roomNumber: '',
    collectorName: '',
  });

  const [errors, setErrors] = useState({});

  const hostels = ['BH-1', 'BH-2', 'GH-1', 'GH-2', 'GH-3'];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Student name must be at least 2 characters';
    }

    if (!formData.hostelName) {
      newErrors.hostelName = 'Please select a hostel';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.collectorName.trim() || formData.collectorName.trim().length < 2) {
      newErrors.collectorName = 'Collector name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await foodParcelAPI.submit(formData);
      if (response.data.success) {
        setRequestId(response.data.data._id);
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setSuccess(false);
    setRequestId('');
    setFormData({
      studentName: '',
      hostelName: '',
      registrationNumber: '',
      roomNumber: '',
      collectorName: '',
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 max-w-lg w-full text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Request Submitted!</h2>
          <p className="text-gray-700 mb-2">Your food parcel request has been sent to the warden for approval.</p>
          <p className="text-sm text-gray-600 mb-6">Request ID: {requestId.slice(-8)}</p>
          
          <div className="glass-card bg-blue-50 p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong>What's next?</strong>
              <br />
              The warden will review your request. Once approved, it will be visible in the Staff Portal for processing.
              Expected approval time varies.
            </p>
          </div>

          <div className="flex gap-4">
            <button onClick={handleNewRequest} className="btn-secondary flex-1">
              Submit Another
            </button>
            <button onClick={() => navigate('/')} className="btn-primary flex-1">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Request Food Parcel</h1>
        <p className="text-gray-600">Fill in the details below to request a food parcel delivery</p>
      </div>

      <div className="glass-card p-8 border-2 border-gradient-to-r from-purple-400 to-pink-400">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student's Name (For whom the parcel is being taken)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              className={`input-field ${errors.studentName ? 'border-red-500' : ''}`}
              placeholder="Enter student's full name"
              maxLength={100}
            />
            {errors.studentName && (
              <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
            )}
          </div>

          {/* Hostel Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Hostel
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.hostelName}
              onChange={(e) => handleChange('hostelName', e.target.value)}
              className={`input-field ${errors.hostelName ? 'border-red-500' : ''}`}
            >
              <option value="">Choose hostel...</option>
              {hostels.map((hostel) => (
                <option key={hostel} value={hostel}>
                  {hostel}
                </option>
              ))}
            </select>
            {errors.hostelName && (
              <p className="text-red-500 text-sm mt-1">{errors.hostelName}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student Registration Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              className={`input-field ${errors.registrationNumber ? 'border-red-500' : ''}`}
              placeholder="Example: AU/2023/0009810"
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
            )}
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => handleChange('roomNumber', e.target.value)}
              className={`input-field ${errors.roomNumber ? 'border-red-500' : ''}`}
              placeholder="Enter room number"
            />
            {errors.roomNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
            )}
          </div>

          {/* Collector Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name (Person who will collect the parcel)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.collectorName}
              onChange={(e) => handleChange('collectorName', e.target.value)}
              className={`input-field ${errors.collectorName ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
              maxLength={100}
            />
            {errors.collectorName && (
              <p className="text-red-500 text-sm mt-1">{errors.collectorName}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="glass-card border-2 border-red-300 p-4 animate-slideUp">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner w-5 h-5"></div>
                Submitting Request...
              </span>
            ) : (
              'Request for Approval'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodParcel;
