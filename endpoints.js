const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { getPost, followUser, unfollowUser, getUser, addPost, 
    deletePost, likePost, unlikePost, comment, getAllPosts, authenticateUser } = require('./queries.js')

let USERID;

const jwtMiddleWare = (req, res, next) => {
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
            return res.status(403).json({'Message': 'Invalid token | User is not authenticated !'});
        }
        
        USERID = user.id;

        next();
    });
}

router.use(jwtMiddleWare);

router.get('/user', async (req, res) => {
    res.json(await getUser(USERID));
})

router.post('/posts', async (req, res) => {
    const post = req.body;
    res.json(await addPost(USERID, post));
})

router.post('/follow/:id', async (req, res) => {
    const followingid = Number(req.params.id);
    res.json(await followUser(followingid, USERID));
})

router.post('/unfollow/:id', async (req, res) => {
    const followingid = Number(req.params.id);
    res.json(await unfollowUser(followingid, USERID));
})

router.delete('/posts/:id', async (req, res) => {
    const deleteid = Number(req.params.id);
    res.json(await deletePost(deleteid, USERID));
})

router.post('/like/:id', async (req, res) => {
    const postid = Number(req.params.id);
    res.json(await likePost(postid, USERID));
})

router.post('/unlike/:id', async (req, res) => {
    const postid = Number(req.params.id);
    res.json(await unlikePost(postid, USERID));
})

router.post('/comment/:id', async (req, res) => {
    const postid = Number(req.params.id);
    const userComment = req.body.comment;
    res.json(await comment(postid, userComment, USERID));
})

router.get('/posts/:id', async (req, res) => {
    const postid = Number(req.params.id);
    res.json(await getPost(postid));
})

router.get('/all_posts/', async (req, res) => {
    res.json(await getAllPosts(USERID));
})

module.exports = router;