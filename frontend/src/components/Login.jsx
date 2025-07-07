import {Link,useNavigate} from 'react-router-dom'
import { useState } from "react";

const Login = () => {
    const [authData, setAuthData]=useState({email:"",password:""});
    const navigate=useNavigate();
    
    const checkLogin=async(e)=>{
        e.preventDefault();
        try{
            const response=await fetch('http://localhost:8080/auth/login',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email:authData.email,
                    password:authData.password
                })
            })
            console.log(response);
        }catch(err){
            console.log('Unable to fetch login api');
        }
    }
    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={authData.email}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e)=>setAuthData((pre)=> ({...pre,[e.target.name]:e.target.value}))}
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
                        value={authData.password}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e)=>setAuthData((pre)=>({...pre, [e.target.name]:e.target.value}))}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                    onClick={checkLogin}
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Login;