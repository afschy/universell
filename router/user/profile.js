const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});

router.get('/', async(req, res) =>{
    res.render('userProfilePage', {PageName: 'profile'});
});

module.exports = router;