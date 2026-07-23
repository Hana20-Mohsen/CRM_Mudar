import { Server } from "socket.io"
import { setSocketInstance } from "./socketManager.js"
import { verifyToken } from "../../utilities/security/token.security.js"
import fs from "fs";

let io
const initSocket = (server) => {
  // console.log('init socket');

  io = new Server(server, {
    // cors:{
    //  origin:"*"
    // }
    cors: {
      origin: [
        "http://localhost:5173",
        "https://crm-mudar.vercel.app",
        "http://192.168.1.135"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  })
  setSocketInstance(io)
  io.use((socket, next) => {

    // console.log(`user role from socket : `, socket.handshake.auth.role);


    //  if(!token){
    //   return next(new Error("Authentication error"))
    //  } 

    try {
      const token = socket.handshake.auth.token
      console.log(`token from socket : `, token);
      const decoded = verifyToken({ token, signature: process.env.TOKEN_SIGNATURE_ADMIN || process.env.TOKEN_SIGNATURE })
      console.log(`decode : `, decoded);

      socket.user = decoded
      //   console.log(v);


      next()

    } catch (err) {
      next(new Error("Invalid token"))
    }

  })
  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`user joined room : ${userId}`);
    
  });
    socket.join(socket.user.id)
     // عشان نقدر نبعتله رسائل خاصة بيه لو احتجنا
     console.log(`user joined room : ${socket.user.id}`);
     
    console.log("user connected:", socket.id)
    socket.on("joinBoard", (boardId) => {
      console.log(`BoardId :`);
      console.log(boardId);
      socket.join(boardId);
      console.log(`user joined board ${boardId}`);
      fs.writeFileSync("data.json", JSON.stringify({ boardId: boardId }));

      const data = JSON.parse(fs.readFileSync("data.json"));

      // console.log(data);

      // localStorage.setItem('boardId', boardId);

    });
    socket.on("connect_error", (err) => {
      console.log("❌ Connection error:", err.message);
    });
    // test

    socket.on("disconnect", (reason) => {
      console.log("user disconnected")
      console.log("disconnect reason:", reason)
    })

  })

}

export const getIO = () => {
  if (!io) throw new Error("socket not initialized")
  return io
}
export default initSocket