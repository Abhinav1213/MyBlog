import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { allUsers } from "./GetAllUsers.js";
import { useAuth } from "../context/authContext.jsx";
import SearchBox from "./SeachBox.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [searchText, setSearchText] = useState("")
    const { setAllUsers, loginCred } = useAuth()
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
                {/* Left: Logo */}
                <div className="flex-1">
                    <h1 className="font-bold text-2xl">YOUR-BLOG</h1>
                </div>
                {/* Center: Search Bar */}
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
                    <div className="flex items-center gap-3" onClick={openDashboard}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2IYhSn8Y9S9_HF3tVaYOepJBcrYcd809pBA&s"
                            alt={loginCred.username}
                            className="w-9 h-9 rounded-full border-2 border-blue-400 shadow"
                        />
                        <span className="font-semibold text-blue-700">{loginCred.username}</span>
                    </div>
                )}
            </nav>
            {searchText && <SearchBox value={searchText} setValue={setSearchText} />}
        </div>
    );
};

export default Navbar;