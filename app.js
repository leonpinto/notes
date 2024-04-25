require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));

connectDB();

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));



// 404 Handler
app.get('*', function(req, res) {
    res.status(404).send('404 Page Not Found')
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});