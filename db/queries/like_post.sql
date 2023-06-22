-- Add a like to a parent post
UPDATE posts
SET likes = likes + 1
wHERE post_id = ?;