import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
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
          <path d="M4 2v20l2-1l2 1l2-1l2 1l2-1l2 1l2-1l2 1V2l-2 1l-2-1l-2 1l-2-1l-2 1l-2-1l-2 1Z"></path>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8m4 1.5v-11"></path>
        </svg>
      ),
      title: "AI Receipt Parsing",
      description: "Snap a photo and let our AI extract date, vendor, and amount with 99.9% accuracy."
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
          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2m-8-4v-5m3 5v-1m3 1v-3"></path>
        </svg>
      ),
      title: "Project Tracking",
      description: "Organize expenses and income by project to see exactly where your profit comes from."
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
          <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm4 15h10m-8-4v4m6-4v4"></path>
          <path d="m8 12l3-3l2 2l3-3"></path>
        </svg>
      ),
      title: "Real-time Analytics",
      description: "Visual dashboards that update instantly, giving you a clear view of your financial health."
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
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 12v-5m3 5v-1m3 1v-3"></path>
        </svg>
      ),
      title: "Automated Reports",
      description: "Generate tax-ready reports and profit/loss statements with a single click."
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
          <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"></path>
        </svg>
      ),
      title: "Multi-Currency",
      description: "Work globally. We handle 160+ currencies with real-time exchange rates."
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
          <path d="M12 20v2m0-20v2m5 16v2m0-20v2M2 12h2m-2 5h2M2 7h2m16 5h2m-2 5h2M20 7h2M7 20v2M7 2v2"></path>
          <rect width="16" height="16" x="4" y="4" rx="2"></rect>
          <rect width="8" height="8" x="8" y="8" rx="1"></rect>
        </svg>
      ),
      title: "AI Insights",
      description: "Predictive cash flow modeling helps you plan for dry spells and growth phases."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Intelligent Capabilities
          </motion.h2>
          <motion.p 
            className="section-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything a modern business needs to stay ahead of the curve.
          </motion.p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                borderColor: "#feb33c"
              }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-name">{feature.title}</h3>
              <p className="section-content">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding: 5rem 1rem;
          background: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-header {
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

        .features-grid {
          gap: 2rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .feature-card {
          border: 1px solid #e1e4e8;
          padding: 2rem;
          background: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          border-radius: 12px;
        }

        .feature-icon-wrapper {
          color: #feb33c;
          width: 56px;
          height: 56px;
          display: flex;
          background: #0e2d4c;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .feature-icon-wrapper svg {
          width: 28px;
          height: 28px;
          stroke: #feb33c;
        }

        .feature-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0e2d4c;
          margin-bottom: 1rem;
        }

        .feature-card .section-content {
          font-size: 1rem;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 3rem 1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .feature-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;