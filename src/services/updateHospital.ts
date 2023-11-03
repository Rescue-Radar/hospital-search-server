

import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
import { Server } from 'socket.io';
import { node_server } from "../../index";
import { fetchTicketIssue, isExistingHospital } from "../queries/requestQueries";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/requests.auth";


const io = new Server(node_server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
  io.of("/requestPatient").use(async(socket, next) => {
    if (socket.handshake.headers.authorization) {
      const { authorization } = socket.handshake.headers;
      const token = authorization.split(" ")[1];
      const secret: string = process.env.JWT_SECRET || "";
      if (secret) {
        const payload = jwt.verify(token, secret) as JwtPayload;
          if (!payload.userId) {
            next(
              new Error("Authentication error, Invalid Token or Token Expired")
            );
          }
          // console.log("decodedToken->",decodedToken);
          if (payload) {
            const theUser = await isExistingHospital(payload.userId);
            if (!theUser)
              next(
                new Error(
                  "Invalid Email or Password, Please provide valid credentials"
                )
              );
  
            return next();
          }
        
      } else {
        next(new Error("JWT_SECRET is not defined"));
      }
    } else {
      next(new Error("Authentication error, Please provide a token"));
    }
  });
  
  import { Client } from "pg";
  const dbClient = new Client({
    connectionString: "postgresql://postgres:root@localhost:5432/rescueradar",
  });
  
  dbClient.connect();
  
  const channelName = "ticket_issued_updates";
  
  // Set up the listener
  dbClient.query(`LISTEN ${channelName}`);
  // const yourNamespace = io.of("/requestPatient");
  // yourNamespace.setMaxListeners(20);
  
  io.of("/requestPatient").on("connection", async (socket: any) => {
    socket.setMaxListeners(30);
    console.log("a user connected");
    dbClient.on("notification", async (msg: any) => {
      // console.log("Received notification:", msg.payload);
  
      const response = await fetchTicketIssue();
      const result = response.rows;
      socket.emit("updateHospital", result);
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    
    });
  });
  
