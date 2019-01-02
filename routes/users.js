const express = require('express');
const router = express.Router();

// user login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// user register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// handle register form
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({
            msg: 'Passwords should match'
        })
    }

    if (req.body.password.length < 4) {
        errors.push({
            msg: 'Passwords have to be at least 4 characters long'
        })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        res.send('registered')
    }
})

module.exports = router;