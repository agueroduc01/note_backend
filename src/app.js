import express from "express";
import initAPIRouter from "./routes/api.js";
import fileUploadConfig from "./configs/fileUploadConfig";


import corsConfig from "./configs/corsConfig";
import dotenv from "dotenv";


import http from "http";
import socketio from "socket.io";
import socketEvents from "./events";


import middlewares from "./middlewares/index.js";


dotenv.config();


const app = express();
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port: ${process.env.PORT || 3000}`);
});


const io = socketio(server);
io.use(middlewares.verifySocketConnection);
io.on('connection', socketEvents.connectedEvent);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUploadConfig);
app.use(corsConfig);


initAPIRouter(app);