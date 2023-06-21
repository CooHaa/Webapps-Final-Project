-- Counts number of replies to a specific post
SELECT COUNT(reply_id) FROM replies
WHERE parent_id = ?;