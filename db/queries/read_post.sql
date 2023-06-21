-- Reads post with specified id
SELECT posts.post_id, posts.title, posts.body, posts.subject, posts.likes, posts.resolved, users.username FROM posts
JOIN users
    ON posts.poster_id = users.user_id
WHERE
    posts.post_id = ?;