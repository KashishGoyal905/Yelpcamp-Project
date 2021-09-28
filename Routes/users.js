const express = require('express');
const router = express.Router();
const user = require('../moedels/user');

router.get('/register',(req, res)=>{
    res.render('users/register')
})


module.exports = router;
