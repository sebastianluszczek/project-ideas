const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 8080;

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/keys').MongoURI;

// mongoose connection
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB connected....'))
    .catch(error => console.log(error));

// load model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash middleware
app.use(flash());

// global variables 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// index route
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
});

// about route
app.get('/about', (req, res) => {
    res.render('about');
});

// use routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
});