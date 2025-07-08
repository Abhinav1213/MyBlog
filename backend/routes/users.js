import express from 'express'
import { allUsers } from "../controllers/searchBar.js";
import { db_connect } from '../db/db_connect.js';
import { userPosts } from '../controllers/dashboard.js';
const router=express.Router();


router.get("/allnames",allUsers)
router.get('/post/:name', userPosts)
router.get("/:names",async(req,res)=>{
    const pre=req.params.names;
    try{
        const [row]=await db_connect.execute('Select * from user where username= ?',
            [pre]
        )
        return res.status(201).json({row})
    }catch(err){
        console.log('Error in searching username', err);
        res.send({message:'Error in searching username.'})
    }
})

export default router;
