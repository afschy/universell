const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const user_api = require('../../database/user_api');
const post_api = require('../../database/post_api');
const cart_api = require('../../database/cart_api');

router.get('/', async(req, res) => {
    console.log("hi");
    let text = req.query.text.toString();
    let sortBy = req.query.sortBy.toString(); // PRICE or TIME or NEGOTIABLE 
    let sortType = req.query.sortType.toString(); // ASC or DESC

    let result = await post_api.searchForPost(text, sortBy, sortType);

    let allPosts = result.productMatch;
    allPosts = allPosts.concat(result.descriptionMatch);
    allPosts = allPosts.concat(result.tagMatch);

    let _cartPosts = await cart_api.getCartPosts(req.session.user_id);
    
    const binds = {
        allPosts : allPosts,
        PageName: "home",
        cartNum : _cartPosts.length
    };

    res.render('userSearchPage.ejs', binds);

});

module.exports = router;