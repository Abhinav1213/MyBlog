import { db_connect } from "../db/db_connect.js";

export const allUsers=async(req,res)=>{
    // console.log("1234");
    
    try{
        const [rows]= await db_connect.execute('select username from user')
        res.status(200).json({ users: rows });
    }catch(err){
        console.log('Server error in getting allUsers.', err);
        res.status(500).json({ error: 'Server error in getting all users.' });
    }

}