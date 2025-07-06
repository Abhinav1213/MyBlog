import { db_connect } from "../db/db_connect";
import express from 'express'

const router=express.Router();

router.get("/:names",async(req,res)=>{
    const pre=req.params;
    try{
        const [row]=await db_connect.execute('Select * from user where username like ?',
            [`${pre}%`]
        )
        return res.status(201).json({message:row})
    }catch(err){
        console.log('Error in searching username', err);
        res.send({message:'Error in searching username.'})
    }
})

