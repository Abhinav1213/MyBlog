export const CREATE_POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS posts (  
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(50) NOT NULL,
    likes INT default 0,
    dislikes INT default 0,
    description TEXT default NULL,
    FOREIGN KEY (author) REFERENCES user(username)
);
`;

export const USER_TABLE=`
CREATE TABLE IF NOT EXISTS user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    photo VARCHAR(255) DEFAULT 'https://media.licdn.com/dms/image/v2/D5603AQHwZZJxxkeVmg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725872588768?e=1757548800&v=beta&t=qjNtntg3kfRnplhm-xC_bQ7ZkuUxZnD16lc0su4o1ig',
    password text,
    followers INT DEFAULT 0
)
`

export const FRIEND_REQUEST=`
CREATE TABLE IF NOT EXISTS friend_request(
    request_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    sender_name VARCHAR(50) NOT NULL,
    receiver_name VARCHAR(50) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP default CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_name) REFERENCES user(username) ON DELETE CASCADE,
    FOREIGN KEY (receiver_name) REFERENCES user(username) ON DELETE CASCADE
)
`
export const COMMENTS=`
CREATE TABLE IF NOT EXISTS comments(
    post_id INT NOT NULL,
    username INT NOT NULL,
    comment text 
)
`
export const LIKES=`
CREATE TABLE IF NOT EXISTS likes(
    post_id INT NOT NULL,
    username IBT NOT NULL,
    count ENUM(0,1)
)
`
export const DISLIKES=`
CREATE TABLE IF NOT EXISTS dislikes(
    post_id INT NOT NULL,
    username INT NOT NULL,
    count ENUM(0,1)
)
`

export const FRIEND=`
CREATE TABLE IF NOT EXISTS friends(
    request_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user1 VARCHAR(50) NOT NULL,
    user2 VARCHAR(50) NOT NULL,
    created_at TIMESTAMP default CURRENT_TIMESTAMP
)
`

