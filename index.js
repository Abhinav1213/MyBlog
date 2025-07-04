import express from 'express'
import { CREATE_POSTS_TABLE, USER_TABLE } from './schema/post_schema.js'
import dotenv from 'dotenv'
import {db_connect } from './db/db_connect.js'
import GettingPosts from './routes/getting_posts.js'
import PostingPosts from "./routes/posting_posts.js"
import authProcess from "./routes/auth.js"

dotenv.config();
try{
    await db_connect.execute(CREATE_POSTS_TABLE);
    await db_connect.execute(USER_TABLE);
    console.log("Posts table created successfully");
}catch(err){
    console.error("Error creating posts table:", err);
}

const app=express();
app.use(express.json());

app.use('/get',GettingPosts);
app.use('/post',PostingPosts);
app.use('/auth', authProcess)
app.listen(8080,()=>{
    console.log('app started on port 8080');
})

