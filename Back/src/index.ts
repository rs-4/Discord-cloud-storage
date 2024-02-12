import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Mainrouter from './routes/index.route';
dotenv.config();

import './mongoConnection';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }

});

app.use(cors({
  origin: '*'
}));

app.get("/", (req, res) => {
  res.status(418).send('This is a cloud service provider using discord');
});

app.use("/api", Mainrouter);
app.set('socketIo', io);

io.on('connection', (socket) => {

  const room = socket.handshake.query.room as string;
  if (!room || room === 'undefined') {
    socket.disconnect();
  }
  socket.join(room);

});


server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
