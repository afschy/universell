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
        totalCost: _totalCartCost
    };
    res.render('cartPage.ejs', binds);
});

router.post('/removepost', async(req, res) =>{
    let post_id = req.body.POST_ID;
    await cart_api.deleteFromCart(req.session.user_id, post_id);
    res.redirect('/cart');
});

router.post('/validate', async(req, res) =>{
    await cart_api.validateCart(126, '01798081016', 'BUET, DHAKA, BANGLADESH');
    res.redirect('/');
});

module.exports = router;