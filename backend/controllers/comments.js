// import { db_connect } from "../db/db_connect";

// const getComments=async(req,res)=>{
//     const {post_id}=req.params;
//     try{
//         const [rows]=await db_connect.execute('select * from comments where post_id=? ',
//             [post_id]
//         )
//         return res.send(201).json({rows})
//     }catch(err){
//         return res.send(503).json({message:"Internal server error", err})
//     }
// }
