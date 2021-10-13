const express = require('express');
const router = express.Router();
const user = require('../models/user');

router.get('/register',(req, res)=>{
    res.render('users/register')
});

router.post('/register', async(req, res)=>{
    
})


module.exports = router;
