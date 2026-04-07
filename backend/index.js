
import bootstrap from './src/app.controller.js';
import express from 'express'
import http from 'http'
import initSocket from './src/modules/Socket/index.js';
// import { setServers } from "node:dns/promises";
const app=express();
const port =8000;

const server = http.createServer(app)
// setServers(["1.1.1.1", "8.8.8.8"]);
bootstrap(app , express)
initSocket(server)


server.listen(port , ()=>{console.log(`listening on ${port}`);
})

// import bootstrap from './src/app.controller.js';
// import express from 'express'
// import { Server } from 'socket.io';
// import { createServer } from 'http';
// const app=express();
// const port =8000;

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: ["https://crm-backend-theta-liard.vercel.app/"], 
//         methods: ["GET", "POST" , "PUT" , "DELETE"],
//     }
// });

// io.on('connection', (socket) => {

//     console.log('User connected:', socket.id);
//     io.emit('server-notification' , {message:'Hello from the server!'});

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// io.on("connection", async (socket) => {
//     console.log('User connected:', socket.id);
//   const offset = socket.handshake.auth.offset;
//   console.log("offset :" , offset);
  
//   if (offset) {
//     console.log('offset found');
    
//     const missedEvents = await db.getEventsAfter(offset);
//     missedEvents.forEach(event => {
//       socket.emit("my-event", event);
//     });
//   }
//   socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });


// io.engine.on("connection_error", (err) => {
//   console.log("Connection Error:", err.message);
//   console.log("Context:", err.context);
// });

// bootstrap(app , express , io)

// const PORT = process.env.PORT || 8000;
// httpServer.listen(PORT, () => {
//     console.log(`listening on ${PORT} with Socket.io support`);
// });
// httpServer.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });
