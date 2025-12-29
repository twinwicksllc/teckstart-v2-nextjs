'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M19 8v6m3-3h-6"></path>
        </svg>
      ),
      title: "Quick Onboarding",
      description: "Connect your bank or start fresh. Set up your projects in under two minutes."
    },
    {
      number: "02",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
          <circle cx="12" cy="13" r="3"></circle>
        </svg>
      ),
      title: "Capture & Parse",
      description: "Snap photos of receipts as you go. AI automatically categorizes and logs them."
    },
    {
      number: "03",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
      ),
      title: "Get Insights",
      description: "Review AI-driven reports to optimize your spending and maximize project ROI."
    }
  ];

  return (
    <section className="process-section">
      <div className="container">
        <div className="process-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="section-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Three simple steps to financial clarity.
          </motion.p>
        </div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className="step-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-number">
                  <span>{step.number}</span>
                </div>
                <div className="step-icon">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="section-content">{step.description}</p>
              </motion.div>
              {index < steps.length - 1 && <div className="step-divider"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        .process-section {
          padding: 5rem 1rem;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .process-header {
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

        .process-steps {
          gap: 2rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .step-item {
          gap: 1rem;
          flex: 1;
          display: flex;
          text-align: center;
          align-items: center;
          flex-direction: column;
        }

        .step-number {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e2d4c;
          color: #feb33c;
          border-radius: 50%;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border: 2px solid #e1e4e8;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          color: #0e2d4c;
        }

        .step-icon svg {
          width: 32px;
          height: 32px;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0e2d4c;
          margin-bottom: 1rem;
        }

        .step-item .section-content {
          font-size: 1rem;
          margin: 0;
        }

        .step-divider {
          width: 80px;
          height: 2px;
          background: linear-gradient(to right, #feb33c, #0e2d4c);
          margin-top: 4rem;
          align-self: center;
        }

        @media (max-width: 1024px) {
          .process-steps {
            gap: 1.5rem;
          }
          
          .step-divider {
            width: 60px;
          }
        }

        @media (max-width: 768px) {
          .process-section {
            padding: 3rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .process-steps {
            align-items: center;
            flex-direction: column;
          }
          
          .step-divider {
            display: none;
          }
          
          .step-item {
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  );
};

export default Process;