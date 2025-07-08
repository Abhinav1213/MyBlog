import { db_connect } from "../db/db_connect.js";

export const userPosts=async(req,res)=>{
    const name=req.params.name;
    try{
        const [rows]=await db_connect.execute('select * from posts where author=?',
            [name]
        )
        console.log(rows);
        return res.status(201).json({rows})
    }catch(err){
        console.log('Error in post in dashboard');
        res.status(503).json({message:"Internal server error."})
    }
}