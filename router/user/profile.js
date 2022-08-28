const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});

const product_api = require('../../database/product_api');
const post_api = require('../../database/post_api');
const auth_api = require('../../database/auth_api');
const user_api = require('../../database/user_api');
const review_api = require('../../database/review_api');

router.get('/:option', async(req, res) =>{
    let _userInfo = await auth_api.getInfoById(req.session.user_id);
    let _posts = await user_api.getPostsByID(req.session.user_id);
    let _reviews = await user_api.getReviewsByID(req.session.user_id);
    let _allProducts = await product_api.getAllProducts(req.session.user_id);
    let _allTags = await product_api.getAllTags(req.session.user_id);
    let _allSellTransactions = await user_api.getAllSellTransactions(req.session.user_id);
    let _allBuyTransactions = await user_api.getAllBuyTransactions(req.session.user_id);
    
    const binds = {
        userInfo: _userInfo,
        posts: _posts,
        reviews: _reviews,
        PageName: req.params.option,
        allProducts: _allProducts,
        allTags: _allTags,
        allSellTransactions: _allSellTransactions,
        allBuyTransactions: _allBuyTransactions
    };

    res.render('userProfilePage', binds);
});

router.post('/createpost', async(req, res) =>{
    let description = req.body.DESCRIPTION;
    let price = req.body.PRICE;
    let rem_quantity = req.body.REM_QUANTITY;
    let negotiable = req.body.NEGOTIABLE;
    let productName = req.body.PRODUCTNAME;

    let productInfo = await product_api.getProductInfoByName(productName);
    let productID = await productInfo.PRODUCT_ID;

    await post_api.createNewPost(description, price, rem_quantity, negotiable, req.session.user_id, productID);
    let currPost = await post_api.getNewPosts(0, 1);
    
    let img = req.body.IMG_URL;
    img = img.split(/\r?\n/);
    for(let i=0; i<img.length; i++)
        await post_api.addPostImage(currPost[0].POST_ID, img[i]);
    
    res.redirect('/profile/posts');
});

router.post('/togglewishlist', async(req, res) =>{
    let product_id = req.body.PRODUCT_ID;
    let hasWishlisted = req.body.HAS_WISHLISTED;
    if(hasWishlisted == 1)
        await product_api.addToWishlist(req.session.user_id, product_id);
    else
        await product_api.removeFromWishlist(req.session.user_id, product_id);
});

router.post('/togglefollow', async(req, res) =>{
    let tag_id = req.body.TAG_ID;
    let hasFollowd = req.body.HAS_FOLLOWED;
    if(hasFollowd == 1)
        await product_api.addToFollow(req.session.user_id, tag_id);
    else
        await product_api.removeFromFollow(req.session.user_id, tag_id);
});

router.post('/deletepost', async(req, res) =>{
    let post_id = req.body.POST_ID;
    await post_api.deletePost(post_id);
});

router.post('/deletereview', async(req, res) =>{
    let review_id = req.body.REVIEW_ID;
    await review_api.deleteReview(review_id);
});

router.post('/updateprofile', async(req, res) =>{
    let email = req.body.EMAIL;
    let password = req.body.PASSWORD;
    let confirm_password = req.body.CONFIRM_PASSWORD;
    let profile_picture = req.body.PROFILE_PICTURE;
    
    if(email.length > 0) await auth_api.updateEmail(req.session.user_id, email);
    if(password.length > 0 && password === confirm_password) await auth_api.changePassword(req.session.user_id, password);
    if(profile_picture.length > 0) await auth_api.changeDP(req.session.user_id, profile_picture);
});

router.post('/approve', async(req, res) =>{
    let order_id = req.body.ORDER_ID;
    await user_api.validateOrder(order_id);
});

module.exports = router;