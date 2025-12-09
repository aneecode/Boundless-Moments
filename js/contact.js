const form = document.getElementById('contactForm');
const msgEl = document.getElementById('form-msg');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !email || !message) {
      if (msgEl) msgEl.textContent = 'Please fill all fields.';
      return;
    }

    // Split name into first and last (best-effort)
    const parts = name.split(' ');
    const first_name = parts.shift();
    const last_name = parts.join(' ');

    fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    })
      .then(async res => {
        const text = await res.text().catch(() => null);
        if (res.ok) {
          if (msgEl) msgEl.textContent = 'Message sent! Thank you.';
          form.reset();
        } else {
          if (msgEl) msgEl.textContent = text || 'Failed to send message.';
        }
      })
      .catch(err => {
        if (msgEl) msgEl.textContent = 'Server error. Try again later.';
        console.error('Contact submit error:', err);
      });
  });
} else {
  console.warn('Contact form not found: #contactForm');
}