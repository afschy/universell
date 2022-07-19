const express = require('express');
const router = express.Router({mergeParams: true});
const loginRouter = require('./auth/login');

router.get('/', (req, res) =>{
    if(!req.session.user_id){
        console.log("Not logged in, redirecting to login page");
        return res.redirect('/login');
    }
    else console.log("homepage of user " + req.session.user_id);
    // TODO: send homepage

});

router.use('/login', loginRouter);

module.exports = router;