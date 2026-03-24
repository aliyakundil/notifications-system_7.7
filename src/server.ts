import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { Server } from "socket.io";
import { connectToDb } from "./db/mongo.js";
import fileDirName from "./utils/dirname.js";
import router from "./routes/notifications.js"
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import { onConnection } from "./socket/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authenticateSocket } from "./middleware/socketAuth.js";


const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

const { __dirname, __filename } = fileDirName(import.meta.url);
const publickDirPath = path.join(__dirname, 'public');

app.use(express.static(publickDirPath));

app.use('/api/notifications', router);
app.use('/api', authRouter);
app.use('/api', healthRouter);


const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

app.set("io", io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token"));
    }

    const user = await authenticateSocket(token);

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = user._id.toString();
    socket.data.username = user.username;

    next();
  } catch (err) {
    next(new Error("Auth error"));
  }
});

onConnection(io);

app.use(notFoundHandler);
app.use(errorHandler);

// Запуск сервера
async function startServer() {
  await connectToDb();
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();