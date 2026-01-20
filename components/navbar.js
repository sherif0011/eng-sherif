class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .navbar { 
          background: #1e40af; 
          color: white; 
          padding: 1rem; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .nav-links { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
        }
        a { 
          color: white; 
          text-decoration: none; 
          font-weight: bold; 
          font-size: 0.9rem; 
          padding: 5px 10px; 
          border-radius: 8px;
          transition: background 0.3s;
        }
        a:hover { 
          background: rgba(255,255,255,0.1); 
        }
        .logo { 
          font-size: 1.2rem; 
          font-weight: bold; 
        }
      </style>
      
      <nav class="navbar text-right" dir="rtl">
        <div class="container">
          <div class="logo">PlayZone 🎮</div>
          <div class="nav-links">
            <a href="index.html">الرئيسية</a>
            <a href="my-bookings.html">حجوزاتي</a>
            <a href="about.html">عنا</a> </div>
        </div>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);