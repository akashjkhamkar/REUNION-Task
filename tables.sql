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
    UNIQUE (Postid, Userid),
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
    Followerid INTEGER REFERENCES Users,
    UNIQUE (Userid, Followerid),
);