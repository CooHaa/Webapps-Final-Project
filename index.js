// App
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');

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

// Routing
app.get("/", async (req, res) => {

    // Callback implementation

    // db.execute(read_all_unresolved, (error1, results1) => {
    //     if (error1) res.status(500).send(error);
    //     else {
    //         db.execute(read_all_resolved, (error2, results2) => {
    //             if (error2) res.status(500).send(error);
    //             else res.render("mainboard", {unresolved : results1, resolved : results2});
    //         });
    //     }
    // });

    // async/await implementation

    try {
        let unresolvedPostsPromise = db.execute(read_all_unresolved);
        let resolvedPostsPromise = db.execute(read_all_resolved);

        let [[unresolved], [resolved]] = await Promise.all([unresolvedPostsPromise, resolvedPostsPromise]);
        res.render("mainboard", {unresolved : unresolved, resolved : resolved});
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
    
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.get("/post/:id", async (req, res) => {

    // Callback implementation

    // db.execute(read_post, [req.params.id], (error, results) => {
    //     if (error) res.status(500).send(error)
    //     else if (results.length == 0) res.status(404).send(`No post found with id ${req.params.id}`);
    //     else {
    //         res.render("post", {post : results});
    //         console.log(results);
    //     } 
    // });

    // async/await implementation

    try {
        let [post] = await db.execute(read_post, [req.params.id]);
        res.render("post", {post : post});    
    } 
    catch (error) {
        res.status(500).send(error);
    }


});

app.get("/addpost", (req, res) => {
    res.render("addpost");
});

app.listen(8080, () => {
    console.log(`Listening on port ${port}`);
});