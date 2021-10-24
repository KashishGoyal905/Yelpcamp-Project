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



// simple get route form
router.get('/register', users.renderRegister);

// form route post req
router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout',users.logout);

// exporting 
module.exports = router;
