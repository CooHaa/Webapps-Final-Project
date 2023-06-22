-- Reads all replies to a specified post
SELECT replies.reply_id, replies.body, replies.likes, replies.poster_username FROM replies
WHERE
    replies.parent_id = ?
ORDER BY replies.timestamp;