import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
 origin: "https://video-calling-beige.vercel.app/", 
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://video-calling-beige.vercel.app/", 
    methods: ["GET", "POST"],
  },
});
app.get("/",(req,res)=>{
  res.end("server is running");
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

socket.on("join_room", ({email, room}) => {
 socket.to(room).emit("user_joined", room);
 socket.join(room);
 console.log(`${email} joined room: ${room}`);
});

socket.on("offersend",({offer,room})=>{
  console.log("Offer received from", socket.id);
 // console.log("Offer:", offer);
  socket.to(room).emit("offerreceived", {offer,room});
  console.log("Offer sent to room:", room);
})
socket.on("answer",({answer,room})=>{
  console.log("Answer received from", socket.id);
 // console.log("Answer:", answer);
  socket.to(room).emit("answerreceived", answer);
  console.log("Answer sent to room:", room);
}
)
socket.on("ice", ({ candidate, room }) => {
  socket.to(room).emit("ice", { candidate });
});
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
