# Social App
# Description
This project is a backend application built using Node.js, Express, and MongoDB. It provides functionalities for user authentication, creating, deleting, updating posts, following other users, scrolling through feed, update profile details such as profile picture, change password, bio update etc and many more.

# Features
- User Authentication: Users can sign up and log in securely.
- Create Post: Authenticated users can create posts.
- Follow Profiles: Users can follow other profiles.
- Feed Scroll: Users can scroll through their feed to view posts from profiles they follow.
- Update profile details: Users can change password, profile picture and bio.

# Important npm packages used
- JSON Web Tokens (jwt): Used for secure authentication and authorization.
- Bcrypt.js: Library used for hashing passwords for enhanced security.
- Zod validator: Used for validating Schema.
- cloudinary: Used to store image files.
- multer: Used as middleware for uploading files
- uuid: To generate unique ID's.

# Installation
1. Clone this repository to your local machine.
2. Create a `.env` file and add the following variables:
    - `PORT`: The port number for the server (default is 8000).
    - `MONGODB_URI`: The connection string for MongoDB (I have used MongoDB Atlas).
    - `ACCESS_TOKEN_SECRET`: The secret key for generating JSON web tokens for authentication.
    - `ACCESS_TOKEN_EXPIRY`:The life span of jwt (for example, 1d)
    - `CLOUDINARY_CLOUD_NAME`: The name of your cloudinary profile
    - `CLOUDINARY_API_KEY`:The Api key of Cloudinary
    - `CLOUDINARY_API_SECRET`:The Secret key of cloudinary
4. Run `node server.js` to start the development server.
5. Open Postman to hit enpoints of RESTAPI.

# Deployment
The project is deployed on render platform on the url `https://socialapp-2b76.onrender.com`.

# API Endpoints
- `https://socialapp-2b76.onrender.com/api/v1/users` is the primary url.
- `/register` : user registration
- `/login` : user login
- `/logout` : logout user
- `/getSingleUser` : get current user data
- `/changepassword` : change password
- `/updateProfilePic` : update profile pic
- `/updatebio` : update profile bio
- `/post/createpost` : To create post
- `/post/feed` : get user feed
- `/post/detete-post/:id` : delete specific post
- `/post/getAllPosts` : to see all post
- `/post/updatepost/:id` : to update single post
- `/follow/getUsers` : get all user profiles
- `/follow/followUser/:id` : to follow a particular profile
- `/follow/getfollowers` : to get all the followers
- `/follow/getfollowing` : to get all the user following

# Usage
It can be used for social networking sites where the goal is to explore post, connecting people, publish a post.
