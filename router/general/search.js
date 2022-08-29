const express = require('express');
const path = require('path');
const router = express.Router({mergeParams: true});

const post_api = require('../../database/post_api');

router.get('/', async(req, res) =>{
    let text = req.query.text.toString();
    let sortBy = req.query.sortBy.toString(); // PRICE or TIME or NEGOTIABLE 
    let sortType = req.query.sortType.toString(); // ASC or DESC
    // console.log(text);
    // console.log(sortBy);
    // console.log(sortType);

    let result = await post_api.searchForPost(text, sortBy, sortType);
    // console.log(result.productMatch);
    // console.log(result.descriptionMatch);
    const binds = {
        productMatch: result.productMatch,
        descriptionMatch: result.descriptionMatch
    };
});

module.exports = router;