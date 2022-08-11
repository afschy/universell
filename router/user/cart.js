const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const cart_api = require('../../database/cart_api');

router.get('/', async(req, res) =>{
    let _cartPosts = await cart_api.getCartPosts(req.session.user_id);
    let _totalCartCostObj = await cart_api.getTotalCartCost(req.session.user_id);
    let _totalCartCost = 0;
    if(_totalCartCostObj[0].TOTALCOST != null)
        _totalCartCost = _totalCartCostObj[0].TOTALCOST;

    const binds = {
        cartPosts: _cartPosts,
        totalCost: _totalCartCost,
        PageName: "cart"
    };
    res.render('userCartPage.ejs', binds);
});

router.post('/removepost', async(req, res) =>{
    let post_id = req.body.POST_ID;
    await cart_api.deleteFromCart(req.session.user_id, post_id);
    res.redirect('/cart');
});

router.post('/validate', async(req, res) =>{
    console.log(req.body);
    await cart_api.validateCart(req.session.user_id, req.body.phone, req.body.address);
    res.redirect('/');
});

router.post('/addtocart', async(req, res) =>{
    let post_id = req.body.POST_ID;
    await cart_api.addToCart(req.session.user_id, post_id, 1);
    let _cartPosts = await cart_api.getCartPosts(req.session.user_id);
    res.send({cartNum : _cartPosts.length});
});

router.post('/updatecart', async(req, res) =>{
    console.log(req.body);
    await cart_api.updateQuantity(req.session.user_id, req.body.POST_ID, req.body.QUANTITY);
    res.redirect('/');
});

module.exports = router;