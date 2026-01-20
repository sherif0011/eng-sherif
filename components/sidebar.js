class CustomSidebar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        aside { width: 250px; background: #fff; height: 100vh; position: fixed; right: 0; top: 0; border-left: 1px solid #ddd; padding: 20px; z-index: 1000; transform: translateX(100%); transition: 0.3s; box-shadow: -5px 0 15px rgba(0,0,0,0.1); }
        aside.active { transform: translateX(0); }
        .toggle-btn { position: fixed; right: 15px; top: 15px; z-index: 1001; background: #3b82f6; color: white; border: none; width: 45px; height: 45px; border-radius: 10px; cursor: pointer; font-size: 1.5rem; }
        ul { list-style: none; padding: 0; margin-top: 50px; }
        li { margin-bottom: 10px; }
        a { color: #333; text-decoration: none; display: block; padding: 12px; border-radius: 8px; font-weight: bold; }
        a:hover { background: #f0f7ff; color: #3b82f6; }
      </style>
      <button class="toggle-btn" id="tBtn">☰</button>
      <aside id="sBar">
        <h3 style="text-align:center; color:#1e40af; margin-bottom:20px;">PlayZone</h3>
        <ul>
          <li><a href="index.html">🏠 الرئيسية</a></li>
          <li><a href="my-bookings.html">🗓️ حجوزاتي</a></li>
          <li><a href="about.html">ℹ️ عنّا</a></li>
        </ul>
      </aside>
    `;
    const btn = this.shadowRoot.getElementById('tBtn');
    const side = this.shadowRoot.getElementById('sBar');
    btn.onclick = () => side.classList.toggle('active');
  }
}
customElements.define('custom-sidebar', CustomSidebar);