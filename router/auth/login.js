const express = require('express');
const bcrypt = require('bcrypt');

const authUtils = require('../../utils/authUtils');
const router = express.Router({mergeParams: true});
const authApi = require('../../database/auth_api');

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
    if(req.user == null){
        // TODO: take input and login user
        let results, errors = [];
        results = await authApi.getInfoById(req.body.user_id);
    }

    else res.redirect('/');
});

module.exports = router;