const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const post_api = require('../../database/post_api');
const review_api = require('../../database/review_api');
const cmnt_api = require('../../database/cmnt_api');
const cart_api = require('../../database/cart_api');

router.get('/:post_id/:option', async(req, res) =>{
    let _postInfo = await post_api.getAllInfo(req.params.post_id);
    let _hasUpvotedPost = await post_api.hasUpvotedPost(req.session.user_id, req.params.post_id);
    
    let _images = await post_api.getImages(req.params.post_id);
    if(_images.length == 0)
        _images.push({IMAGE: '/images/post_placeholder.jpg'});

    let _reviews = await review_api.getAllReviewsForPost(req.session.user_id, req.params.post_id);
    let _comments = await cmnt_api.getAllCommentsForPost(req.session.user_id, req.params.post_id);
    let _cartPosts = await cart_api.getCartPosts(req.session.user_id);
    
    const binds = {
        postInfo: _postInfo,
        hasUpvotedPost: _hasUpvotedPost,
        images: _images,
        reviews: _reviews,
        comments: _comments,
        PageName: "home",
        cartNum : _cartPosts.length,
        commentToggler : 1,
        reviewToggler : 1
    }
    res.render('postPage.ejs', binds);
});

router.post('/toggleupvote', async(req, res) =>{
    let post_id = req.body.POST_ID;
    let hasUpvotedPost = req.body.HASUPVOTEDPOST;
    let contentType = req.body.CONTENTTYPE;

    console.log(post_id);
    console.log(hasUpvotedPost);
    console.log(contentType);
    console.log(req.session.user_id);

    if(hasUpvotedPost == 1)
        await post_api.addUpvote(req.session.user_id, post_id);
    else
        await post_api.removeUpvote(req.session.user_id, post_id);

    res.redirect('/posts/' + post_id + '/' + contentType);
});

module.exports = router;