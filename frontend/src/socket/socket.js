import { io } from "socket.io-client"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
console.log(`back url : ${import.meta.env.VITE_API_URL}`);

const user= JSON.parse(localStorage.getItem("user"));
//  transports:["websocket"],
const socket = io(`${import.meta.env.VITE_API_URL}`, {
    transports: ["polling", "websocket"],
    auth: {
        token: localStorage.getItem("token"),
        role: user?.role, 
    }
})

export default socket