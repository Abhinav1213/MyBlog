import express from 'express'
import { CREATE_POSTS_TABLE, USER_TABLE } from './schema/post_schema.js'
import dotenv from 'dotenv'
import cors from 'cors'
import {db_connect } from './db/db_connect.js'
import GettingPosts from './routes/getting_posts.js'
import PostingPosts from "./routes/posting_posts.js"
import authProcess from "./routes/auth.js"
import { WebSocketServer } from 'ws'


dotenv.config();

try{
    await db_connect.execute(CREATE_POSTS_TABLE);
    await db_connect.execute(USER_TABLE);
    console.log("Posts table created successfully");
}catch(err){
    console.error("Error creating posts table:", err);
}

const app=express();
app.use(cors())
app.use(express.json());

app.use('/get',GettingPosts);
app.use('/post',PostingPosts);
app.use('/auth', authProcess);

const httpServer=app.listen(8080,()=>{
    console.log('app started on port 8080');
})

const wss=new WebSocketServer({server:httpServer})
wss.on('connection',(ws)=>{
    ws.on('error',(err)=>console.log(err))
    console.log('connection established!!');
    ws.on('message',(data)=>{
        console.log('Server one!!!'); 
    })
    ws.send("hello from server")

})