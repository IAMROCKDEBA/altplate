import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-card mt-16 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                AP
              </div>
              <h3 className="text-2xl font-bold gradient-text">AltPlate</h3>
            </div>
            <p className="text-gray-600">
              Digitizing food court management for Adamas University with modern technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-purple-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-purple-600 transition-colors">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link to="/warden-portal" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Warden Portal
                </Link>
              </li>
              <li>
                <Link to="/staff-portal" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Credits */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Contact & Credits</h4>
            <p className="text-gray-600 mb-4">
              For support and inquiries, visit our <Link to="/support" className="text-purple-600 hover:underline">Support Page</Link>
            </p>
            <div className="glass-card p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Developed by:</p>
              <p className="text-purple-600 font-bold">Debarshi Sau</p>
              <p className="text-pink-600 font-bold">Satarupa Bhowmik</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {currentYear} AltPlate - Adamas University Food Court. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
