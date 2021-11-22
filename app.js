const express = require('express');

//creating app
const app = express();

app.use(express.static('public'));

// using JSON and URL Encoded middleware 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const session = require('express-session');
app.use(session({secret: 'some secret code'}));

app.set('view engine', 'ejs');
///send the index.html when receiving HTTP GET /
app.get('/', (req, res) => {
    res.render('index');
});   

app.get('/contacts', (req, res) => {
    res.render('contacts');
});

app.get('/login', (req, res) => {
    res.render('login'); 
});  

app.get('/register.ejs', (req, res) => {
    res.render('register');
}); 

//make the app listen on port
const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () => {
 console.log(`Cart app listening at http://localhost:${port}`);
});

//pass requests to the router middleware
const router = require('./routes/post.js');
app.use(router);








