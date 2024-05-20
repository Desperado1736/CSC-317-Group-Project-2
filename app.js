
const express = require('express');
const app = express();
const path = require('path');

const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({extended: false}));

const db = new sqlite3.Database("./data.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.messgae);
});

//creates users table if doesn't exists, makes it so two users can't have same email
let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,first_name TEXT,last_name TEXT,password INTEGER,email TEXT, UNIQUE(email))';

db.run(sql);
app.use(express.static(__dirname));

app.post("/sign-up.html",(req, res) => {

    try{
        const firstname = req.body.firstName;
        const lastname = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;


        db.run('INSERT OR IGNORE INTO users(first_name, last_name, password, email) VALUES(?,?,?,?)',[firstname, lastname,password,email], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            // res.redirect("./login.html");
            });


    }catch (e){
        console.log(e);

    }

        // res.redirect("./login.html");

})


// app.get('/', (req, res) => {
//     res.render("index.html")
// })

// app.get('/sign-up', (req, res) => {
//     res.render("login.ejs")
// })

// app.get('/', checkNotAuthenticated, (req, res) => {
//     res.render("register.ejs")
// })



// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});