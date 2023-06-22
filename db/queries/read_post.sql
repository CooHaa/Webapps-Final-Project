-- Reads post with specified id
SELECT posts.post_id, posts.title, posts.body, posts.subject, posts.likes, posts.resolved, posts.poster_address, posts.poster_username FROM posts
WHERE
    posts.post_id = ?;