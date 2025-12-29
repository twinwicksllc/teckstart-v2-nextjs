
'use client';
import React from 'react';

const EnhancedCTA = () => {
  return (
    <section className="bg-blue-500 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Take Your Next Step</h2>
        <p className="text-lg mb-6">
          Join thousands of others who are leveraging our platform to achieve their goals.
        </p>
        <button
          className="bg-white text-blue-500 font-semibold py-2 px-6 rounded shadow hover:bg-gray-200"
          onClick={() => window.location.href = '/login'}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};

export default EnhancedCTA;