const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

router.get('/', async(req, res) =>{
    req.session.user_id = undefined;
    return res.redirect('/login');
})

module.exports = router;