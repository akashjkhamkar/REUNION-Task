const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { getPost, followUser, unfollowUser, getUser, addPost, 
    deletePost, likePost, unlikePost, comment, getAllPosts } = require('../queries.js')

// id of the authenticated user
let USERID;

// middleware to authenticate the users using token
const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(403).json({'Message': 'Authorization headers were not found | User is not authenticated !'});
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(403).json({'Message': 'Token is not provided | User is not authenticated !'});
    }

    jwt.verify(token, 'secretstuff', function(err, user) {
        if(err){
            console.log(err);
            return res.status(403).json({'Message': 'Token is either invalid or has expired | User is not authenticated !'});
        }
        
        USERID = user.id;
        next();
    });
}

// middleware to check the paramers passed, and make sure they are numbers
const paramsMiddleware = (req, res, next) => {
    const id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({'message': 'parameter passed should be a number'});
    }

    req.params.id = id;
    next();
}

// all the routes registered on this router will use the authentication middleware
router.use(jwtMiddleware);

router.get('/user', async (req, res) => {
    res.json(await getUser(USERID));
})

router.post('/posts', async (req, res) => {
    const post = req.body;
    res.json(await addPost(USERID, post));
})

router.post('/follow/:id', paramsMiddleware, async (req, res) => {
    const followingid = req.params.id;
    res.json(await followUser(followingid, USERID));
})

router.post('/unfollow/:id', paramsMiddleware, async (req, res) => {
    const followingid = req.params.id;
    res.json(await unfollowUser(followingid, USERID));
})

router.delete('/posts/:id', paramsMiddleware, async (req, res) => {
    const deleteid = req.params.id;
    res.json(await deletePost(deleteid, USERID));
})

router.post('/like/:id', paramsMiddleware, async (req, res) => {
    const postid = req.params.id;
    res.json(await likePost(postid, USERID));
})

router.post('/unlike/:id', paramsMiddleware, async (req, res) => {
    const postid = req.params.id;
    res.json(await unlikePost(postid, USERID));
})

router.post('/comment/:id', paramsMiddleware, async (req, res) => {
    const postid = req.params.id;
    const userComment = req.body.comment;
    res.json(await comment(postid, userComment, USERID));
})

router.get('/posts/:id', paramsMiddleware, async (req, res) => {
    const postid = req.params.id;
    res.json(await getPost(postid));
})

router.get('/all_posts/', async (req, res) => {
    res.json(await getAllPosts(USERID));
})

module.exports = router;