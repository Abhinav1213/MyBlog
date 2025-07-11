import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { User, Mail, Users, Shield } from "lucide-react";
import { useAuth } from "../context/authContext";
import PostModal from "../components/PostModal";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { name } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([])
    const [close, setClose] = useState(false)
    const { loginCred,setLoginCred } = useAuth()
    const navigate=useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('loginCred')
        setLoginCred({ username: "", email: "", token: "" });
        navigate("/login")
    }
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
                // console.log( data.row.length );

                if (data.row && data.row.length > 0) {
                    data.row[0].photo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IYhSn8Y9S9_HF3tVaYOepJBcrYcd809pBA&s';
                    setUser(data.row[0]);
                    // console.log(data.row[0]);
                } else {
                    setUser(null);
                }
                return;
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/user/post/${name}`, {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                const data = await response.json();
                console.log(data.rows);
                setPosts(data.rows)
            } catch (err) {
                console.error("failed to fetch user Post", err);
            }
        }
        fetchUser();
        fetchPosts();
    }, [name]);
    const newPost = () => {
        setClose(true)
    }
    const sendFriendRequest = async () => {
        console.log(name);
        try {
            console.log(loginCred.token);

            const response = await fetch(`http://localhost:8080/fr/${name}`, {
                method: "POST",
                headers: {
                    'content-type': "application/json",
                    'authorization': `Bearer ${loginCred.token}`
                }
            })
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log('Unable to send friend-request', err);
        }

    }
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
                        <div className="flex justify-centre align-center">
                            <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2 mb-2">
                                <User className="w-7 h-7 text-blue-500" />
                                {user.username}
                            </h2>
                            <button className="text-sm text-red-800 p-3 bg-red-200 rounded-lg hover:bg-red-400" onClick={handleLogout}>Logout</button>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{user.followers} Followers</span>
                        </div>
                        {loginCred.username !== name && (<button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition">
                            Follow
                        </button>)}
                        {loginCred.username === name && (
                            <button
                                onClick={newPost}
                                className="flex items-center gap-2 px-6 py-2 mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                New Post
                            </button>
                        )}
                        {/* all-friend, followers and following and add_friends */}
                        {loginCred.username !== name && (<div>
                            <button className="bg-gray-400 p-3 rounded-lg mt-2" onClick={sendFriendRequest}>Add Friend</button>
                        </div>)}
                    </div>
                ) : (
                    <div className="text-center text-blue-700 text-xl font-semibold animate-pulse">
                        Loading...
                    </div>
                )}
            </div>
            <div className="max-w-2xl mx-auto mt-8 w-full">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
                    Posts
                </h3>
                {posts && posts.length > 0 ? (
                    posts.map((post, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-md mb-6 p-6 border border-blue-100 hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
                                    {post.title}
                                </h4>
                                <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700 mb-4">{post.description}</p>
                            <div className="flex items-center gap-6 mb-2">
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-3 3m0 0l-3-3m3 3V4m0 16v-7" /></svg>
                                    {post.likes}
                                </span>
                                <span className="flex items-center gap-1 text-red-500 font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 15l3-3m0 0l3 3m-3-3v7m0-16v7" /></svg>
                                    {post.dislikes}
                                </span>
                            </div>
                            {/* Comments */}
                            {/* <div className="mt-4">
                                <h5 className="font-bold text-blue-600 mb-2 flex items-center gap-1">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2 4 4" /></svg>
                                    Comments
                                </h5>
                                {post.comments && post.comments.length > 0 ? (
                                    <ul className="pl-4 space-y-1">
                                        {post.comments.map((comment, cidx) => (
                                            <li key={cidx} className="text-gray-600 text-sm bg-blue-50 rounded px-2 py-1">
                                                {comment}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-400 text-sm">No comments yet.</span>
                                )}
                            </div> */}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-blue-500 font-semibold">No posts yet.</div>
                )}
            </div>
            {close && (<PostModal setClose={setClose} />)}
        </div>
    );
};

export default UserProfile;