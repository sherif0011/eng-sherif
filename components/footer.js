class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer { background: #1e293b; color: white; padding: 2rem 1rem; text-align: center; margin-top: 3rem; }
        .content { max-width: 1200px; margin: 0 auto; }
        
        /* تصميم زر الواتساب العائم */
        .whatsapp-float {
          position: fixed;
          width: 60px;
          height: 60px;
          bottom: 20px;
          left: 20px; /* جهة اليسار لعدم التعارض مع النصوص العربية */
          background-color: #25d366;
          color: #FFF;
          border-radius: 50px;
          text-align: center;
          font-size: 30px;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: transform 0.3s ease;
        }
        .whatsapp-float:hover {
          transform: scale(1.1);
          background-color: #128c7e;
        }
        .whatsapp-icon {
          width: 35px;
          height: 35px;
        }
      </style>
      
      <footer>
        <div class="content">
          <p>PlayZone 🎮 - المطاعنه 🦅</p>
          <p>للتواصل: 01142822877</p>
          <p style="margin-top: 1rem; font-size: 0.8rem; color: #94a3b8;">© 2026 جميع الحقوق محفوظة</p>
        </div>
      </footer>

      <a href="https://wa.me/201142822877" class="whatsapp-float" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" class="whatsapp-icon" alt="WhatsApp">
      </a>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);