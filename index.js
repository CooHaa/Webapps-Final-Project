// App
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');

// Middleware
const logger = require('morgan');
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : false}));

// EJS config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Database
const db = require('./db/db_pool.js');
const fs = require('fs');
const read_all_posts = fs.readFileSync(path.join(__dirname, "db", "queries", "read_all_posts.sql"), {encoding: 'utf-8'});
const read_all_unresolved = fs.readFileSync(path.join(__dirname, "db", "queries", "read_all_unresolved.sql"), {encoding: 'utf-8'});
const read_all_resolved = fs.readFileSync(path.join(__dirname, "db", "queries", "read_all_resolved.sql"), {encoding: 'utf-8'});
const read_post = fs.readFileSync(path.join(__dirname, "db", "queries", "read_post.sql"), {encoding: 'utf-8'});
const read_replies = fs.readFileSync(path.join(__dirname, "db", "queries", "read_replies.sql"), {encoding: 'utf-8'});
const submit_post = fs.readFileSync(path.join(__dirname, "db", "queries", "submit_post.sql"), {encoding: 'utf-8'});
const submit_reply = fs.readFileSync(path.join(__dirname, "db", "queries", "submit_reply.sql"), {encoding: 'utf-8'});
const like_post = fs.readFileSync(path.join(__dirname, "db", "queries", "like_post.sql"), {encoding: 'utf-8'});
const like_reply = fs.readFileSync(path.join(__dirname, "db", "queries", "like_reply.sql"), {encoding: 'utf-8'});


// Auth0
const dotenv = require('dotenv');
dotenv.config();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};
app.use(auth(config));

// Auth info middleware
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
});


// Routing
app.get("/", async (req, res) => {

    try {
        let unresolvedPostsPromise = db.execute(read_all_unresolved);
        let resolvedPostsPromise = db.execute(read_all_resolved);

        let [[unresolved], [resolved]] = await Promise.all([unresolvedPostsPromise, resolvedPostsPromise]);
        console.log(unresolved);
        console.log(resolved);
        res.render("mainboard", {unresolved : unresolved, resolved : resolved});
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    
});

app.get("/post/:id", async (req, res) => {

    try {
        let parentPostPromise = db.execute(read_post, [req.params.id]);
        let repliesPromise = db.execute(read_replies, [req.params.id]);

        let [[post], [replies]] = await Promise.all([parentPostPromise, repliesPromise]);
        console.log(post);
        console.log(replies);
        res.render("post", {post : post, replies : replies});    
    } 
    catch (error) {
        res.status(500).send(error);
    }
});

app.get("/post/:id/like", async (req, res) => {
    try {
        let [results] = await db.execute(like_post, [req.params.id]);
        console.log(results);
        res.redirect(`/post/${req.params.id}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get("/post/:id/:replyid/like", async (req, res) => {
    try {
        let [results] = await db.execute(like_reply, [req.params.replyid, req.params.id]);
        console.log(results);
        res.redirect(`/post/${req.params.id}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.post("/post/:id/reply", async (req, res) => {
    try {
        let [results] = await db.execute(submit_reply, [req.body.reply_body, req.params.id, req.oidc.user.email, req.oidc.user.name]);
        console.log(results);
        res.redirect(`/post/${req.params.id}`);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get("/addpost", (req, res) => {
    res.render("addpost");
});

app.post("/addpost", async (req, res) => {
    try {
        let [post_results] = await db.execute(submit_post, [req.body.title, req.body.body, req.body.subject, req.oidc.user.email, req.oidc.user.name]);
        console.log(post_results);
        res.redirect(`/post/${post_results.insertId}`);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


app.listen(8080, () => {
    console.log(`Listening on port ${port}`);
});