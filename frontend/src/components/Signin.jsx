import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from "../context/authContext";

const Signin = () => {
    const {setLoginCred}=useAuth();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate=useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault()
        console.log(form);
        try {
            const response = await fetch('http://localhost:8080/auth/signUp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    username: form.username,
                })
            })
            // console.log(response);
            if(response.status===200){
                setLoginCred({username: data.user.username, email: data.user.email, token:data.token})
                navigate("/")
            }
        } catch (err) {
            console.log('Error in signin.');
        }
    }
    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
            <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-gray-700 font-medium">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    placeholder="Enter your username"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                />
            </div>
            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                onClick={handleSignIn}
            >
                Sign Up
            </button>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Signin;