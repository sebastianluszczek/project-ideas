const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 5001;

// mongoose connection
mongoose.connect('mongodb://localhost/proj_db', {
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

// method-override middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect flash middleware
app.use(flash());

// global variables 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
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

// add idea route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// edit idea route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        })
});

// add idea route
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// process form
app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please fill title'
        })
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please fill details'
        })
    }
    if (errors.length) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Idea added successfuly.');
                res.redirect('/ideas')
            })
    }
});

// edit idea
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {

            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Idea updated successfuly.');
                    res.redirect('/ideas')
                })
        })
});

// delete idea
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Idea removed successfuly.');
            res.redirect('/ideas');
        })
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})