import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statisticsAPI } from '../services/api';
import StatisticsCard from '../components/common/StatisticsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Landing = () => {
  const [stats, setStats] = useState({ today: 0, week: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statisticsAPI.getLanding();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: '🍽️',
      title: 'Plate Choice',
      description: 'Customize your daily meal preferences with our easy-to-use plate selection system.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '📦',
      title: 'Food Parcel',
      description: 'Request food parcels for delivery to your hostel with warden approval.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '✅',
      title: 'Warden Approval',
      description: 'Streamlined approval process for food parcel requests.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '📊',
      title: 'Staff Dashboard',
      description: 'Comprehensive dashboard for staff to manage orders and generate reports.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">AltPlate</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing food court management at Adamas University with smart, digital solutions
          </p>
        </div>

        {/* Bento Grid CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <Link
            to="/plate-choice"
            className="glass-card-hover p-8 md:p-12 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">Plate Choice</h3>
              <p className="text-gray-600">Select your meal preferences for the day</p>
            </div>
          </Link>

          <Link
            to="/food-parcel"
            className="glass-card-hover p-8 md:p-12 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">Food Parcel</h3>
              <p className="text-gray-600">Request food delivery to your hostel</p>
            </div>
          </Link>

          <Link
            to="/warden-portal"
            className="glass-card-hover p-8 md:p-12 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">Warden Portal</h3>
              <p className="text-gray-600">Approve and manage parcel requests</p>
            </div>
          </Link>

          <Link
            to="/staff-portal"
            className="glass-card-hover p-8 md:p-12 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-4">👨‍💼</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 gradient-text">Staff Portal</h3>
              <p className="text-gray-600">View submissions and generate reports</p>
            </div>
          </Link>
        </div>

        {/* Real-time Statistics */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text">
            Live Statistics
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading statistics..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatisticsCard
                title="Today's Submissions"
                value={stats.today}
                icon="📅"
                gradient="purple"
              />
              <StatisticsCard
                title="This Week"
                value={stats.week}
                icon="📊"
                gradient="blue"
              />
              <StatisticsCard
                title="Total Submissions"
                value={stats.total}
                icon="🎯"
                gradient="orange"
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card-hover p-6 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
