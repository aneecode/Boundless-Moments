document.addEventListener('DOMContentLoaded', () => {
  const adminEmail = localStorage.getItem('adminEmail');

  // Redirect to login if not logged in
  if (!adminEmail) {
    window.location.href = '/admin-login.html';
    return;
  }

  // Populate admin name
  const adminNameSpan = document.getElementById('adminName');
  if (adminNameSpan) adminNameSpan.textContent = `Welcome, ${adminEmail}`;

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminEmail');
      window.location.href = '/admin-login.html';
    });
  }

  // Fetch contact count
  fetch('/admin/inquiries')
    .then(res => res.json())
    .then(data => {
      const contactCount = document.getElementById('contactCount');
      const activityList = document.getElementById('activityList');

      if (contactCount) contactCount.textContent = data.length;

      if (activityList) {
        activityList.innerHTML = '';
        if (data.length === 0) {
          activityList.innerHTML = '<p>No new messages</p>';
        } else {
          data.slice(0, 5).forEach(item => {
            const p = document.createElement('p');
            p.textContent = `${item.name}: ${item.message}`;
            activityList.appendChild(p);
          });
        }
      }
    })
    .catch(err => console.error('Failed to load contact messages:', err));

  // Fetch portfolio count
  fetch('/admin/portfolio')
    .then(res => res.json())
    .then(data => {
      const portfolioCount = document.getElementById('portfolioCount');
      if (portfolioCount) portfolioCount.textContent = data.length;
    })
    .catch(err => console.error('Failed to load portfolio count:', err));
});
