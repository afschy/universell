const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});
const authApi = require('../../database/auth_api');

router.get('/', (req, res) =>{
    if(!req.session.user_id){
        //console.log("in login page");
        // NOTE : login page rendering  res.render('userLoginPage', {PageName : "login"}); 
        // NOTE : signup page rendering res.render('userSignUpPage', {PageName : "signup"});
        res.render('userSignUpPage', {PageName : "login"});
    }
    else{
        return res.redirect('/');
    }
});

router.post('/', async(req, res) =>{
    // console.log(req.body.email);
    // console.log(req.body.password);
    // console.log(req.body.isChecked);

    if(!req.session.user_id){
        let results = [], errors = [];
        results = await authApi.getInfoByEmail(req.body.email);
        if(results.length == 0)
            errors.push("invalid user id");
        else{
            if(results[0].PASSWORD == req.body.password)
                req.session.user_id = results[0].USER_ID;
            else
                errors.push("invalid password");
        }

        if(errors.length == 0){ // login succesful, redirect to homepage
            res.redirect('/');
            return;
        } 

        // TODO: handle errors in case of login failure
        res.render('userSignUpPage', {PageName : "login", errors: errors});
    }

    else res.redirect('/');
});

module.exports = router;