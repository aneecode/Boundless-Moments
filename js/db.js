// DB.js
export const admins = [
    { username: "Anisa",
        email:"Anisa2005@gmail.com", 
        password: "Anisa@123" }
];

export let contacts = [
    { id: 1, name: "John Doe", email: "john@example.com", message: "Hello!" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", message: "I love your photos!" }
];

export let portfolio = [
    { id: 1, title: "Sunset Photo", category: "Nature", img: "images/sunset.jpg" },
    { id: 2, title: "Cityscape", category: "Urban", img: "images/city.jpg" }
];

// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'boundDB',
    password: 'Anisa@123',
    port: 5432,
});

module.exports = pool;
