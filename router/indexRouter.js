const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});
const loginRouter = require('./auth/login');
const signupRouter = require('./auth/signup');
const profileRouter = require('./user/profile');

const user_api = require('../database/user_api');
const post_api = require('../database/post_api');

router.get('/', async(req, res) =>{
    if(!req.session.user_id){
        console.log("Not logged in, redirecting to login page");
        return res.redirect('/login');
    }
    console.log("homepage of user " + req.session.user_id);

    // For card_2
    let _topSellers = await user_api.getTopSellers(5);
    let _starSellers = await user_api.getStarSellers(5);
    let _newPosts = await post_api.getNewPosts(0, 5);
    let _mostReviewdPosts = await post_api.getMostReviewedPosts(0, 5);

    // For card_1
    // TODO: Replace 1 with req.session.user_id
    let wishlistHomepagePosts = await post_api.getWishlistPosts(req.session.user_id, 0, 25);
    let newHomepagePosts = await post_api.getNewPosts(0, 25);
    let _homepagePosts = [...new Set([...wishlistHomepagePosts, ...newHomepagePosts])];

    const binds = {
        PageName: "home",
        topSellers: _topSellers,
        starSellers: _starSellers,
        newPosts: _newPosts,
        mostReviewdPosts: _mostReviewdPosts,
        homePagePosts: _homepagePosts
    };
    res.render('userHomePage.ejs', binds);
    // res.json(binds);
});

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/profile', profileRouter);

module.exports = router;