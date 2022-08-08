const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});
const loginRouter = require('./auth/login');
const signupRouter = require('./auth/signup');

router.get('/', (req, res) =>{
    if(!req.session.user_id){
        console.log("Not logged in, redirecting to login page");
        //return res.redirect('/login');
        res.render('userHomePage', {homepage : 1, login : 1});
    }
    else console.log("homepage of user " + req.session.user_id);
    // TODO: send homepage
    res.sendFile(path.resolve(__dirname + '../../public/html/homepage.html'));
});

router.use('/login', loginRouter);
router.use('/signup', signupRouter);

module.exports = router;