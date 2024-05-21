
const express = require('express');
const app = express();
const path = require('path');

const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({extended: false}));

const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error when creating the database', err.message);
    } else {
        console.log('Database created successfully');
    }
});

//creates users table if doesn't exist. makes it so two users can't have same email
let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,first_name TEXT,last_name TEXT,password TEXT,email TEXT, UNIQUE(email))';
//runs above code 
db.run(sql);
//routes for all html/css/imgs
app.use(express.static(path.join(__dirname,'../views')))
app.use('/styles',express.static(path.join(__dirname,'../styles')))
app.use(express.static('/Users/Anuj/CSC-317-Group-Project-2/resources'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../sign-up.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Profilepage.html'));
});

//listens for posts requests in sign-up.html aka the sign up form
app.post("/sign-up.html",(req, res) => {

    try{
        const firstname = req.body.firstName;
        const lastname = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        //inserts user input into data base, ignores if email is the same. 
        db.run('INSERT OR IGNORE INTO users(first_name, last_name, password, email) VALUES(?,?,?,?)',[firstname, lastname,password,email], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            //redirects to login when done
            res.redirect("./login.html");
            });


    }catch (e){
        console.log(e);

    }

})
app.post("/login.html", (req, res) => {
    const { email, password } = req.body;
    //Does a query in sqlite
    const query = `SELECT * FROM users WHERE email = '${email}' `;
    db.get(query, (err, row) => {
        if (err) {
          console.error(err.message);
        } else if (row.email !== email) {
          console.error('Email not found');
        } else if (row.password !== password) {
          console.error('Incorrect password');
        } else {
          console.log('email and password match');
          res.redirect("./Profilepage.html");

        }
      });
    
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});