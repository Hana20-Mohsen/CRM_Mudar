import { io } from "socket.io-client"
console.log(`back url : ${import.meta.env.VITE_API_URL}`);

//  transports:["websocket"],
const socket = io(`${import.meta.env.VITE_API_URL}`,{
    transports: ["polling", "websocket"],
 auth:{
  token: localStorage.getItem("token")
 }
})

export default socket