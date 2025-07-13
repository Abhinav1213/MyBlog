import { useEffect } from "react";
import { useState, useContext } from "react";
import { createContext } from "react";
import {jwtDecode} from 'jwt-decode'

const AuthContext=createContext(null)

export const AuthProvider=(props)=>{
    const [loginCred, setLoginCred]=useState({username:"",email:"",token:""})
    const [allUsers, setAllUsers]=useState([])

    useEffect(() => {
    const stored = localStorage.getItem('loginCred');
    if (stored) {
        const data=JSON.parse(stored)
        const token=data?.token
        try{
            const decode=jwtDecode(token)
            const isExpired=decode.exp*1000<Date.now();
            
            if(!isExpired){
                setLoginCred(data);
            }
            else{
                localStorage.removeItem('loginCred')
            }
        }catch(err){
            console.log("error in jwt decoding", err);
            localStorage.removeItem('loginCred');
            setLoginCred(null);
        }
    }
}, []);
    useEffect(() => {
    if (loginCred && loginCred.username) {
        localStorage.setItem('loginCred', JSON.stringify(loginCred));
    }
    }, [loginCred]);

    return(
        <AuthContext.Provider value={{loginCred, setLoginCred, allUsers, setAllUsers}}>
            {props.children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext)