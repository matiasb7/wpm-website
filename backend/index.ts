import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import gameRouter from "./routes/gameRouter";
import setupSocketHandlers from "./socketHandlers";

const app = express();
const port = process.env.BE_PORT ?? 3000;
const frontendPort = process.env.FE_PORT ?? 5173;

app.use(cors());
app.use(express.json());
app.use("/game", gameRouter);

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: `http://localhost:${frontendPort}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocketHandlers(io);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
