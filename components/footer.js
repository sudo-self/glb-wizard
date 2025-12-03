class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background-color: #1e293b;
          color: white;
          padding: 3rem 0;
          margin-top: 4rem;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-heading {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: #e2e8f0;
        }
        .footer-link {
          color: #94a3b8;
          margin-bottom: 0.75rem;
          display: block;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .footer-bottom {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #334155;
          text-align: center;
          color: #94a3b8;
        }
        @media (max-width: 768px) {
          .footer-container {
            padding: 0 1rem;
          }
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <footer>
        <div class="footer-container">
          <div class="footer-grid">
            <div>
              <h3 class="footer-heading">GlbCraft Wizardry</h3>
              <p class="text-slate-400">Create magical 3D models with ease and export them to your projects.</p>
            </div>
            <div>
              <h3 class="footer-heading">Resources</h3>
              <a href="#" class="footer-link">Documentation</a>
              <a href="#" class="footer-link">Tutorials</a>
              <a href="#" class="footer-link">Examples</a>
            </div>
            <div>
              <h3 class="footer-heading">Community</h3>
              <a href="#" class="footer-link">GitHub</a>
              <a href="#" class="footer-link">Twitter</a>
              <a href="#" class="footer-link">Discord</a>
            </div>
            <div>
              <h3 class="footer-heading">Legal</h3>
              <a href="#" class="footer-link">Privacy Policy</a>
              <a href="#" class="footer-link">Terms of Service</a>
              <a href="#" class="footer-link">License</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} GlbCraft Wizardry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);
