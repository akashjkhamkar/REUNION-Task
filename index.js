const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { getPost, followUser, unfollowUser, getUser, addPost, 
  deletePost, likePost, unlikePost, comment, getAllPosts } = require('./queries.js')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const USERID = 8;

app.get('/', async (req, res) => {
  res.json({'Message': 'Hii! This is Akash', 'App': 'This API was created as an submission to the REUNONS internship task'});
})

app.get('/api/user', async (req, res) => {
  res.json(await getUser(USERID));
})

app.post('/api/posts', async (req, res) => {
  const post = req.body;
  res.json(await addPost(USERID, post));
})

app.post('/api/follow/:id', async (req, res) => {
  const followingid = Number(req.params.id);
  res.json(await followUser(followingid, USERID));
})

app.post('/api/unfollow/:id', async (req, res) => {
  const followingid = Number(req.params.id);
  res.json(await unfollowUser(followingid, USERID));
})

app.delete('/api/posts/:id', async (req, res) => {
  const deleteid = Number(req.params.id);
  res.json(await deletePost(deleteid, USERID));
})

app.post('/api/like/:id', async (req, res) => {
  const postid = Number(req.params.id);
  res.json(await likePost(postid, USERID));
})

app.post('/api/unlike/:id', async (req, res) => {
  const postid = Number(req.params.id);
  res.json(await unlikePost(postid, USERID));
})

app.post('/api/comment/:id', async (req, res) => {
  const postid = Number(req.params.id);
  const userComment = req.body.comment;
  res.json(await comment(postid, userComment, USERID));
})

app.get('/api/posts/:id', async (req, res) => {
  const postid = Number(req.params.id);
  res.json(await getPost(postid));
})

app.get('/api/all_posts/', async (req, res) => {
  res.json(await getAllPosts(USERID));
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log('listening on port', PORT);
})