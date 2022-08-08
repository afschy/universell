const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});
const authApi = require('../../database/auth_api');

router.get('/', (req, res) =>{
    if(!req.session.user_id){
        console.log("in login page");
        // TODO: send the login page
        res.sendFile(path.resolve(__dirname+'../../../public/html/login.html'));
    }
    else{
        return res.redirect('/');
    }
});

router.post('/', async(req, res) =>{
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.isChecked);

    if(!req.session.user_id){
        // TODO: send post request form login page
        // post request must contain fields user_id and password
        let results = [], errors = [];
        results = await authApi.getInfoById(req.body.user_id);
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
        
    }

    else res.redirect('/');
});

module.exports = router;