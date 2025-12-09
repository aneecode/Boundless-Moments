document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('inquiriesTable'); // matches your HTML
  const adminNameSpan = document.getElementById('adminName');
  const logoutBtn = document.getElementById('logoutBtn');

  const adminEmail = localStorage.getItem('adminEmail');
  if (!adminEmail) {
    window.location.href = '/admin-login.html';
    return;
  } else {
    adminNameSpan.textContent = `Welcome, ${adminEmail}`;
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin-login.html';
  });

  // Fetch inquiries
  fetch('http://localhost:3000/admin/inquiries')
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = ''; // clear previous rows

      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No inquiries found</td></tr>`;
        return;
      }

      data.forEach(inquiry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${inquiry.name || ''}</td>
          <td>${inquiry.email || ''}</td>
          <td>${inquiry.message || ''}</td>
          <td>${inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : ''}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Error loading inquiries:', err);
      tbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load inquiries.</td></tr>`;
    });
});
