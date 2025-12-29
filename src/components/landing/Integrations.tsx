'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

const Integrations = () => {
  const integrations = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
        </svg>
      ),
      name: "Stripe",
      description: "Automatic sync for all your client payments and processing fees."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
          <path d="M14 2v5a1 1 0 0 0 1 1h5M10 9H8m8 4H8m8 4H8"></path>
        </svg>
      ),
      name: "QuickBooks",
      description: "One-click export of categorized expenses for your accountant."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6v6l4 2"></path>
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      ),
      name: "Google Drive",
      description: "Securely backup all your parsed receipt images automatically."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      name: "Slack",
      description: "Get real-time budget alerts and weekly summaries in your workspace."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          <rect width="20" height="14" x="2" y="6" rx="2"></rect>
        </svg>
      ),
      name: "Upwork",
      description: "Import project details and contract earnings automatically."
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12h6m12 0h-6m-3-9v6m0 6v6M5.636 5.636l4.243 4.243m8.485 8.485l-4.243-4.243m4.243-8.485l-4.243 4.243m-4.242 4.242l-4.243 4.243"></path>
        </svg>
      ),
      name: "Zapier",
      description: "Connect TeckStart to 5,000+ other apps for custom workflows."
    }
  ];

  return (
    <section className="integrations-section">
      <div className="container">
        <div className="integrations-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Integrates Everywhere
          </motion.h2>
          <motion.p 
            className="section-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Connect with the tools you already use. TeckStart seamlessly integrates with your favorite platforms.
          </motion.p>
        </div>
        <div className="integrations-grid">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              className="integration-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                background: "var(--color-surface-elevated)"
              }}
            >
              <div className="integration-icon">
                {integration.icon}
              </div>
              <h4 className="integration-name">{integration.name}</h4>
              <p className="section-content">{integration.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .integrations-section {
          padding: 5rem 1rem;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .integrations-header {
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

        .integrations-grid {
          gap: 2rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .integration-item {
          text-align: center;
          padding: 2rem 1.5rem;
          border: 1px solid #e1e4e8;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: white;
        }

        .integration-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border: 2px solid #e1e4e8;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          color: #0e2d4c;
        }

        .integration-icon svg {
          width: 24px;
          height: 24px;
        }

        .integration-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0e2d4c;
          margin-bottom: 1rem;
        }

        .integration-item .section-content {
          font-size: 0.95rem;
          margin: 0;
          max-width: none;
        }

        @media (max-width: 1024px) {
          .integrations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .integrations-section {
            padding: 3rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .integrations-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .integration-item {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default memo(Integrations);