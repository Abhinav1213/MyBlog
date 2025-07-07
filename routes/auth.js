import express from 'express'
import bcrypt from 'bcrypt'
import { db_connect } from '../db/db_connect.js'
import jwt from 'jsonwebtoken'
import { authentication } from '../utils/utils1.js'

const router=express.Router()

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

router.post('/signUp',async(req,res)=>{
    const{email,password,username}=req.body;
    // console.log(req.body);
    try{
        const [rows]=await db_connect.execute('select * from user where email=?',
            [email])
        if(rows.length===0){
            //new user:
            const saltRounds=10;
            const new_password=await bcrypt.hash(password, saltRounds);;
            await db_connect.execute('INSERT into user (username,email,password) values (?,?,?)',
                [username, email, new_password]
            )
            const token=jwt.sign({email:email, username},process.env.JWT_SECRET,{expiresIn:'1h'})
            return res.status(201).json({message:'User Created', token});
        }
        return res.json({message:"This email already exists."})
    }catch(err){
        console.log("Error in signUp", err);
        res.status(500).json({message:"Server Error"});
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