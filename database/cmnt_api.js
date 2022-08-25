const database = require('./database');

async function getAllCommentsForPost(user_id, post_id){
    const sql = `
    SELECT CMNT_ID, TEXT, TIME, IMAGE, WRITER_ID, POST_ID, GET_UPVOTE_COUNT_CMNT(CMNT_ID) AS UPVOUTECOUNT, HAS_UPVOTED_CMNT(:u, CMNT_ID) AS HASUPVOTED, U.NAME AS USERNAME
    FROM CMNT C
    JOIN USERS U ON U.USER_ID = C.WRITER_ID
    WHERE POST_ID = :p
    `;
    const binds = {u: user_id, p: post_id};
    return (await database.execute(sql, binds, database.options)).rows;
}

async function addComment(user_id, post_id, text, image){
    const sql = `
    INSERT INTO CMNT(TEXT, TIME, IMAGE, WRITER_ID, POST_ID)
    VALUES(:t, SYSDATE, :i, :w, :p)
    `;
    const binds = {
        t: text,
        i: image,
        w: user_id,
        p: post_id
    };
    await database.execute(sql, binds, database.options);
}

async function addUpvote(user_id, cmnt_id){
    const sql = `
    INSERT INTO CMNTUPVOTE VALUES(:u, :c)
    `;
    const binds = {u: user_id, c: cmnt_id};
    await database.execute(sql, binds, database.options);
}

async function removeUpvote(user_id, cmnt_id){
    const sql = `
    DELETE FROM CMNTUPVOTE
    WHERE USER_ID = :u AND CMNT_ID = :c
    `;
    const binds = {u: user_id, c: cmnt_id};
    await database.execute(sql, binds, database.options);
}

module.exports = {
    getAllCommentsForPost,
    addComment,
    addUpvote,
    removeUpvote
}