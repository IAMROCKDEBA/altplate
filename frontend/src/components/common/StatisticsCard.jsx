const StatisticsCard = ({ title, value, icon, gradient }) => {
  const gradients = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    orange: 'from-orange-500 to-red-500',
    green: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="glass-card-hover p-6 animate-float">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-4xl font-bold gradient-text">{value}</p>
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center text-white text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
