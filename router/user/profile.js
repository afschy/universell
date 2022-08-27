const express = require('express');
const path = require('path');

const router = express.Router({mergeParams: true});

const product_api = require('../../database/product_api');
const post_api = require('../../database/post_api');
const auth_api = require('../../database/auth_api');
const user_api = require('../../database/user_api');

router.get('/:option', async(req, res) =>{
    let _userInfo = await auth_api.getInfoById(req.session.user_id);
    let _posts = await user_api.getPostsByID(req.session.user_id);
    let _reviews = await user_api.getReviewsByID(req.session.user_id);
    
    const binds = {
        userInfo: _userInfo,
        posts: _posts,
        reviews: _reviews,
        PageName: req.params.option
    };

    res.render('userProfilePage', binds);
});



router.post('/createpost', async(req, res) =>{
    let description = req.body.DESCRIPTION;
    let price = req.body.PRICE;
    let rem_quantity = req.body.REM_QUANTITY;
    let negotiable = req.body.NEGOTIABLE;
    let productName = req.body.PRODUCTNAME;
    console.log(productName);

    let productInfo = await product_api.getProductInfoByName(productName);
    console.log(productInfo);
    let productID = await productInfo.PRODUCT_ID;

    await post_api.createNewPost(description, price, rem_quantity, negotiable, req.session.user_id, productID);
});

module.exports = router;