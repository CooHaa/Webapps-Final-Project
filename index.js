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

// // Views, ejs
// app.set("views", path.join(__dirname, "views"));

// Routing
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/mainboard.html");
});

app.get("/post", (req, res) => {
    res.sendFile(__dirname + "/post.html");
});

app.listen(8080, () => {
    console.log(`Listening on port ${port}`);
});