function renderDashboard() {
  return `
    ${renderNav()}
    <div class="container app">
      <aside class="sidebar">
        <h3>Northman</h3>
        <a href="#" data-route="overview">📊 Overview</a>
        <a href="#" data-route="games">🎮 Games</a>
        <a href="#" data-route="clients">👥 Clients</a>
        <a href="#" data-route="settings">⚙️ Settings</a>
        <button class="btn" id="backBtn" style="margin-top:14px;">Back to Site</button>
      </aside>

      <main class="main">
        <div class="header">
          <div><h2 style="margin:0">Dashboard</h2><div style="color:var(--muted)">Welcome, Client</div></div>
          <div style="display:flex; gap:12px; align-items:center">
            <div style="text-align:right;">
              <div style="font-weight:700">Status</div>
              <div style="color:var(--muted)">All systems nominal</div>
            </div>
            <img src="https://i.pravatar.cc/44" alt="avatar" style="border-radius:999px; border:2px solid #eee;">
          </div>
        </div>

        <div class="stats">
          <div class="stat"><div style="color:var(--muted)">Active Games</div><div style="font-size:20px; font-weight:700; color:var(--accent)">12</div></div>
          <div class="stat"><div style="color:var(--muted)">Clients</div><div style="font-size:20px; font-weight:700; color:var(--accent)">58</div></div>
          <div class="stat"><div style="color:var(--muted)">Revenue</div><div style="font-size:20px; font-weight:700; color:var(--accent)">$24,500</div></div>
        </div>

        <div class="table">
          <h4 style="margin:0 0 8px 0">Recent Clients</h4>
          <table style="width:100%; border-collapse:collapse;">
            <thead style="color:var(--muted)"><tr><th style="text-align:left; padding:8px 0">Name</th><th style="text-align:left; padding:8px 0">Email</th><th style="text-align:left; padding:8px 0">Status</th></tr></thead>
            <tbody>
              <tr style="border-top:1px solid #f1f5f9"><td style="padding:10px 0">Alice Johnson</td><td style="padding:10px 0">alice@example.com</td><td style="padding:10px 0; color:var(--accent)">Active</td></tr>
              <tr style="border-top:1px solid #f1f5f9"><td style="padding:10px 0">Mark Smith</td><td style="padding:10px 0">mark@example.com</td><td style="padding:10px 0; color:var(--muted)">Inactive</td></tr>
              <tr style="border-top:1px solid #f1f5f9"><td style="padding:10px 0">Sophie Lee</td><td style="padding:10px 0">sophie@example.com</td><td style="padding:10px 0; color:var(--accent)">Active</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}
