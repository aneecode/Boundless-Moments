window.addEventListener('DOMContentLoaded', () => {
  const portfolioBody = document.getElementById('portfolioBody');
  const addBtn = document.getElementById('addBtn');
  const message = document.getElementById('message');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check admin login
  const adminEmail = localStorage.getItem('adminEmail');
  if (!adminEmail) {
    window.location.href = '/admin-login.html';
    return;
  }

  // Display admin email
  const adminNameEl = document.getElementById('adminName');
  if (adminNameEl) adminNameEl.textContent = adminEmail;

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminEmail');
      window.location.href = '/admin-login.html';
    });
  }

  // Utility: display a message in the table
  function displayTableMessage(msg, colspan = 4) {
    if (portfolioBody) {
      portfolioBody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center;color:#555">${msg}</td></tr>`;
    }
  }

  // Load portfolio entries
  async function loadPortfolioEntries() {
    if (!portfolioBody) return;

    displayTableMessage('Loading portfolio items...');

    try {
      const res = await fetch('http://localhost:3000/admin/portfolio');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        displayTableMessage('No portfolio items found.');
        return;
      }

      portfolioBody.innerHTML = '';
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>${item.image ? `<img src="${item.image}" width="100" style="border-radius:5px"/>` : 'No Image'}</td>
          <td><button class="deleteBtn" data-id="${item.id}">Delete</button></td>
        `;
        portfolioBody.appendChild(row);
      });

      attachDeleteEvents();
    } catch (err) {
      console.error('Failed to load portfolio entries:', err);
      displayTableMessage('Error loading portfolio items.');
    }
  }

  // Add portfolio item
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.getElementById('title')?.value.trim();
      const description = document.getElementById('description')?.value.trim();
      const imageInput = document.getElementById('image')?.files[0];

      if (!title || !description || !imageInput) {
        message.textContent = 'All fields are required!';
        message.style.color = 'red';
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const image_base64 = reader.result;
        try {
          const res = await fetch('http://localhost:3000/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, image_base64 })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to add portfolio');

          message.textContent = 'Portfolio item added!';
          message.style.color = 'green';
          document.getElementById('title').value = '';
          document.getElementById('description').value = '';
          document.getElementById('image').value = '';
          loadPortfolioEntries();
        } catch (err) {
          console.error('Add portfolio error:', err);
          message.textContent = 'Failed to add portfolio!';
          message.style.color = 'red';
        }
      };
      reader.readAsDataURL(imageInput);
    });
  }

  // Attach delete buttons
  function attachDeleteEvents() {
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!id || !confirm('Are you sure you want to delete this portfolio item?')) return;

        try {
          const res = await fetch(`http://localhost:3000/api/portfolio/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Delete failed');

          alert(data.message);
          loadPortfolioEntries();
        } catch (err) {
          console.error('Delete error:', err);
          alert('Failed to delete portfolio item.');
        }
      });
    });
  }

  // Initial load
  loadPortfolioEntries();
});
