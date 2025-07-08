import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User, Mail, Users, Shield } from "lucide-react";

const UserProfile = () => {
    const { name } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/user/${name}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const data = await res.json();
                if (data.message && Array.isArray(data.message) && data.message.length > 0) {
                    data.message[0].photo = 'https://media.licdn.com/dms/image/v2/D5603AQHwZZJxxkeVmg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725872588768?e=1757548800&v=beta&t=qjNtntg3kfRnplhm-xC_bQ7ZkuUxZnD16lc0su4o1ig';
                    setUser(data.message[0]);
                    console.log(data.message[0]);
                    
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, [name]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <Navbar />
            <div className="flex justify-center items-center py-12">
                {user ? (
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-blue-200">
                        <img
                            src={user.photo}
                            alt={user.username}
                            className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg mb-4 object-cover"
                        />
                        <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2 mb-2">
                            <User className="w-7 h-7 text-blue-500" />
                            {user.username}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{user.followers} Followers</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-6">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">User ID: {user.id}</span>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition">
                            Follow
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-blue-700 text-xl font-semibold animate-pulse">
                        Loading...
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;