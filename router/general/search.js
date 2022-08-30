const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const user_api = require('../../database/user_api');
const post_api = require('../../database/post_api');
const cart_api = require('../../database/cart_api');

router.get('/', async(req, res) =>{
    let text = req.query.text.toString();
    let sortBy = req.query.sortBy.toString(); // PRICE or TIME or NEGOTIABLE 
    let sortType = req.query.sortType.toString(); // ASC or DESC

    let result = await post_api.searchForPost(text, sortBy, sortType);
    let _topSellers = await user_api.getTopSellers(5);
    let _starSellers = await user_api.getStarSellers(5);
    let _newPosts = await post_api.getNewPosts(0, 5);
    let _mostReviewdPosts = await post_api.getMostReviewedPosts(0, 5);

    let _homepagePosts = [...new Set([...result.productMatch, ...result.descriptionMatch, ...result.tagMatch])];
    let _cartPosts = await cart_api.getCartPosts(req.session.user_id);

    const binds = {
        PageName: "home",
        topSellers: _topSellers,
        starSellers: _starSellers,
        newPosts: _newPosts,
        mostReviewdPosts: _mostReviewdPosts,
        homePagePosts: _homepagePosts,
        cartNum : _cartPosts.length
        // cart_item needs to be added
    };
    res.render('userHomePage.ejs', binds);
});

module.exports = router;