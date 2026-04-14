import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plateChoiceAPI } from '../services/api';
import { isWithinTimeWindow } from '../utils/timeUtils';
import TimeRestrictionBanner from '../components/common/TimeRestrictionBanner';
import MultiStepForm from '../components/forms/MultiStepForm';
import FormStep from '../components/forms/FormStep';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PlateChoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    selections: {
      aluChokha: { isSelected: false, mealTimes: [] },
      aluBhaja: false,
      bread: { isSelected: false, mealTimes: [], breadTypes: [] },
      suji: false,
      pureVeg: false,
      doiChire: { isSelected: false, mealTimes: [] },
    },
  });

  const steps = [
    { title: 'Personal Information' },
    { title: 'Alu Chokha' },
    { title: 'Alu Bhaja' },
    { title: 'Bread' },
    { title: 'Suji' },
    { title: 'Pure Veg' },
    { title: 'Doi Chire' },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSelectionChange = (category, field, value) => {
    setFormData({
      ...formData,
      selections: {
        ...formData.selections,
        [category]: typeof formData.selections[category] === 'object'
          ? { ...formData.selections[category], [field]: value }
          : value,
      },
    });
  };

  const toggleArrayItem = (category, field, item) => {
    const currentArray = formData.selections[category][field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    handleSelectionChange(category, field, newArray);
  };

  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
        setError('Student name must be at least 2 characters long');
        return false;
      }
      if (formData.studentName.trim().length > 100) {
        setError('Student name must be less than 100 characters');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isWithinTimeWindow()) {
      setError('Submissions are only allowed between 8:00 PM and 10:30 PM IST');
      return;
    }

    const hasSelection = Object.values(formData.selections).some((sel) => {
      if (typeof sel === 'boolean') return sel;
      return sel.isSelected;
    });

    if (!hasSelection) {
      setError('Please select at least one food option');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await plateChoiceAPI.submit(formData);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 max-w-md w-full text-center animate-slideUp">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Success!</h2>
          <p className="text-gray-600 mb-6">Your plate choice has been submitted successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Choose Your Plate</h1>
        <p className="text-gray-600">Select your meal preferences for the day</p>
      </div>

      <TimeRestrictionBanner />

      <div className="glass-card p-8">
        <MultiStepForm steps={steps}>
          {({ currentStep, goToNext, goToPrevious, isLastStep }) => (
            <>
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <FormStep title="Enter Your Name" subtitle="Please provide your full name">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="input-field"
                    maxLength={100}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.studentName.length}/100 characters
                  </p>
                </FormStep>
              )}

              {/* Step 2: Alu Chokha */}
              {currentStep === 1 && (
                <FormStep title="Alu Chokha" subtitle="Available every day except Sunday">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selections.aluChokha.isSelected}
                        onChange={(e) => handleSelectionChange('aluChokha', 'isSelected', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="font-semibold text-gray-800">I want Alu Chokha</span>
                    </label>

                    {formData.selections.aluChokha.isSelected && (
                      <div className="ml-8 space-y-3 animate-slideUp">
                        <p className="font-medium text-gray-700 mb-2">Select meal times:</p>
                        <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selections.aluChokha.mealTimes.includes('Lunch')}
                            onChange={() => toggleArrayItem('aluChokha', 'mealTimes', 'Lunch')}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span>Lunch</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selections.aluChokha.mealTimes.includes('Dinner')}
                            onChange={() => toggleArrayItem('aluChokha', 'mealTimes', 'Dinner')}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span>Dinner</span>
                        </label>
                      </div>
                    )}
                  </div>
                </FormStep>
              )}

              {/* Step 3: Alu Bhaja */}
              {currentStep === 2 && (
                <FormStep title="Alu Bhaja" subtitle="Available only on Saturday nights">
                  <div className="glass-card p-6 border-2 border-yellow-300">
                    <div className="flex items-start gap-3 mb-4">
                      <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-yellow-800">Alu Bhaja is not available except on Saturday nights</p>
                    </div>
                    <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selections.aluBhaja}
                        onChange={(e) => handleSelectionChange('aluBhaja', null, e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="font-semibold text-gray-800">I want Alu Bhaja</span>
                    </label>
                  </div>
                </FormStep>
              )}

              {/* Step 4: Bread */}
              {currentStep === 3 && (
                <FormStep title="Bread" subtitle="Select bread type and meal time">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selections.bread.isSelected}
                        onChange={(e) => handleSelectionChange('bread', 'isSelected', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="font-semibold text-gray-800">I want Bread</span>
                    </label>

                    {formData.selections.bread.isSelected && (
                      <div className="ml-8 space-y-4 animate-slideUp">
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Select meal times:</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selections.bread.mealTimes.includes('Breakfast')}
                                onChange={() => toggleArrayItem('bread', 'mealTimes', 'Breakfast')}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span>Breakfast</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selections.bread.mealTimes.includes('Snacks')}
                                onChange={() => toggleArrayItem('bread', 'mealTimes', 'Snacks')}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span>Snacks</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700 mb-2">Select bread type:</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selections.bread.breadTypes.includes('BB')}
                                onChange={() => toggleArrayItem('bread', 'breadTypes', 'BB')}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span>BB / Brown Bread</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selections.bread.breadTypes.includes('WB')}
                                onChange={() => toggleArrayItem('bread', 'breadTypes', 'WB')}
                                className="w-4 h-4 text-purple-600 rounded"
                              />
                              <span>WB / White Bread</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </FormStep>
              )}

              {/* Step 5: Suji */}
              {currentStep === 4 && (
                <FormStep title="Suji" subtitle="Contact desk staff for availability">
                  <div className="glass-card p-6 border-2 border-blue-300 mb-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-800">Contact desk staff before submitting to find out which days Suji is served</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.selections.suji}
                      onChange={(e) => handleSelectionChange('suji', null, e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="font-semibold text-gray-800">I want Suji</span>
                  </label>
                </FormStep>
              )}

              {/* Step 6: Pure Veg */}
              {currentStep === 5 && (
                <FormStep title="Pure Veg" subtitle="Available every day except Sunday">
                  <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.selections.pureVeg}
                      onChange={(e) => handleSelectionChange('pureVeg', null, e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="font-semibold text-gray-800">I want Pure Veg</span>
                  </label>
                </FormStep>
              )}

              {/* Step 7: Doi Chire */}
              {currentStep === 6 && (
                <FormStep title="Doi Chire" subtitle="Select meal time">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 glass-card cursor-pointer hover:bg-purple-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selections.doiChire.isSelected}
                        onChange={(e) => handleSelectionChange('doiChire', 'isSelected', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="font-semibold text-gray-800">I want Doi Chire</span>
                    </label>

                    {formData.selections.doiChire.isSelected && (
                      <div className="ml-8 space-y-3 animate-slideUp">
                        <p className="font-medium text-gray-700 mb-2">Select meal times:</p>
                        <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selections.doiChire.mealTimes.includes('Breakfast')}
                            onChange={() => toggleArrayItem('doiChire', 'mealTimes', 'Breakfast')}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span>Breakfast</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 glass-card cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selections.doiChire.mealTimes.includes('Snacks')}
                            onChange={() => toggleArrayItem('doiChire', 'mealTimes', 'Snacks')}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span>Snacks</span>
                        </label>
                      </div>
                    )}
                  </div>
                </FormStep>
              )}

              {/* Error Message */}
              {error && (
                <div className="glass-card border-2 border-red-300 p-4 mb-4 animate-slideUp">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={goToPrevious}
                    className="btn-secondary flex-1"
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}
                {!isLastStep ? (
                  <button
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        goToNext();
                      }
                    }}
                    className="btn-primary flex-1"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn-primary flex-1"
                    disabled={loading || !isWithinTimeWindow()}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="spinner w-5 h-5"></div>
                        Submitting...
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </MultiStepForm>
      </div>
    </div>
  );
};

export default PlateChoice;
