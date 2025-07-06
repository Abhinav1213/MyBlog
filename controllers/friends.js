import { db_connect } from "../db/db_connect";

export const sendFriendRequest=async(req,res)=>{
    const sender=req.user.username;
    const receiver=req.body.username;
    try{
        const [row1]=await db_connect.execute('select * from friend where (user1=? and user2=?) OR (user2=? and user1=?)',
            [sender, receiver,sender, receiver]
        )
        if(row1.length===0){
            //not already friend:--
            await db_connect.execute('insert into friend_requests (sender, receiver) values(?,?)',
                [sender, receiver]
            )
            return res.status(201).json({message:'Friend request send'})
        }
        return res.status(201).json({message:"Already friend"})
    }catch(err){
        console.log('Error in sending friend request.');
        res.status(501).json({message:'Error in sending friend request.'})
    }
}

export const acceptFriendRequest=async(req,res)=>{
    const user1=req.user.username;
    const user2=req.body.username;
    try{
        await db_connect.execute('insert into friend (user1,user2) values (?,?)',
            [user1,user2]
        )
        await db_connect.execute('update friend_requests set status=1 where sender=? and receiver=?',
            [user1, user2]
        )
        res.status(201).json({message:'friend request accepted'})
    }catch(err){
        console.log('Error in accepting friend request.');
        return res.status(501).json({message:'Error in accepting friend request.'})
    }
}

export const rejectFriendRequest=async(req,res)=>{
    const sender=req.user.username;
    const receiver=req.body.username;
    try{
        await db_connect.execute('delect from friend_request where (sender=? and receiver=?) OR (sender=? and receiver=?)',
            [sender,receiver, receiver, sender]
        )
        return res.status(201).json({message:'Friend request rejected.'})
    }catch(err){
        console.log('Error in rejecting friend request.');
        return res.status(501).json({message:'Error in rejecting friend request.'})
    }
}

