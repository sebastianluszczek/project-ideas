const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');


// load model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// add idea route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// edit idea route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        })
});

// idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
            user: req.user.id
        })
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
router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            // permission check
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                // new values
                idea.title = req.body.title;
                idea.details = req.body.details;

                idea.save()
                    .then(idea => {
                        req.flash('success_msg', 'Idea updated successfuly.');
                        res.redirect('/ideas')
                    })
            }
        })
});

// delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Idea removed successfuly.');
            res.redirect('/ideas');
        })
});

module.exports = router;