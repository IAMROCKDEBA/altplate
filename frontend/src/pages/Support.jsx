import { useState } from 'react';

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: 'What time can I submit my plate choice?',
      answer: 'Plate choice submissions are only allowed between 8:00 PM and 10:30 PM IST daily. Outside this window, the form will be disabled.',
    },
    {
      question: 'How do I request a food parcel?',
      answer: 'Navigate to the Food Parcel page, fill in all required details including student information, hostel details, and your name. Submit the request and wait for warden approval.',
    },
    {
      question: 'How long does warden approval take?',
      answer: 'Warden approval times may vary. Once approved, the request will immediately appear in the Staff Portal for processing.',
    },
    {
      question: 'Can I edit my submission after submitting?',
      answer: 'Currently, submissions cannot be edited once submitted. Please ensure all information is correct before submitting.',
    },
    {
      question: 'What happens to my data?',
      answer: 'All submissions are stored securely in our database. However, data is deleted every 3-4 months due to storage limitations.',
    },
    {
      question: 'Who can access the Warden and Staff portals?',
      answer: 'Only authorized warden and staff members with valid credentials can access their respective portals.',
    },
    {
      question: 'What information do I need for food parcel requests?',
      answer: 'You need the student\'s name, hostel name, registration number, room number, and the collector\'s name (person picking up the parcel).',
    },
    {
      question: 'Is the system available 24/7?',
      answer: 'Yes, the system is available 24/7, but plate choice submissions are only accepted during the designated time window (8:00 PM - 10:30 PM).',
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">Support & FAQ</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions and get the help you need
        </p>
      </div>

      {/* Important Alert */}
      <div className="glass-card border-2 border-red-400 p-6 mb-12 animate-slideUp">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-3">Important Notice - Data Deletion Policy</h3>
            <p className="text-gray-700 mb-3 leading-relaxed">
              <strong>The developer will delete all data every 3-4 months</strong> due to MongoDB storage limitations. 
              This is necessary to maintain system performance and stay within free tier limits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> Students will not be able to submit new forms if data is not deleted. 
              Staff members are advised to generate and download Excel reports regularly to maintain historical records.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card-hover p-8">
          <div className="text-4xl mb-4">📞</div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Contact Information</h2>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="font-semibold">Phone:</span> Contact food court desk
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="font-semibold">Email:</span> foodcourt@adamasuniversity.ac.in
            </p>
          </div>
        </div>

        <div className="glass-card-hover p-8">
          <div className="text-4xl mb-4">🕐</div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Support Hours</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Plate Choice:</strong> 8:00 PM - 10:30 PM daily</p>
            <p><strong>Food Parcel:</strong> 24/7 (subject to warden approval)</p>
            <p><strong>Technical Support:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                <svg
                  className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 animate-slideUp">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <div className="text-center">
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 gradient-text">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you're looking for, please visit the food court desk 
            during operating hours or contact the technical support team.
          </p>
          <a href="/" className="btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Support;
