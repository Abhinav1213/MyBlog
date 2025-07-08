import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = ({ value, setValue }) => {
    const { allUsers } = useAuth()
    const [user_matched, setUser_matched] = useState([])
    const data = allUsers.users
    const navigate=useNavigate();
    useEffect(() => {
        data.filter((val) => {
            if (val.username.toLowerCase().includes(value.toLowerCase())) {
                setUser_matched((pre) => [...pre, val])
            }
        })
        return (() => {
            setUser_matched([])
        })
    }, [value,data])
    return (
        user_matched.length!==0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white border border-blue-400 rounded-xl shadow-2xl z-50" >
                <div className="p-4">
                    <h3 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Users Found
                    </h3>
                    <ul>
                        {user_matched.map((val, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-2 my-1 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold shadow hover:scale-105 hover:bg-blue-300 transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    setValue(val.username)
                                    //important concept here :--
                                    setTimeout(() => {setUser_matched([])
                                    navigate(`/user/${val.username}`)}
                                    , 1000);
                                }}
                            >
                                {val.username}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    )
}
export default SearchBox;