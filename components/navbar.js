class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
        }
        .nav-brand {
          color: #4f46e5;
          font-weight: 700;
          font-size: 1.5rem;
        }
        .nav-link {
          color: #4b5563;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #4f46e5;
        }
        @media (max-width: 768px) {
          .nav-container {
            padding: 1rem;
          }
        }
      </style>
      <nav>
        <div class="nav-container flex items-center justify-between">
          <a href="#" class="nav-brand flex items-center">
            <i data-feather="box" class="mr-2"></i>
            GlbCraft Wizardry
          </a>
          <div class="flex space-x-6">
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">Tutorial</a>
            <a href="#" class="nav-link">About</a>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);
