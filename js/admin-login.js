// admin-login.js
window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      errorEl.textContent = 'All fields are required!';
      errorEl.style.color = 'red';
      return;
    }

    try {
      // Send login request to server
      const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (data.success) {
        // Save login info if needed
        localStorage.setItem('adminEmail', email);
        // Redirect to dashboard
        window.location.href = 'admin-dashboard.html';
      } else {
        errorEl.textContent = data.message;
        errorEl.style.color = 'red';
      }
    } catch (err) {
      console.error('Login error:', err);
      errorEl.textContent = 'Server error. Try again later.';
      errorEl.style.color = 'red';
    }
  });
});
