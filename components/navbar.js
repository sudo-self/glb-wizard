class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
        }
        .nav-brand {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.025em;
        }
        .nav-link {
          color: #4b5563;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        .nav-link.active {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 1rem;
          right: 1rem;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.2s;
          border-radius: 2px;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        @media (max-width: 768px) {
          .nav-container {
            padding: 0.75rem 1rem;
          }
          .nav-actions {
            display: none;
          }
        }
      </style>
      <nav>
        <div class="nav-container flex items-center justify-between">
          <a href="#" class="nav-brand flex items-center">
            <i data-feather="box" class="mr-2"></i>
            GlbCraft Wizardry
          </a>
          <div class="flex items-center space-x-2">
            <a href="#" class="nav-link active">Create</a>
            <a href="#" class="nav-link">Tutorial</a>
            <a href="#" class="nav-link">Gallery</a>
            <a href="#" class="nav-link">Docs</a>
          </div>
          <div class="nav-actions">
            <button class="btn-primary">
              <i data-feather="star" class="w-4 h-4 mr-2"></i>
              Upgrade
            </button>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);
