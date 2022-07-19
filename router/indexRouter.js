const express = require('express');
const router = express.Router({mergeParams: true});
const loginRouter = require('./auth/login');

router.get('/', async(req, res) =>{
    console.log("in homepage");
    if(req.user == null)
        return res.redirect('/login');
    
    // TODO: send homepage
});

router.use('/login', loginRouter);

module.exports = router;