-- Adds a reply to a post
INSERT INTO replies
    (`body`, `parent_id`, `poster_address`, `poster_username`)
VALUES
    (?, ?, ?, ?);