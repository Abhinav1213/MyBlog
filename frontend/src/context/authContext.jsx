import { useState, useContext } from "react";
import { createContext } from "react";

const AuthContext=createContext(null)

export const AuthProvider=(props)=>{
    const [loginCred, setLoginCred]=useState({username:"",email:""})
    const [allUsers, setAllUsers]=useState([])
    return(
        <AuthContext.Provider value={{loginCred, setLoginCred, allUsers, setAllUsers}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext)