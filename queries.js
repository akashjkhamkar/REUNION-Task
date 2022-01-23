const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'akash',
    host: 'localhost',
    database: 'reunion',
    password: 'password',
    port: 5432,
})

// This file contains functions which are used to perform operations on the db

const getUser = async (userid) => {
    return pool.query(
    `select users.name, count(followers.followerid) as followers,
    (select count(*) from followers where followerid = users.id) as following
    from users left join followers on users.id = followers.userid
    where users.id = $1
    group by users.id;`, [userid])
    .then(results => results.rows[0])
    .catch(e => {
        console.log('getUser() Error: ' + e.message);
        return {'message': 'Internal error'}
    })
}

const addPost = async (userid, post) => {
    return pool.query(
        `INSERT INTO posts(title, description, userid)
        VALUES ($1, $2, $3) RETURNING *;`, [post.title, post.description, userid])
        .then(res => {
            const result = res.rows[0];
            delete result['userid']; 
            return result;
        })
        .catch(e => {
            console.log('addPost() Error: ' + e.message);
            return {'message': 'Internal error'}
        })
}

const deletePost = async (postid, userid) => {
    return pool.query(`
    DELETE FROM posts where userid = $1 AND id = $2`, [userid, postid])
    .then(result => {
        if(result.rowCount === 0){
            return {'message': `user does not have a post with id ${postid}`}
        } else{
            return {'message': `Deleted post ${postid} successfully`}
        }
    })
    .catch(e => {
        console.log('deletePost() Error: ' + e.message);
        return {'message': `Internal error`}
    })
}

const likePost = async (postid, userid) => {
    return pool.query('INSERT INTO likes VALUES($1, $2)', [postid, userid])
    .then(() => {
        return {'message': `Successfully liked the post ${postid}`}
    })
    .catch(e => {
        if(e.code === '23503'){
            return {'message': `Post with id ${postid} does not exist`}
        } else if(e.code === '23505'){
            return {'msg': `Post ${postid} is already liked`}
        } else {
            console.log('likePost() Error: ', e);
            return {'message': `Internal error`};
        }
    })
}

const unlikePost = async (postid, userid) => {
    return pool.query('DELETE FROM likes WHERE postid = $1 AND userid = $2;', [postid, userid])
    .then(results => {
        if(results.rowCount === 0){
            return {'message': `The post ${postid} was never liked`}
        }
        return {'message': `Successfully unliked the post ${postid}`}
    })
    .catch(e => {
        console.log('likePost() Error: ', e);
        return {'message': `Internal error`};
    })
}

const followUser = async (followingid, followerid) => {
    if(followingid === followerid){
        return {'message': "You can't follow yourself"};
    }

    return pool.query('INSERT INTO FOLLOWERS VALUES($1, $2)', [followingid, followerid])
    .then(() => {
        return {'message': 'successfully followed!'}
    })
    .catch(e => {
        if(e.code === '23503'){
            return {'message': `user ${followingid} does not exist !`}
        }else if(e.code === '23505'){
            return {'msg': `already following the user ${followingid}`}
        }else{
            console.log("Following() Error: ", e);
            return {'message': 'Internal server error'}
        }
    })
}

const unfollowUser = async (followingid, followerid) => {
    if(followingid === followerid){
        return {'message': "You can't unfollow yourself"};
    }

    return pool.query('DELETE FROM FOLLOWERS WHERE userid=$1 and followerid=$2', [followingid, followerid])
    .then((results) => {
        if(results.rowCount === 0){
            return {'msg': `You are not following the user ${followingid}`}
        }

        return {'message': 'successfully unfollowed!'}
    })
    .catch(e => {
        console.log("Following() Error: ", e.message);
        return {'message': 'Internal server error'}
    })
}

const comment = async (postid, userComment, userid) => {
    if(!userComment){
        return { 'message': 'Enter a valid comment' }
    }
    
    return pool.query('INSERT INTO comments(postid, userid, comment) VALUES($1, $2, $3) RETURNING id;', [postid, userid, userComment])
    .then(results => {
        return { 'message': `Successfully added the comment on the post ${postid}`, 'Comment_id': results.rows[0] }
    })
    .catch(e => {
        if(e.code === '23503'){
            return { 'message': `There is no post with id ${postid}`}
        }else{
            console.log('commment() Error: ', e.message);
            return { 'message': `Intenal error`}
        }
    })
}

const getPost = (postid) => {
    return pool.query(
    `SELECT posts.id, posts.title, posts.description, count(likes.postid) as likes,
    (select count(*) from comments where comments.postid = posts.id) as comments
    from posts left join likes on posts.id = likes.postid
    where posts.id = $1
    group by posts.id;`, [postid])
    .then(results => {
        if(results.rowCount === 0){
            return {'message': `There is no post with id ${postid}`};
        }

        return results.rows[0];
    })
    .catch(e => {
        console.log('getPost() Error: ', e.message);
        return {'Message': 'Internal error'}
    })
}

const commentsParser = (posts) => {
    return posts.map(post => {
        if(post.comments){
            post.comments = post.comments.split('\n');
        } else {
            post.comments = [];
        }

        return post;
    })
}

const getAllPosts = (userid) => {
    return pool.query(
        `SELECT posts.id, posts.title, posts.description, count(likes.postid) as likes,
        (SELECT string_agg(comment, '\n') FROM comments WHERE comments.postid = posts.id) AS comments
        FROM posts LEFT JOIN likes ON posts.id = likes.postid
        WHERE posts.userid = $1
        GROUP BY posts.id;`, [userid])
        .then(results => {
            const posts = commentsParser(results.rows);
            return posts;
        })
        .catch(e => {
            console.log('getAllPosts() Error: ', e.message);
            return {'Message': 'Internal error'};
        })
}

const authenticateUser = (user) => {
    if(!user.email || !user.password){
        return {'Message': 'Email or Password is not provided'};
    } else if(typeof user.password !== 'string' && typeof user.email !== 'string'){
        return {'Message': 'Email and Password should both be string'};
    }

    let userProfile;

    return pool.query(`SELECT name, id, password FROM users WHERE email = $1;`, [user.email])
    .then((results) => {
        if(results.rowCount === 0){
            return false;
        }

        userProfile = results.rows[0];
        return bcrypt.compare(user.password, userProfile.password)})
    .then(verified => {
        if(verified){
            return { id: userProfile.id, name: userProfile.name };
        }
        
        return false;
    })
    .catch(e => {
        console.log('Bcrypt Error: ', e);
    });
}

module.exports = {
    followUser,
    unfollowUser,
    getUser,
    addPost,
    deletePost,
    likePost,
    unlikePost,
    comment,
    getPost,
    getAllPosts,
    authenticateUser
}