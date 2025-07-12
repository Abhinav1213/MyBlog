import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { allUsers } from "./GetAllUsers.js";
import { useAuth } from "../context/authContext.jsx";
import SearchBox from "./SeachBox.jsx";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import AllNotifications from "./AllNotifications.jsx";

const Navbar = () => {
    const [searchText, setSearchText] = useState("")
    const { setAllUsers, loginCred } = useAuth()
    const [showNotifications, setShowNotifications] = useState(false);
    // const [size]
    const navigate=useNavigate();
    useEffect(() => {
        allUsers(setAllUsers);
        // console.log(loginCred);
    }, [])

    const openDashboard=()=>{
        navigate(`/user/${loginCred.username}`)
    }

    return (
        <div>
            <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
                <Link to={"/"} ><div className="flex-1">
                    <h1 className="font-bold text-2xl">YOUR-BLOG</h1>
                </div></Link>
                
                <div className="flex-1 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        className="w-96 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                {/* Right: Login/SignUp */}
                {!loginCred.username && (<div className="flex-1 flex justify-end gap-4">
                    <Link to="/login">
                        <button className="px-5 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
                            Login
                        </button>
                    </Link>
                    <Link to="/signin">
                        <button className="px-5 py-2 bg-gray-200 text-blue-700 rounded font-semibold hover:bg-gray-300 transition">
                            Sign Up
                        </button>
                    </Link>
                </div>)}
                {loginCred.username && (
                    <div className="flex gap-4 align-center">
                        <button
                            className="relative focus:outline-none"
                            onClick={() => setShowNotifications((prev) => !prev)}
                        >
                            <Bell className="w-7 h-7 text-blue-500 hover:text-blue-700 transition" />
                            {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span> */}
                        </button>
                    <div className="flex items-center gap-3" onClick={openDashboard}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IYhSn8Y9S9_HF3tVaYOepJBcrYcd809pBA&s"
                            alt={loginCred.username}
                            className="w-9 h-9 rounded-full border-2 border-blue-400 shadow"
                        />
                        <span className="font-semibold text-blue-700">{loginCred.username}</span>
                    </div>
                    </div>
                )}
            </nav>
            {showNotifications && (
                <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-blue-200 z-50 transition-transform duration-300 ease-in-out animate-slide-in">
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-blue-700">Notifications</h2>
                            <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => setShowNotifications(false)}
                            >
                                ✕
                            </button>
                        </div>
                        {/* Notification content goes here */}
                        
                            <AllNotifications value={showNotifications}/>
                        {/* <div className="flex-1 overflow-y-auto">
                            <p className="text-gray-500 text-center mt-10">No notifications yet.</p>
                        </div> */}

                    </div>
                </div>
            )}
            {searchText && <SearchBox value={searchText} setValue={setSearchText} />}
        </div>
    );
};

export default Navbar;