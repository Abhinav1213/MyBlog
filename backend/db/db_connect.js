import mysql from 'mysql2/promise'

let db_connect;

try {
    db_connect = await mysql.createConnection({
        host: "localhost",
        user:  "root",
        password: "Abhinav@03",
        database: "YourBlog",
    });
    console.log("Database connection successful");
} catch (err) {
    console.error("Database connection failed:", err);
}

export { db_connect };