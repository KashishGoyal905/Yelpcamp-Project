// requiring express router
const express = require('express');
const router = express.Router();
// requiring user modules
const User = require('../models/user');
// requiring catchAsync validateForm
const catchAsync = require('../utils/catchAsync');
// requirring passport
const passport = require('passport');
// exporting user controller file
const users = require('../controllers/users');


router.route('/register')
    // simple get route form
    .get(users.renderRegister)
    // form route post req
    .post( catchAsync(users.register));

router.route('/login')
    .get( users.renderLogin)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

// exporting 
module.exports = router;
