'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/videos/854322/pictures/preview-0.jpg"
          src="https://videos.pexels.com/video-files/854322/854322-hd_1280_720_25fps.mp4"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Business with AI-Powered Automation
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Streamline workflows, automate repetitive tasks, and unlock productivity with TeckStart's intelligent automation platform.
          </motion.p>
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn btn-primary btn-lg">
              Get Started Free
            </button>
            <button className="btn btn-lg btn-outline">
              Watch Demo
            </button>
          </motion.div>
        </div>
        
      </div>

      <style jsx>{`
        .hero-section {
          color: white;
          display: flex;
          padding: 0;
          min-height: 100vh;
          align-items: center;
          position: relative;
        }

        .hero-bg-video {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          position: absolute;
        }

        .hero-bg-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          position: absolute;
          background: linear-gradient(135deg, #0e2d4c 0%, rgba(14, 45, 76, 0.8) 100%);
        }

        .hero-container {
          width: 100%;
          margin: 0 auto;
          display: flex;
          padding: 4rem 2rem;
          z-index: 3;
          position: relative;
          max-width: 800px;
        }

        .hero-content {
          gap: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          opacity: 0.85;
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .hero-actions {
          gap: 1rem;
          display: flex;
          flex-wrap: wrap;
        }

        .hero-visual {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dashboard-mockup {
          width: 100%;
          overflow: visible;
          position: relative;
          max-width: 540px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          border-radius: 12px;
        }

        .mockup-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 12px;
        }

        .mockup-floating-card {
          position: absolute;
          top: 20px;
          right: -20px;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          min-width: 150px;
        }

        .flex-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .icon-accent {
          color: #feb33c;
          width: 24px;
          height: 24px;
          display: flex;
          background: #0e2d4c;
          align-items: center;
          border-radius: 6px;
          padding: 4px;
        }

        .icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .card-label {
          font-size: 0.875rem;
          color: #666;
        }

        .card-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0e2d4c;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .btn-primary {
          background: #feb33c;
          color: #0e2d4c;
        }

        .btn-primary:hover {
          background: #f9a825;
          transform: translateY(-2px);
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-outline:hover {
          background: white;
          color: #0e2d4c;
        }

        @media (max-width: 768px) {
          .hero-container {
            padding: 2rem 1rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-actions {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;