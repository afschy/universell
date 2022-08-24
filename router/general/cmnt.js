const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const cmnt_api = require('../../database/cmnt_api');

router.post('/toggleupvote', async(req, res) =>{
    let cmnt_id = req.body.CMNT_ID;
    let hasUpvotedCmnt = req.body.HASUPVOTEDCMNT;

    if(hasUpvotedCmnt == 1)
        cmnt_api.addUpvote(req.session.user_id, cmnt_id);
    else
        cmnt_api.removeUpvote(req.session.user_id, cmnt_id);

    let post_id = req.body.POST_ID;
    let contentType = req.body.CONTENTTYPE;
    res.redirect('/posts/' + post_id + '/' + contentType);
});

router.post('/newcmnt', async(req, res) =>{
    let post_id = req.body.POST_ID;
    let text = req.body.TEXT;
    let image = req.body.IMG;

    cmnt_api.addReview(req.session.user_id, post_id, text, image);

    let contentType = req.body.CONTENTTYPE;
    res.redirect('/posts/' + post_id + '/' + contentType);
})


module.exports = router;