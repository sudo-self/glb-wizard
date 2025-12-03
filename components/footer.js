class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        /* Background decorative elements */
        footer::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          border-radius: 50%;
          filter: blur(60px);
        }
        
        footer::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
          border-radius: 50%;
          filter: blur(60px);
        }
        
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem 2rem 2rem;
          position: relative;
          z-index: 1;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 4rem;
        }
        
        .footer-brand {
          margin-bottom: 1.5rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-decoration: none;
        }
        
        .footer-tagline {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 300px;
        }
        
        .footer-heading {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #f1f5f9;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          padding-bottom: 0.75rem;
        }
        
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          border-radius: 1px;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        
        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          padding-left: 0.5rem;
        }
        
        .footer-link::before {
          content: '→';
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          color: #818cf8;
        }
        
        .footer-link:hover {
          color: white;
          transform: translateX(8px);
        }
        
        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #cbd5e1;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(129, 140, 248, 0.3);
          border-color: transparent;
        }
        
        .footer-newsletter {
          margin-top: 2rem;
        }
        
        .newsletter-title {
          color: #f1f5f9;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .newsletter-form {
          display: flex;
          gap: 0.5rem;
        }
        
        .newsletter-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .newsletter-input:focus {
          outline: none;
          border-color: #818cf8;
          background: rgba(129, 140, 248, 0.1);
        }
        
        .newsletter-input::placeholder {
          color: #94a3b8;
        }
        
        .newsletter-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(129, 140, 248, 0.4);
        }
        
        .footer-bottom {
          padding-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .copyright {
          margin-bottom: 0.5rem;
        }
        
        .footer-legal {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        
        .legal-link {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          padding: 0.25rem 0;
        }
        
        .legal-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #818cf8;
          transition: width 0.3s ease;
        }
        
        .legal-link:hover {
          color: white;
        }
        
        .legal-link:hover::after {
          width: 100%;
        }
        
        /* Decorative separator */
        .footer-bottom::before {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          border-radius: 2px;
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .footer-container {
            padding: 4rem 1.5rem 1.5rem;
          }
          
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          
          .footer-brand {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .footer-logo {
            justify-content: center;
          }
          
          .footer-tagline {
            max-width: 100%;
            text-align: center;
          }
          
          .footer-heading {
            text-align: center;
          }
          
          .footer-heading::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .footer-social {
            justify-content: center;
          }
          
          .footer-newsletter {
            text-align: center;
          }
          
          .newsletter-form {
            flex-direction: column;
          }
          
          .footer-legal {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
          
          footer::before,
          footer::after {
            opacity: 0.5;
          }
        }
        
        /* Animation for links */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .footer-link i {
          animation: float 3s ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * 0.2s);
        }
        
        /* Hover effects for cards */
        .footer-section {
          padding: 1.5rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        
        .footer-section:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        /* Stats */
        .footer-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .stat {
          text-align: center;
          padding: 1rem;
        }
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      </style>
      
      <footer>
        <div class="footer-container">
          <div class="footer-grid">
            <!-- Brand Section -->
            <div class="footer-section">
              <div class="footer-brand">
                <a href="#" class="footer-logo">
                  <i data-feather="zap"></i>
                  GlbCraft Wizardry
                </a>
                <p class="footer-tagline">
                  Transform your ideas into stunning 3D models with our powerful web-based creation tools.
                </p>
                
                <div class="footer-social">
                  <a href="#" class="social-link" aria-label="GitHub">
                    <i data-feather="github"></i>
                  </a>
                  <a href="#" class="social-link" aria-label="Twitter">
                    <i data-feather="twitter"></i>
                  </a>
                  <a href="#" class="social-link" aria-label="Discord">
                    <i data-feather="message-circle"></i>
                  </a>
                  <a href="#" class="social-link" aria-label="YouTube">
                    <i data-feather="youtube"></i>
                  </a>
                </div>
                
                <div class="footer-newsletter">
                  <p class="newsletter-title">Stay updated with new features</p>
                  <form class="newsletter-form">
                    <input type="email" class="newsletter-input" placeholder="Your email address" required>
                    <button type="submit" class="newsletter-button">
                      <i data-feather="send" class="w-4 h-4"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            <!-- Resources -->
            <div class="footer-section">
              <h3 class="footer-heading">Resources</h3>
              <div class="footer-links">
                <a href="#" class="footer-link">
                  <i data-feather="book-open"></i>
                  Documentation
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="video"></i>
                  Video Tutorials
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="code"></i>
                  API Reference
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="download"></i>
                  Templates Library
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="help-circle"></i>
                  FAQ & Support
                </a>
              </div>
            </div>
            
            <!-- Community -->
            <div class="footer-section">
              <h3 class="footer-heading">Community</h3>
              <div class="footer-links">
                <a href="#" class="footer-link">
                  <i data-feather="users"></i>
                  Community Showcase
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="star"></i>
                  Featured Projects
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="award"></i>
                  Contribute
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="message-square"></i>
                  Community Forum
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="calendar"></i>
                  Events & Workshops
                </a>
              </div>
            </div>
            
            <!-- Company -->
            <div class="footer-section">
              <h3 class="footer-heading">Company</h3>
              <div class="footer-links">
                <a href="#" class="footer-link">
                  <i data-feather="info"></i>
                  About Us
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="briefcase"></i>
                  Careers
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="rss"></i>
                  Blog
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="mail"></i>
                  Contact
                </a>
                <a href="#" class="footer-link">
                  <i data-feather="heart"></i>
                  Sponsorships
                </a>
              </div>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div class="footer-stats">
            <div class="stat">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Models Created</span>
            </div>
            <div class="stat">
              <span class="stat-number">5K+</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="stat">
              <span class="stat-number">99.9%</span>
              <span class="stat-label">Uptime</span>
            </div>
            <div class="stat">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Support</span>
            </div>
          </div>
          
          <!-- Bottom Section -->
          <div class="footer-bottom">
            <p class="copyright">
              &copy; ${new Date().getFullYear()} GlbCraft Wizardry. All rights reserved.
            </p>
            
            <div class="footer-legal">
              <a href="#" class="legal-link">Privacy Policy</a>
              <a href="#" class="legal-link">Terms of Service</a>
              <a href="#" class="legal-link">Cookie Policy</a>
              <a href="#" class="legal-link">Security</a>
              <a href="#" class="legal-link">Sitemap</a>
            </div>
            
            <p style="color: #64748b; font-size: 0.8rem; margin-top: 1rem;">
              Made with <i data-feather="heart" style="color: #ef4444; width: 14px; height: 14px; vertical-align: middle;"></i> by the 3D Community
            </p>
          </div>
        </div>
      </footer>
      
      <script>
        // Initialize Feather icons in shadow DOM
        document.addEventListener('DOMContentLoaded', function() {
          if (window.feather) {
            const icons = this.shadowRoot.querySelectorAll('[data-feather]');
            icons.forEach(icon => {
              feather.replace(icon);
            });
          }
        });
      </script>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);
