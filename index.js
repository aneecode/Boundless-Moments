const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// ------------------- DATABASE -------------------
const pool = new Pool({
  host: 'localhost',
  database: 'Boundless_Moments',
  user: 'postgres',
  password: 'Anisa@123',
  port: 5433,
});

pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('PostgreSQL Connection Error:', err));

// ------------------- CONTACT ROUTES -------------------
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  pool.query(
    "INSERT INTO contact (name, email, message) VALUES ($1, $2, $3)",
    [name, email, message],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send("Error inserting data");
      }
      res.send("Contact form submitted successfully");
    }
  );
});

// ------------------- ADMIN LOGIN -------------------
app.post('/admin/login', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM admin_user WHERE username = $1 AND email ILIKE $2 AND password = $3`,
      [username.trim(), email.trim(), password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid username, email, or password' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ------------------- ADMIN INQUIRIES -------------------
app.get('/admin/inquiries', (req, res) => {
  pool.query(
    `SELECT Name, Email, Message, created_at FROM contact ORDER BY id DESC`,
    (err, result) => {
      if (err) {
        console.error('Error fetching inquiries:', err);
        return res.status(500).json({ error: 'Error fetching inquiries' });
      }
      res.json(result.rows);
    }
  );
});

// ------------------- PORTFOLIO ROUTES -------------------

// Admin portfolio route
app.get('/admin/portfolio', (req, res) => {
  pool.query('SELECT id, title, description, image FROM portfolio ORDER BY id DESC', (err, result) => {
    if (err) {
      console.error('Error fetching portfolio (admin):', err.stack);
      return res.status(500).json({ error: 'Server error fetching portfolio', details: err.message });
    }
    res.json(result.rows);
  });
});

// Public portfolio route
app.get('/portfolio', (req, res) => {
  pool.query('SELECT id, title, description, image FROM portfolio ORDER BY id DESC', (err, result) => {
    if (err) {
      console.error('Error fetching portfolio (public):', err.stack);
      return res.status(500).json({ error: 'Server error fetching portfolio', details: err.message });
    }
    res.json(result.rows);
  });
});


// Add portfolio item
app.post('/api/portfolio', (req, res) => {
  const { title, description, image_base64 } = req.body;

  if (!title || !description || !image_base64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate base64 image format
  const matches = image_base64.match(/^data:(image\/.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: 'Invalid image format' });
  }

  const ext = matches[1].split('/')[1]; // jpg, png, etc.
  const base64Data = matches[2];

  // Ensure images folder exists
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

  const shortId = Math.random().toString(36).substring(2, 8);
  const filename = `img-${shortId}.${ext}`;
  const savePath = path.join(imagesDir, filename);

  fs.writeFile(savePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }

    const imageURL = `/images/${filename}`;
    const sql = 'INSERT INTO portfolio (title, image, description) VALUES ($1, $2, $3)';
    const values = [title, imageURL, description];

    pool.query(sql, values, (err) => {
      if (err) {
        console.error('Error inserting portfolio into DB:', err);
        return res.status(500).json({ error: 'Server error inserting portfolio' });
      }
      res.status(200).json({ message: 'Portfolio item added successfully', imageURL });
    });
  });
});

// Delete portfolio item by ID
app.delete('/api/portfolio/:id', (req, res) => {
  const id = req.params.id;

  pool.query('SELECT image FROM portfolio WHERE id = $1', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Portfolio item not found' });

    const imagePath = path.join(__dirname, result.rows[0].image);

    fs.unlink(imagePath, (fsErr) => {
      if (fsErr) console.error('Error deleting image file:', fsErr);

      pool.query('DELETE FROM portfolio WHERE id = $1', [id], (dbErr) => {
        if (dbErr) return res.status(500).json({ error: 'Failed to delete portfolio item from DB' });
        res.json({ message: 'Portfolio item deleted successfully' });
      });
    });
  });
});

// ------------------- START SERVER -------------------
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
