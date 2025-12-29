import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Head>
        <title>TeckStart - Freelance Expense & Project Tracker</title>
        <meta
          name="description"
          content="AI-powered freelance expense and project tracking with smart receipt parsing"
        />
      </Head>
      <div className="home-container">
        {/* Navigation */}
        <div className="navigation-wrapper">
          <div className="navigation-container">
            <Link href="/" className="navigation-logo">
              <img
                alt="TeckStart logo"
                src="/teckstart-v6-transparent.jpg"
                className="navigation-logo-icon"
              />
              <span className="navigation-brand-text">TeckStart</span>
            </Link>
            <div className="navigation-links">
              <Link href="#features" className="navigation-link">
                Features
              </Link>
              <Link href="#process" className="navigation-link">
                How it Works
              </Link>
              <Link href="#testimonials" className="navigation-link">
                Testimonials
              </Link>
              <Link href="/login" className="navigation-link">
                Login
              </Link>
            </div>
            <div className="navigation-actions">
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
            <div className="navigation-mobile-toggle">
              <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
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
              <h1 className="hero-title">
                Transform Your Business with AI-Powered Automation
              </h1>
              <span className="hero-subtitle">
                Streamline workflows, automate repetitive tasks, and unlock productivity with TeckStart&apos;s intelligent automation platform.
              </span>
              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link href="#features" className="btn btn-lg btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="dashboard-mockup">
                <img
                  alt="Dashboard mockup"
                  src="/placeholder-dashboard.png"
                  className="mockup-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="thq-section-padding">
          <div className="container">
            <div className="features-header thq-section-max-width">
              <h2 className="section-title">Powerful Features for Freelancers</h2>
              <p className="section-subtitle">
                Everything you need to manage expenses, track projects, and maximize tax deductions
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M512 128c211.2 0 384 172.8 384 384s-172.8 384-384 384-384-172.8-384-384 172.8-384 384-384zM512 213.333c-164.949 0-298.667 133.718-298.667 298.667s133.718 298.667 298.667 298.667 298.667-133.718 298.667-298.667-133.718-298.667-298.667-298.667zM469.333 256h85.333v256h-85.333v-256zM512 682.667c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333 85.333 38.229 85.333 85.333-38.229 85.333-85.333 85.333z"></path>
                  </svg>
                </div>
                <h3 className="feature-name">AI Receipt Parsing</h3>
                <p className="section-content">
                  Upload receipts and let AI automatically extract data, categorize expenses, and identify tax deductions
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M896 128h-768c-70.692 0-128 57.308-128 128v512c0 70.692 57.308 128 128 128h768c70.692 0 128-57.308 128-128v-512c0-70.692-57.308-128-128-128zM256 768h-128v-128h128v128zM256 512h-128v-128h128v128zM256 256h-128v-128h128v128zM768 768h-384v-128h384v128zM768 512h-384v-128h384v128zM768 256h-384v-128h384v128z"></path>
                  </svg>
                </div>
                <h3 className="feature-name">Project Tracking</h3>
                <p className="section-content">
                  Track time, expenses, and income by project. Generate detailed reports for clients and tax purposes
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M512 128l256 256h-192v384h-128v-384h-192z"></path>
                  </svg>
                </div>
                <h3 className="feature-name">Tax Optimization</h3>
                <p className="section-content">
                  Maximize deductions with smart categorization and year-end tax planning recommendations
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M512 128c211.2 0 384 172.8 384 384s-172.8 384-384 384-384-172.8-384-384 172.8-384 384-384zM512 213.333c-164.949 0-298.667 133.718-298.667 298.667s133.718 298.667 298.667 298.667 298.667-133.718 298.667-298.667-133.718-298.667-298.667-298.667z"></path>
                  </svg>
                </div>
                <h3 className="feature-name">Real-time Analytics</h3>
                <p className="section-content">
                  Monitor your financial health with live dashboards, profit/loss tracking, and cash flow insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div id="process" className="process-section">
          <div className="container">
            <div className="process-header thq-section-max-width">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">
                Get started in minutes with our simple 3-step process
              </p>
            </div>
            <div className="process-steps">
              <div className="step-item">
                <div className="step-number">
                  <span className="thq-body-large">1</span>
                </div>
                <div className="step-divider"></div>
                <div className="step-icon">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M512 128c211.2 0 384 172.8 384 384s-172.8 384-384 384-384-172.8-384-384 172.8-384 384-384zM512 213.333c-164.949 0-298.667 133.718-298.667 298.667s133.718 298.667 298.667 298.667 298.667-133.718 298.667-298.667-133.718-298.667-298.667-298.667zM469.333 256h85.333v256h-85.333v-256zM512 682.667c-47.104 0-85.333-38.229-85.333-85.333s38.229-85.333 85.333-85.333 85.333 38.229 85.333 85.333-38.229 85.333-85.333 85.333z"></path>
                  </svg>
                </div>
                <h3 className="step-title">Upload Receipts</h3>
                <p className="section-content">
                  Snap photos of receipts or upload digital copies
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">
                  <span className="thq-body-large">2</span>
                </div>
                <div className="step-divider"></div>
                <div className="step-icon">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M896 128h-768c-70.692 0-128 57.308-128 128v512c0 70.692 57.308 128 128 128h768c70.692 0 128-57.308 128-128v-512c0-70.692-57.308-128-128-128zM256 768h-128v-128h128v128zM256 512h-128v-128h128v128zM256 256h-128v-128h128v128zM768 768h-384v-128h384v128zM768 512h-384v-128h384v128zM768 256h-384v-128h384v128z"></path>
                  </svg>
                </div>
                <h3 className="step-title">AI Processing</h3>
                <p className="section-content">
                  Our AI extracts data and categorizes automatically
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">
                  <span className="thq-body-large">3</span>
                </div>
                <div className="step-divider"></div>
                <div className="step-icon">
                  <svg viewBox="0 0 1024 1024" className="thq-icon-medium">
                    <path d="M512 128l256 256h-192v384h-128v-384h-192z"></path>
                  </svg>
                </div>
                <h3 className="step-title">Track & Save</h3>
                <p className="section-content">
                  Monitor expenses and maximize tax deductions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section thq-section-padding">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <h3 className="stat-number">10,000+</h3>
                <p className="section-content">Active Users</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">1M+</h3>
                <p className="section-content">Receipts Processed</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">99.9%</h3>
                <p className="section-content">Uptime</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">4.9/5</h3>
                <p className="section-content">User Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="thq-section-padding">
          <div className="container">
            <div className="testimonials-header thq-section-max-width">
              <h2 className="section-title">Loved by Freelancers Everywhere</h2>
              <p className="section-subtitle">
                Join thousands of satisfied users who transformed their business
              </p>
            </div>
            <div className="testimonials-rail">
              <div className="testimonial-card">
                <div className="testimonial-img-placeholder">
                  <span className="thq-body-large">S</span>
                </div>
                <p className="testimonial-quote">
                  &quot;TeckStart saved me 15 hours a month on expense tracking. The AI receipt parsing is incredibly accurate!&quot;
                </p>
                <div className="testimonial-name">Sarah Johnson</div>
                <div className="testimonial-role">Freelance Designer</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-img-placeholder">
                  <span className="thq-body-large">M</span>
                </div>
                <p className="testimonial-quote">
                  &quot;As a freelance consultant, staying IRS compliant was always stressful. TeckStart makes it effortless.&quot;
                </p>
                <div className="testimonial-name">Michael Chen</div>
                <div className="testimonial-role">Business Consultant</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-img-placeholder">
                  <span className="thq-body-large">E</span>
                </div>
                <p className="testimonial-quote">
                  &quot;The project tracking features help me stay on budget and deliver on time. Game changer!&quot;
                </p>
                <div className="testimonial-name">Emily Rodriguez</div>
                <div className="testimonial-role">Web Developer</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-container">
            <div className="cta-content thq-section-max-width">
              <h2 className="section-title">Ready to Transform Your Freelance Business?</h2>
              <p className="section-subtitle">
                Join thousands of freelancers who are saving time and money with TeckStart
              </p>
              <div className="cta-form-wrapper">
                <div className="cta-form">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="form-input"
                    />
                  </div>
                  <div className="form-footer">
                    <Link href="/register" className="btn btn-primary btn-lg">
                      Start Free Trial
                    </Link>
                  </div>
                </div>
                <div className="cta-trust-badges">
                  <span className="thq-body-small">✓ No credit card required</span>
                  <span className="thq-body-small">✓ 14-day free trial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer-root">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-column">
                <Link href="/" className="footer-logo-link">
                  <span className="footer-logo-text">TeckStart</span>
                </Link>
                <p className="footer-description">
                  AI-powered freelance expense and project tracking with smart receipt parsing.
                </p>
                <div className="footer-social-wrapper">
                  <a href="#" className="footer-social-link">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M1024 512c0-282.77-229.23-512-512-512s-512 229.23-512 512 229.23 512 512 512 512-229.23 512-512zM759.167 402.667c0 0-45.833-27.5-93.833-27.5-120.5 0-163.167 91.167-163.167 267.167v145.833h-109.833v-145.833c0-176 42.667-267.167 163.167-267.167 48 0 93.833-27.5 93.833-27.5v67.5l-55.167 26.167c0 0-32.167 15.083-65.5 15.083-33.333 0-51.5-19.75-51.5-60.25v-48.917c0-40.5 18.167-60.25 51.5-60.25 33.333 0 65.5 15.083 65.5 15.083z"></path>
                    </svg>
                  </a>
                  <a href="#" className="footer-social-link">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M1024 512c0-282.77-229.23-512-512-512s-512 229.23-512 512 229.23 512 512 512 512-229.23 512-512zM384.256 716.8l0-307.2h102.4l0 307.2-102.4 0zM512 324.479c-35.584 0-64.512 28.928-64.512 64.512s28.928 64.512 64.512 64.512c35.584 0 64.512-28.928 64.512-64.512s-28.928-64.512-64.512-64.512z"></path>
                    </svg>
                  </a>
                  <a href="#" className="footer-social-link">
                    <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                      <path d="M1024 512c0-282.77-229.23-512-512-512s-512 229.23-512 512 229.23 512 512 512 512-229.23 512-512zM759.905 388.353c0 0-45.723-27.379-93.651-27.379-120.235 0-162.823 90.698-162.823 266.624v144.941h-109.114v-144.941c0-175.926 42.588-266.624 162.823-266.624 47.928 0 93.651-27.379 93.651-27.379v67.145l-54.941 26.078c0 0-32.064 15.029-65.27 15.029-33.206 0-51.305-19.726-51.305-60.117v-48.585c0-40.391 18.099-60.117 51.305-60.117 33.206 0 65.27 15.029 65.27 15.029z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="footer-column">
                <h3 className="footer-nav-title">Product</h3>
                <div className="footer-nav-list">
                  <Link href="#features" className="footer-nav-item">Features</Link>
                  <Link href="#process" className="footer-nav-item">How it Works</Link>
                  <Link href="/pricing" className="footer-nav-item">Pricing</Link>
                  <Link href="/integrations" className="footer-nav-item">Integrations</Link>
                </div>
              </div>
              <div className="footer-column">
                <h3 className="footer-nav-title">Company</h3>
                <div className="footer-nav-list">
                  <Link href="/about" className="footer-nav-item">About</Link>
                  <Link href="/blog" className="footer-nav-item">Blog</Link>
                  <Link href="/careers" className="footer-nav-item">Careers</Link>
                  <Link href="/contact" className="footer-nav-item">Contact</Link>
                </div>
              </div>
              <div className="footer-column">
                <h3 className="footer-nav-title">Support</h3>
                <div className="footer-nav-list">
                  <Link href="/help" className="footer-nav-item">Help Center</Link>
                  <Link href="/privacy" className="footer-nav-item">Privacy Policy</Link>
                  <Link href="/terms" className="footer-nav-item">Terms of Service</Link>
                  <Link href="/status" className="footer-nav-item">Status</Link>
                </div>
              </div>
            </div>
            <div className="footer-bottom-bar">
              <div className="footer-status-indicator">
                <div className="footer-status-dot"></div>
                <span className="footer-status-text">All systems operational</span>
              </div>
              <div className="footer-legal-links">
                <Link href="/privacy" className="footer-legal-item">Privacy</Link>
                <Link href="/terms" className="footer-legal-item">Terms</Link>
                <span className="footer-copyright">© 2024 TeckStart. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home
