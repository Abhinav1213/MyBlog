import express from 'express'
import bcrypt from 'bcrypt'
import { db_connect } from '../db/db_connect.js'
import jwt from 'jsonwebtoken'
import { authentication } from '../utils/utils1.js'

const router=express.Router();

router.post("/signUp", async (req, res) => {
  const { email, password, username } = req.body;
  if (!process.env.JWT_SECRET) {
    console.log("JWT SECRET not configured!");
    return res.status(400).json({ message: "Internal Failure"});
  }
  try {
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    await db_connect.execute(
      "INSERT into user (username,email,password) values (?,?,?)",
      [username, email, hash_password]
    );

    const token = jwt.sign({ email: email, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({ message: "User Created", token, user: { username, email } });
  } catch (err) {

    if (err.code === 'ER_DUP_ENTRY') {
      const field = err.sqlMessage.includes('email')? 'Email': 'Username';
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.log("Error in signUp", err);
    res.status(500).json({ 
      message: "Server Error", error: err.message,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
     });
  }
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    // console.log(process.env.JWT_SECRET);
    try{
        const [row_password]=await db_connect.execute('select * from user where email=?',
            [email]
        )
        console.log(row_password);
        if(row_password.length===0){
            return res.json({message:'Email not exist signUp first.'});
        }
        const user=row_password[0]
        const ismatch=await bcrypt.compare(password,row_password[0].password)
        
        if(ismatch){
            const token=jwt.sign({
                email:user.email, username:user.username
            },process.env.JWT_SECRET,{expiresIn:'1h'})
            return res.status(201).json({message:"Login Successful",token})
        }
        return res.json({message:"Invalid credentials"})
    }catch(err){
        console.log("Error in Login", err);
        res.status(500).json({message:"server error"});
    }
})

router.delete('/deleteAccount', authentication, async(req,res)=>{
    const {email}=req.user;
    try{
        const [rows]=await db_connect.execute('delete from user where email=?',[email]);
        if(rows.affectedRows===0){
            return res.status(201).json({message:'This user is not in our database.'})
        }
        return res.status(201).json({message:'User Deleted Successfully'})
    }
    catch(err){
        console.log('Error in deleting yourselves', err);
        res.status(501).json({message:'Server Error'})
    }
})

export default router;