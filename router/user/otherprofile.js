const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});

const product_api = require('../../database/product_api');
const post_api = require('../../database/post_api');
const auth_api = require('../../database/auth_api');
const user_api = require('../../database/user_api');
const review_api = require('../../database/review_api');

router.get('/:user_id/:option', async(req, res) =>{
    let user_id = req.params.user_id;

    let _userInfo = await auth_api.getInfoById(user_id);
    let _posts = await user_api.getPostsByID(user_id);
    let _reviews = await user_api.getReviewsByID(user_id);
    
    const binds = {
        userInfo: _userInfo,
        posts: _posts,
        reviews: _reviews,
        PageName: req.params.option
    };

    res.render('otherProfilePage', binds);
});

module.exports = router;