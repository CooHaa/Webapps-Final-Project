-- Reads all unresolved posts in post table
SELECT posts.post_id, posts.title, posts.body, posts.subject, posts.likes, posts.resolved, posts.poster_username FROM posts
WHERE 
    posts.resolved = 0
ORDER BY posts.timestamp;