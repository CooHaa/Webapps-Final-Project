-- Submits a new post to the board
INSERT INTO posts
    (`title`, `body`, `subject`, `poster_address`, `poster_username`)
VALUES
    (?, ?, ?, ?, ?);