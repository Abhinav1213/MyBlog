import express from 'express'
const router = express.Router();
import { db_connect } from '../db/db_connect.js';

router.post('/postBlog', async(req,res)=>{
    const {title, des, author}=req.body;
    try{
        await db_connect.execute
        ('INSERT INTO posts(title,author, description) values (?,?,?)',
            [title,author,des]
        );
        res.status(201).json('Post has been created.')
    }
    catch(err){
        console.log(err);
    }
})

export default router;