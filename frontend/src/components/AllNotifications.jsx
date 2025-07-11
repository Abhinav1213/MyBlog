import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { Check, X } from "lucide-react";

const AllNotifications = ({ value }) => {
    const { loginCred } = useAuth();
    const [allFriendreq, setAllFreiendreq] = useState([{ email: "", username: "", created_at: "", request_id: "" }])
    const [allFreiendreqReceive, setReceive]=useState([{ email: "", username: "", created_at: "", request_id: "" }])
    useEffect(() => {
        if (value) {
            const getAllSentRequest = async () => {
                try {
                    const response = await fetch('http://localhost:8080/fr/allRequests?action=sent', {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': `Bearer ${loginCred.token}`
                        }
                    });
                    const data = await response.json();
                    setAllFreiendreq(data)
                } catch (err) {
                    console.log('unable to get all request', err);
                }
            };
            const getAllRecRequest = async () => {
                try {
                    const response = await fetch('http://localhost:8080/fr/allRequests?action=received', {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': `Bearer ${loginCred.token}`
                        }
                    });
                    const data = await response.json();
                    console.log(data)
                    setReceive(data)
                } catch (err) {
                    console.log('unable to get all request', err);
                }
            };
            getAllSentRequest();
            getAllRecRequest();
        }
    }, [value, loginCred.token]);

    useEffect(()=>{
        console.log(allFreiendreqReceive);
        
    },[allFreiendreqReceive])

    const handleAccept=async(id,sender)=>{
        try{
            const response=await fetch(`http://localhost:8080/fr/?action=accept&request_id=${id}&sender=${sender}`,{
                method:"PUT",
                headers:{
                    'content-type':'application/json',
                    'authorization':`Bearer ${loginCred.token}`
                }
            })
            const data=await response.json();
            console.log(data)
        }catch(err){
            console.log('Error in accepting Friend Request', err);
        }
    }
    const handleReject=async()=>{
        try{
            const response=await fetch(`http://localhost:8080/fr/?action=reject&request_id=${id}&sender=${sender}`,{
                method:"PUT",
                headers:{
                    'content-type':'application/json',
                    'authorization':`Bearer ${loginCred.token}`
                }
            })
            const data=await response.json();
            console.log(data)
        }catch(err){
            console.log('Error in rejecting Friend Request', err);
        }
    }

    return (
        <div className="px-2 py-2">
            {allFriendreq.length === 0 && allFreiendreqReceive.length===0 && (
                <div className="text-gray-400 text-center py-8">No notifications</div>
            )}
            <div className="flex flex-col gap-3">
                {allFriendreq.map((e, idx) => (
                    <div
                        key={e.request_id || idx}
                        className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 shadow-sm transition"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                            <span className="block font-semibold text-blue-700 hover:underline cursor-pointer">
                                {e.username}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[110px]">
                            <span className="text-gray-400 text-xs">
                                {e.created_at
                                    ? new Date(e.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                                    : ""}
                            </span>
                        </div>
                    </div>
                ))}
                {allFreiendreqReceive.map((e,idx)=>(
                    <div
                        key={e.request_id || idx}
                        className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-3 shadow-sm transition"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                            <span className="block font-semibold text-blue-700 hover:underline cursor-pointer">
                                {e.username}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[110px]">
                            <span className="text-gray-400 text-xs">
                                {e.created_at
                                    ? new Date(e.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                                    : ""}
                            </span>
                            <div className="flex gap-2 mt-1">
                                <button className="p-1 rounded-full hover:bg-green-100 transition"
                                    onClick={()=>handleAccept(e.request_id,e.username)}
                                >
                                    <Check className="w-5 h-5 text-green-600" />
                                </button>
                                <button className="p-1 rounded-full hover:bg-red-100 transition"
                                    onClick={handleReject}
                                    >
                                    <X className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AllNotifications;