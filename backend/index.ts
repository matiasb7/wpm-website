import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import gameRouter from "./routes/gameRouter";
import setupSocketHandlers from "./socketHandlers";
import { ServerOptions } from "socket.io";
import path from "path";
import { isProduction } from "./utils/environment";

const app = express();
const port = process.env.BE_PORT ?? 3000;
const frontendPort = process.env.FE_PORT ?? 5173;

app.use(cors());
app.use(express.json());
app.use("/api/game", gameRouter);

const server = createServer(app);

const opts: Partial<ServerOptions> = {
  connectionStateRecovery: {},
};

if (!isProduction()) {
  opts.cors = {
    origin: `http://localhost:${frontendPort}`,
    methods: ["GET", "POST"],
    credentials: true,
  };
} else {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

const io = new Server(server, opts);

setupSocketHandlers(io);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
