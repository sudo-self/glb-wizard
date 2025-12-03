class CustomNavbar extends HTMLElement {
  constructor() {
    super();
    this.isMobileMenuOpen = false;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupEventListeners();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }
        
        nav {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%, 
            rgba(255, 255, 255, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        
        .scrolled {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
        }
        
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        
        /* Brand */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }
        
        .nav-brand:hover {
          transform: translateY(-1px);
        }
        
        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        
        .brand-name {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        
        .brand-tagline {
          font-size: 0.7rem;
          color: #666;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        
        /* Navigation Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          color: #4a5568;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(102, 126, 234, 0.05) 0%, 
            rgba(118, 75, 162, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }
        
        .nav-link:hover {
          color: #667eea;
          transform: translateY(-1px);
        }
        
        .nav-link:hover::before {
          opacity: 1;
        }
        
        .nav-link.active {
          color: #667eea;
          background: linear-gradient(135deg, 
            rgba(102, 126, 234, 0.1) 0%, 
            rgba(118, 75, 162, 0.1) 100%
          );
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.15);
        }
        
        .nav-link i {
          font-size: 1.1rem;
        }
        
        /* CTA Buttons */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          border: 1.5px solid rgba(102, 126, 234, 0.2);
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
        }
        
        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }
        
        .btn-primary {
          padding: 0.75rem 1.75rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent
          );
          transition: 0.5s;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        /* Mobile Menu Toggle */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          padding: 0;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .mobile-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
        }
        
        .hamburger {
          width: 24px;
          height: 2px;
          background: #4a5568;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }
        
        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background: #4a5568;
          transition: all 0.3s ease;
        }
        
        .hamburger::before {
          top: -6px;
        }
        
        .hamburger::after {
          top: 6px;
        }
        
        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1rem 2rem;
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          visibility: hidden;
        }
        
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-nav-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: #4a5568;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: linear-gradient(135deg, 
            rgba(102, 126, 234, 0.1) 0%, 
            rgba(118, 75, 162, 0.1) 100%
          );
          color: #667eea;
        }
        
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .nav-links {
            gap: 0.25rem;
          }
          
          .nav-link {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
          
          .nav-actions {
            gap: 0.75rem;
          }
          
          .btn-secondary,
          .btn-primary {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1.5rem;
            height: 64px;
          }
          
          .nav-links,
          .nav-actions {
            display: none;
          }
          
          .mobile-toggle {
            display: block;
          }
          
          .mobile-menu.open ~ .nav-container .hamburger {
            background: transparent;
          }
          
          .mobile-menu.open ~ .nav-container .hamburger::before {
            transform: rotate(45deg);
            top: 0;
          }
          
          .mobile-menu.open ~ .nav-container .hamburger::after {
            transform: rotate(-45deg);
            top: 0;
          }
          
          .brand-name {
            font-size: 1.25rem;
          }
        }
        
        @media (max-width: 480px) {
          .nav-container {
            padding: 0 1rem;
          }
          
          .logo-icon {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }
          
          .brand-name {
            font-size: 1.1rem;
          }
          
          .brand-tagline {
            font-size: 0.65rem;
          }
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-item {
          animation: fadeIn 0.3s ease forwards;
          opacity: 0;
        }
        
        .nav-item:nth-child(1) { animation-delay: 0.1s; }
        .nav-item:nth-child(2) { animation-delay: 0.2s; }
        .nav-item:nth-child(3) { animation-delay: 0.3s; }
        .nav-item:nth-child(4) { animation-delay: 0.4s; }
        .nav-item:nth-child(5) { animation-delay: 0.5s; }
        
        /* Badge */
        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      </style>
      
      <nav>
        <div class="nav-container">
          <!-- Brand -->
          <a href="#" class="nav-brand">
            <div class="logo-icon">
              <i data-feather="zap"></i>
            </div>
            <div class="brand-text">
              <span class="brand-name">GlbCraft</span>
              <span class="brand-tagline">3D WIZARDRY</span>
            </div>
          </a>
          
          <!-- Desktop Navigation -->
          <ul class="nav-links">
            <li class="nav-item">
              <a href="#" class="nav-link active">
                <i data-feather="sparkles"></i>
                Create
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i data-feather="video"></i>
                Tutorials
                <span class="badge">New</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i data-feather="image"></i>
                Gallery
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i data-feather="book"></i>
                Docs
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i data-feather="shopping-bag"></i>
                Marketplace
              </a>
            </li>
          </ul>
          
          <!-- Desktop Actions -->
          <div class="nav-actions">
            <button class="btn-secondary">
              <i data-feather="upload-cloud"></i>
              Import
            </button>
            <button class="btn-primary">
              <i data-feather="star"></i>
              Upgrade
            </button>
            <div class="user-avatar">
              <i data-feather="user"></i>
            </div>
          </div>
          
          <!-- Mobile Toggle -->
          <button class="mobile-toggle">
            <span class="hamburger"></span>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu ${this.isMobileMenuOpen ? 'open' : ''}">
          <ul class="mobile-nav-links">
            <li>
              <a href="#" class="mobile-nav-link active">
                <i data-feather="sparkles"></i>
                Create
              </a>
            </li>
            <li>
              <a href="#" class="mobile-nav-link">
                <i data-feather="video"></i>
                Tutorials
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a href="#" class="mobile-nav-link">
                <i data-feather="image"></i>
                Gallery
              </a>
            </li>
            <li>
              <a href="#" class="mobile-nav-link">
                <i data-feather="book"></i>
                Docs
              </a>
            </li>
            <li>
              <a href="#" class="mobile-nav-link">
                <i data-feather="shopping-bag"></i>
                Marketplace
              </a>
            </li>
          </ul>
          
          <div class="mobile-actions">
            <button class="btn-secondary" style="width: 100%; justify-content: center;">
              <i data-feather="upload-cloud"></i>
              Import Model
            </button>
            <button class="btn-primary" style="width: 100%; justify-content: center;">
              <i data-feather="star"></i>
              Upgrade Plan
            </button>
          </div>
        </div>
      </nav>
    `;
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = this.shadowRoot.querySelector('.mobile-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking outside
    if (this.isMobileMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', (e) => {
          if (!this.contains(e.target)) {
            this.isMobileMenuOpen = false;
            this.render();
          }
        }, { once: true });
      }, 100);
    }

    // Add scroll effect
    const nav = this.shadowRoot.querySelector('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      // Hide/show on scroll
      if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    });

    // Initialize Feather icons
    setTimeout(() => {
      if (window.feather) {
        const icons = this.shadowRoot.querySelectorAll('[data-feather]');
        icons.forEach(icon => {
          feather.replace(icon);
        });
      }
    }, 100);

    // Add click handlers for nav items
    const navLinks = this.shadowRoot.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('active')) return;
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
          this.isMobileMenuOpen = false;
          this.render();
          this.setupEventListeners();
        }
      });
    });

    // Add click handlers for buttons
    const buttons = this.shadowRoot.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
          width: ${size}px;
          height: ${size}px;
          top: ${y}px;
          left: ${x}px;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Add ripple animation to styles
  addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  disconnectedCallback() {
    // Cleanup
    window.removeEventListener('scroll', this.handleScroll);
  }
}

customElements.define('custom-navbar', CustomNavbar);
