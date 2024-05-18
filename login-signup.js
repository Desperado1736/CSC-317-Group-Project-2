
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, firstName Text, lastName Text)');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if(row) {
      res.send('Login successful');
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + './sign-up.html');
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if(err) {
      res.send('Error registering user');
    } else {
      res.send('User registered successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});