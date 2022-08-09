const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});
const authApi = require('../../database/auth_api');

router.get('/', (req, res) =>{
    //TODO: send signup page
    res.render('userSignUpPage', {PageName : "signup"});
});

router.post('/', async(req, res) =>{

    if(req.body.password !== req.body.cpassword){
        res.render('userSignUpPage', {PageName : "signup"});
        return;
    }
    
    let emailSearchResult = await authApi.getInfoByEmail(req.body.email);
    if(emailSearchResult.length != 0){
        res.render('userSignUpPage', {PageName : "signup"});
        return;
    }
    
    await authApi.inputUser(req.body.password, req.body.name, req.body.email);
    let result = await authApi.getInfoByEmail(req.body.email);
    console.log(result);
    
    if(result.length > 0){
        req.session.user_id = result[0].USER_ID;
        res.redirect('/');
        return;
    }
    else
        res.render('userSignUpPage', {PageName : "signup"});
});

module.exports = router;