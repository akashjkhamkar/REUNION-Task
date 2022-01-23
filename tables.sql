CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);

CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    Title TEXT NOT NULL,
    Description TEXT NOT NULL,
    Userid INTEGER REFERENCES Users
);

CREATE TABLE Likes (
    Postid INTEGER,
    Userid INTEGER REFERENCES Users,
    CONSTRAINT constraint1
    FOREIGN KEY(Postid) 
    REFERENCES Posts
    ON DELETE CASCADE
);

CREATE TABLE Comments (
    Postid INTEGER,
    Userid INTEGER REFERENCES Users,
    Comment TEXT NOT NULL,
    CONSTRAINT constraint1
    FOREIGN KEY(Postid) 
    REFERENCES Posts
    ON DELETE CASCADE
);

CREATE TABLE Followers (
    Userid INTEGER REFERENCES Users,
    Followerid INTEGER REFERENCES Users
);

-- TODO : Sanitization

-- 1. 
-- user info + followers and followings 
-- (using joins + subquries)
select users.name, count(followers.followerid) as followers,
(select count(*) from followers where followerid = users.id) as following
from users left join followers on users.id = followers.userid
where users.id = 10
group by users.id;

-- (using subqueries)
select users.name, 
(select count(*) from followers where users.id = followers.userid) as followers,
(select count(*) from followers where users.id = followers.followerid) as following from users;

-- 2.
-- for finding the info of the post and the likes/comments count
select posts.id, posts.title, posts.description, count(likes.postid) as likes,
(select count(*) from comments where comments.postid = posts.id) as comments
from posts left join likes on posts.id = likes.postid
where postst.id = 4
group by posts.id;

-- 3.
-- Liking
SELECT 1 FROM followers WHERE userid = 1 and followerid = 2;

-- use the result to determine whether to insert or not

-- 4.
-- Get all the posts made by the user
-- unreadable version
select posts.id, posts.title, posts.description, count(likes.postid) as likes,
(select string_agg(comment, '\n') from comments where comments.postid = posts.id) as comments
from posts left join likes on posts.id = likes.postid
where posts.userid = 1
group by posts.id;

-- 2 queries needed, but more readable
-- get the results, use the ids to get the comments
-- combine the results and send to the user
select posts.id, posts.title, posts.description, posts.date, count(likes.postid) as likes
from posts left join likes on posts.id = likes.postid
where posts.userid = 1
group by posts.id;

-- 5.
-- insert the comment and return the id
insert into comments(postid, comment, userid) values(9, 'scary stuff indeed', 12) returning id;