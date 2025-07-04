import jwt from 'jsonwebtoken'

export function authentication(req,res,next){
    const authHeader=req.headers['authorization'];
    const token= authHeader ;
    //take the string after bearer:---
    if(!token){
        return res.status(401).json({message:"Access denied. No token provided."})
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({message:'Invalid token'});
        }
        req.user=user
        next()
    })
}