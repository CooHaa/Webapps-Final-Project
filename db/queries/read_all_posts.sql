-- Reads all posts in post table
SELECT posts.post_id, posts.title, posts.body, posts.subject, posts.likes, posts.resolved, users.username FROM posts
JOIN users
    ON posts.poster_address = users.user_address;