'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    {
      number: "12h",
      subtitle: "Monthly Time Saved",
      description: "Average freelancer time saved on manual expense logging."
    },
    {
      number: "99%",
      subtitle: "Accuracy Rate", 
      description: "AI precision in parsing complex receipts and invoices."
    },
    {
      number: "5k+",
      subtitle: "Projects Tracked",
      description: "Successful projects managed through TeckStart analytics."
    },
    {
      number: "24/7",
      subtitle: "Real-time Sync",
      description: "Constant updates across all your devices and accounts."
    },
    {
      number: "$2M+",
      subtitle: "Expenses Logged",
      description: "Total transaction volume processed for our users this year."
    },
    {
      number: "15%",
      subtitle: "Profit Increase",
      description: "Average increase in project profitability via AI optimization."
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Trusted by Leaders
          </motion.h2>
          <motion.p 
            className="section-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Numbers that speak for themselves. Join thousands of businesses transforming their financial operations.
          </motion.p>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                background: "color-mix(in srgb, #feb33c 5%, transparent)"
              }}
            >
              <div className="stat-number">
                <span>{stat.number}</span>
              </div>
              <p className="section-subtitle">{stat.subtitle}</p>
              <p className="section-content">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats-section {
          padding: 5rem 1rem;
          background: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0e2d4c;
          margin-bottom: 1rem;
        }

        .section-content {
          font-size: 1.125rem;
          color: #666;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-grid {
          gap: 2rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .stat-item {
          text-align: center;
          padding: 2rem 1.5rem;
          background: white;
          border-radius: 12px;
          transition: background-color 0.3s ease;
        }

        .stat-number {
          margin-bottom: 1rem;
        }

        .stat-number span {
          font-size: 3rem;
          font-weight: 700;
          color: #feb33c;
          line-height: 1;
        }

        .section-subtitle {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0e2d4c;
          margin-bottom: 0.75rem;
        }

        .stat-item .section-content {
          font-size: 0.95rem;
          margin: 0;
          max-width: none;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-section {
            padding: 3rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .stat-item {
            padding: 1.5rem 1rem;
          }
          
          .stat-number span {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default memo(Stats);