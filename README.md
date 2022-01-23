# REUNION Backend Task
### Problem Statement
Build APIs for a social media platform in either NodeJS or Python. The API should support features like getting a user profile, follow a user, upload a post, delete a post, like a post, unlike a liked post, and comment on a post. Design the database schema and implement in PostgreSQL.

---
#### Submission
API link - https://reunion-backend-task-akash.herokuapp.com/

---
### Stack used
1. Node.js + Express
2. PSQL | (node-postgres driver)
3. Bcrypt - Encyrpting passwords
4. JWT for authentication

---
### Database Schema
![Db schema](https://github.com/akashjkhamkar/REUNION-Task/raw/master/reunion_db_schema.png)

---
### How to authenticate 
I have added few dummy users in the db, for accessing the protected endpoints. 
Use one of the following to login

> email - admin@admin.com
> password - admin

> email - jake@adventure.com
> password - jake

send request to /api/authenticate to receive the token
,the token must be set in the authorisation header to access the protected endpoints

eg

> GET https://reunion-backend-task-akash.herokuapp.com/api/all_posts/

> Authorization:  Bearer < Enter the token received >

##### Bearer must be added at the beginning of the token

----

### Features
1. Normalised database schema to minimize redundancy
2. Cascading deletes on depandant tables
3. Using pool to make concurrent requests instead of a single client
4. All the operation, even the complex ones also use just a single query, hence reducing the number of queries in the long run
5. Used routers to modularise all the endpoints
6. Middlewares to extract the user id and validate the params
7. Bcrypt to store / compare encrpted passwords
8
---
### Local Installation
set the ENV variable DATABASE_URL to the psql table uri
then just run
> npm start
