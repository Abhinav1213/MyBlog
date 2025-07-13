import mysql from 'mysql2/promise'
import dotenv from "dotenv";
dotenv.config();

let db_connect;

try {
    db_connect = await mysql.createConnection({
        host: "localhost",
        poer:"3306",
        user:  "root",
        password: `${process.env.SQL_PASSWORD}`,
        database: "YourBlog",
    });
    console.log("Database connection successful");
} catch (err) {
    console.error("Database connection failed:", err);
}

export { db_connect };