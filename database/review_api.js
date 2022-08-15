const database = require('./database');

async function getAllReviewsForPost(user_id, post_id){
    const sql = `
    SELECT REVIEW_ID, R.USER_ID AS USER_ID, U.NAME AS USERNAME, POST_ID, TEXT, IMAGE, NUM_STARS, GET_UPVOTE_COUNT_REVIEW(REVIEW_ID) AS UPVOTECOUNT,
    HAS_UPVOTED_REVIEW(:u, REVIEW_ID) AS HASUPVOTED
    FROM REVIEW R
    JOIN USERS U ON U.USER_ID = R.USER_ID
    WHERE POST_ID = :p
    `;
    const binds = {u: user_id, p: post_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function addReview(user_id, post_id, text, image, num_stars){
    const sql = `
    INSERT INTO REVIEW(USER_ID, POST_ID, TEXT, IMAGE, NUM_STARS)
    VALUES(:u, :p, :t, :i, :n)
    `;
    const binds = {
        u: user_id,
        p: post_id,
        t: text,
        i: image,
        n: num_stars
    };
    await database.execute(sql, binds, database.options);
}

async function addUpvote(user_id, review_id){
    const sql = `
    INSERT INTO REVIEWUPVOTE VALUES(:u, :r)
    `;
    const binds = {u: user_id, r: review_id};
    await database.execute(sql, binds, database.options);
}

async function removeUpvote(user_id, review_id){
    const sql = `
    DELETE FROM REVIEWUPVOTE
    WHERE USER_ID = :u AND REVIEW_ID = :r
    `;
    const binds = {u: user_id, r: review_id};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getAllReviewsForPost,
    addReview,
    addUpvote,
    removeUpvote
}