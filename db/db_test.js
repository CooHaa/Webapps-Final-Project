const db = require("./db_pool");
const fs = require("fs");

const read_all_posts = fs.readFileSync(__dirname + "/queries/read_all_posts.sql", {encoding : "utf-8"});

db.execute("SELECT 1 + 1 AS solution;",
    (error, results) => {
        if (error) throw error;
        console.log(results);
        console.log(`Solution: ${results[0].solution}`);
    }
);

db.execute(read_all_posts, (error, results) => {
    if (error) console.log(error);
    else console.log(results);
});

// db.end();