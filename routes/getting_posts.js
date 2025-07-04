import express from 'express';
import { db_connect } from '../db/db_connect.js';
import {authentication} from '../utils/utils1.js'

const router=express.Router();

router.get('/allPosts',async(req,res)=>{
    try {
        const [rows] = await db_connect.execute('SELECT * FROM posts');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal Server Error");
    }
})
//security->only author can do this:--
router.delete('/post/:id',authentication, async(req,res)=>{
    const {id}=req.params;
    try{
        const [result]=await db_connect.execute('DELETE FROM posts WHERE id=?',[id]);
        // console.log(result);
        if(result.affectedRows===0){
            return res.status(404).json({message:"Post not found"});
        }
        res.json({message:"Post deleted successfully"});
    }
    catch(err){
        console.log(err);
    }
})
router.get('/post/:date',async(req,res)=>{
    const {date}=req.params;
    try{
        const [rows]=await db_connect.execute('select * from posts where DATE(date)=?',[date]);
        res.status(201).json(rows)
    }catch(err){
        console.log(err);
    }
})
router.get('/post/:username', async(req,res)=>{
    const {username}=req.params;
    try{
        const [rows]=await db_connect.execute('select * from posts where username=?',[username]);
        res.status(201).json(rows);
    }
    catch(err){
        console.log("Error in /post/:username" ,err);
    }
})
//security required:--
router.put('/post/:postId',authentication,async(req,res)=>{
    const {postId}=req.params;
    const {title, description}=req.body;
    try{
        const [result]=await db_connect.execute(`UPDATE posts SET title=?, description=? WHERE id=?`,
            [title, description, postId]
         )
        if(result.affectedRows===0){
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(201).json({message:"Post updated successfully."})
    }
    catch(err){
        console.log("Error in /post/:postId", err);
    }
})
export default router;