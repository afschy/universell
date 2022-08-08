const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});
const loginRouter = require('./auth/login');
const signupRouter = require('./auth/signup');

router.get('/', (req, res) =>{
    if(!req.session.user_id){
        console.log("Not logged in, redirecting to login page");

        // NOTE : login page rendering  res.render('userLoginPage', {PageName : "login"}); 
        // NOTE : signup page rendering res.render('userSignUpPage', {PageName : "signup"});
        res.render('userSignUpPage', {PageName : "signup"});
    }
    else console.log("homepage of user " + req.session.user_id);
    // TODO: send homepage
    res.sendFile(path.resolve(__dirname + '../../public/html/homepage.html'));
});

router.use('/login', loginRouter);
router.use('/signup', signupRouter);

module.exports = router;