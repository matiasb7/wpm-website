import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import gameRouter from "./routes/gameRouter.js";
import setupSocketHandlers from "./socketHandlers.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/game", gameRouter);

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocketHandlers(io);
server.listen("3000", () => {
  console.log(`Server running on port 3000`);
});
