const About = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Preference',
      description: 'Students select their meal preferences or request food parcels through intuitive forms.',
    },
    {
      number: '02',
      title: 'Submit Request',
      description: 'All submissions are instantly recorded in our secure database with timestamp tracking.',
    },
    {
      number: '03',
      title: 'Warden Approval',
      description: 'Food parcel requests are reviewed and approved by wardens through their dedicated portal.',
    },
    {
      number: '04',
      title: 'Staff Processing',
      description: 'Staff members access all submissions, generate reports, and manage food court operations efficiently.',
    },
  ];

  const benefits = [
    {
      category: 'For Students',
      items: ['Easy meal selection', 'Convenient parcel requests', 'No paperwork required', 'Real-time status updates'],
      icon: '🎓',
    },
    {
      category: 'For Staff',
      items: ['Centralized dashboard', 'Excel report generation', 'Advanced filtering', 'Real-time data access'],
      icon: '👨‍💼',
    },
    {
      category: 'For Administration',
      items: ['Digital record keeping', 'Streamlined approvals', 'Data analytics', 'Reduced manual work'],
      icon: '🏛️',
    },
  ];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">About AltPlate</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A modern, digital solution transforming food court management at Adamas University
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-card-hover p-8">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To digitize and streamline the food court management process at Adamas University, 
            replacing traditional notebook-based systems with a modern, efficient, and user-friendly digital platform.
          </p>
        </div>

        <div className="glass-card-hover p-8">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the gold standard for campus food management systems, providing seamless 
            experiences for students, staff, and administrators while maintaining high standards 
            of data security and operational efficiency.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="glass-card-hover p-6 relative">
              <div className="text-6xl font-bold text-purple-200 absolute top-4 right-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 relative z-10">{step.title}</h3>
              <p className="text-gray-600 relative z-10">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
          Benefits for Everyone
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="glass-card-hover p-6">
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4 gradient-text">{benefit.category}</h3>
              <ul className="space-y-2">
                {benefit.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
          Technology Stack
        </h2>
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">⚛️</div>
              <h4 className="font-bold text-gray-800">React 18</h4>
              <p className="text-sm text-gray-600">Frontend</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🟢</div>
              <h4 className="font-bold text-gray-800">Node.js</h4>
              <p className="text-sm text-gray-600">Backend</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🍃</div>
              <h4 className="font-bold text-gray-800">MongoDB</h4>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🎨</div>
              <h4 className="font-bold text-gray-800">Tailwind CSS</h4>
              <p className="text-sm text-gray-600">Styling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
          Development Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="glass-card-hover p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              DS
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2">Debarshi Sau</h3>
            <p className="text-gray-600">Full Stack Developer</p>
          </div>
          <div className="glass-card-hover p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              SB
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-2">Satarupa Bhowmik</h3>
            <p className="text-gray-600">Full Stack Developer</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 gradient-text">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Experience the future of food court management today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/plate-choice" className="btn-primary">
              Choose Your Plate
            </a>
            <a href="/food-parcel" className="btn-secondary">
              Request Food Parcel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
