const express = require('express');
const bcrypt = require('bcrypt');

const authUtils = require('../../utils/authUtils');
const router = express.Router({mergeParams: true});

router.get('/', (req, res) =>{
    if(req.user == null){
        console.log("in login page");
        // TODO: send the login page
    }
    else{
        return res.redirect('/');
    }
});

router.post('/', async(req, res) =>{
    // TODO: take input and login user
});

module.exports = router;