-- Likes a specific reply
UPDATE replies
SET likes = likes + 1
WHERE reply_id = ? AND parent_id = ?;