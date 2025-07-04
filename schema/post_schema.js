export const CREATE_POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS posts (  
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(100) NOT NULL,
    likes INT default 0,
    dislikes INT default 0,
    description TEXT
);
`;

export const DROP_POSTS_TABLE = `
DROP TABLE IF EXISTS posts;
`;

export const USER_TABLE=`
CREATE TABLE IF NOT EXISTS user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    photo VARCHAR(255) DEFAULT '',
    password text,
    followers INT DEFAULT 0
)
`
export const COMMENTS=`
CREATE TABLE IF NOT EXISTS comments(
    post_id NOT NULL,
    username NOT NULL,
    comment text 
)
`
export const LIKES=`
CREATE TABLE IF NOT EXISTS likes(
    post_id NOT NULL,
    username NOT NULL,
    count ENUM(0,1)
)
`
export const DISLIKES=`
CREATE TABLE IF NOT EXISTS dislikes(
    post_id NOT NULL,
    username NOT NULL,
    count ENUM(0,1)
)
`

