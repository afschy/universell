const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});
const authApi = require('../../database/auth_api');

router.get('/', (req, res) =>{
    //TODO: send signup page
});

router.post('/', async(req, res) =>{
    console.log(req.body.fname);
    console.log(req.body.lname);
    console.log(req.body.phone);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.cpassword);
    console.log(req.body.isChecked);
    //IMPORTANT: the names of the form elements sent must exactly match the variable names after req.body.
    await authApi.inputUser(req.body.user_id, req.body.password, req.body.name, req.body.email, req.body.dp);
    req.session.user_id = req.body.user_id;
    res.redirect('/');
});

module.exports = router;