document.addEventListener('DOMContentLoaded', () => {
  const adminEmail = localStorage.getItem('adminEmail');

  if (!adminEmail) {
    window.location.href = '/html/admin-login.html';
    return;
  }

  // Populate admin email/name in the UI
  const emailSpan = document.getElementById('adminTopEmail') || document.getElementById('adminName');
  if (emailSpan) emailSpan.textContent = adminEmail;

  // Logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminEmail');
      window.location.href = '/html/admin-login.html';
    });
  }
});