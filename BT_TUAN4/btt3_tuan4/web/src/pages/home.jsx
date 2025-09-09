import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/context/auth.context';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const Button = ({ to, children, variant = 'primary' }) => (
    <Link
      to={to}
      className={`px-6 py-3 rounded-lg font-semibold text-md transition-all duration-200 shadow-md hover:shadow-lg ${
        variant === 'primary'
          ? 'bg-white text-orange-600 hover:bg-orange-50'
          : 'border-2 border-white text-white hover:bg-white hover:text-orange-600'
      }`}
    >
      {children}
    </Link>
  );

  const FeatureCard = ({ iconColor, icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );

  const features = [
    {
      iconColor: 'bg-yellow-100',
      icon: <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with refresh tokens, password hashing, and secure session management.',
    },
    {
      iconColor: 'bg-orange-100',
      icon: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
      title: 'User Management',
      description: 'Complete CRUD operations for users with role-based access control and permission management.',
    },
    {
      iconColor: 'bg-amber-100',
      icon: <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: 'High Performance',
      description: 'Optimized for speed with MongoDB, efficient pagination, and responsive design for all devices.',
    },
    {
      iconColor: 'bg-yellow-100',
      icon: <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: 'Easy Configuration',
      description: 'Simple setup with environment variables, Docker support, and comprehensive documentation.',
    },
    {
      iconColor: 'bg-red-100',
      icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      title: 'Analytics & Reports',
      description: 'Built-in analytics dashboard with user statistics, activity tracking, and detailed reports.',
    },
    {
      iconColor: 'bg-orange-100',
      icon: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
      title: 'API Integration',
      description: 'RESTful API with comprehensive documentation, rate limiting, and third-party integrations.',
    },
  ];

  const stats = [
    { value: '150+', label: 'Total Users', color: 'text-yellow-400' },
    { value: '98%', label: 'System Uptime', color: 'text-orange-400' },
    { value: '24/7', label: 'Support Available', color: 'text-amber-400' },
    { value: '5★', label: 'User Rating', color: 'text-red-400' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Hero Section with Integrated CTA */}
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600 text-white py-16 px-4 md:px-8 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="w-full max-w-md mx-auto aspect-square bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">User Management</h3>
                  <p className="text-yellow-100 text-sm">Powerful tools for modern applications</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MyApp
              </span>
            </h1>
            <p className="text-lg text-yellow-100 leading-relaxed">
              A modern user management system built with React, Node.js, and MongoDB. Experience seamless authentication and powerful user controls.
            </p>
            <div className="flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <Button to="/register">Get Started</Button>
                  <Button to="/login" variant="secondary">Sign In</Button>
                </>
              ) : (
                <Button to="/user">Manage Users</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Combined Features and Stats Section */}
      <div className="py-16 px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to manage users efficiently and securely</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        {isAuthenticated && (
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
              <p className="text-lg text-gray-600">Your dashboard overview</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-yellow-100">Join thousands of developers who trust our platform for their user management needs.</p>
          {!isAuthenticated && (
            <Button to="/register">Start Free Trial</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;