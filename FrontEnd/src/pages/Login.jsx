import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useUserContext } from '../userContext.jsx';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const { setUserData } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    console.log("Login Request");

    try {
      const response = await axios.post('https://engineers-verse-back/api/v1/users/login', {
        email,
        password,
      });

      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('_id', response.data.data.user._id);
        localStorage.setItem('User', JSON.stringify(response.data.data.user));

        const userId = localStorage.getItem('_id');
        setUserData(response.data.data.user);

        navigate(`/dashboard/${userId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {/* 3D shapes */}
        <motion.div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded" animate={{ rotate: 360, x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-4 border-white/20 rounded-full" animate={{ rotate: -360, x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="absolute top-3/4 left-1/3 w-20 h-8 bg-white/20 rounded-full" animate={{ rotateY: 360, x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
      </motion.div>

      <motion.div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Sign In</h2>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome Back!</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white bg-opacity-70" required />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white bg-opacity-70" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md shadow" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
