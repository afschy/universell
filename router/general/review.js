const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const review_api = require('../../database/review_api');

router.post('/toggleupvote', async(req, res) =>{
    let review_id = req.body.REVIEW_ID;
    let hasUpvotedReview = req.body.HASUPVOTEDREVIEW;

    console.log(review_id);
    console.log(hasUpvotedReview);

    if(hasUpvotedReview == 1)
        await review_api.addUpvote(req.session.user_id, review_id);
    else
        await review_api.removeUpvote(req.session.user_id, review_id);

    let post_id = req.body.POST_ID;
    let contentType = req.body.CONTENTTYPE;
    res.redirect('/posts/' + post_id + '/' + contentType);
});

router.post('/newreview', async(req, res) =>{
    let post_id = req.body.POST_ID;
    let text = req.body.TEXT;
    let image = null;
    let num_stars = req.body.STARS;

    await review_api.addReview(req.session.user_id, post_id, text, image, num_stars);

    let contentType = req.body.CONTENTTYPE;
    res.redirect('/posts/' + post_id + '/' + contentType);
})

module.exports = router;