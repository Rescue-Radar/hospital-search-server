"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `${__dirname}/.env` });
const socket_io_1 = require("socket.io");
const index_1 = require("../../index");
const requestQueries_1 = require("../queries/requestQueries");
const jwt = __importStar(require("jsonwebtoken"));
const io = new socket_io_1.Server(index_1.node_server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.of("/requestPatient").use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (socket.handshake.headers.authorization) {
        const { authorization } = socket.handshake.headers;
        const token = authorization.split(" ")[1];
        const secret = process.env.JWT_SECRET || "";
        if (secret) {
            const payload = jwt.verify(token, secret);
            if (!payload.userId) {
                next(new Error("Authentication error, Invalid Token or Token Expired"));
            }
            // console.log("decodedToken->",decodedToken);
            if (payload) {
                const theUser = yield (0, requestQueries_1.isExistingHospital)(payload.userId);
                if (!theUser)
                    next(new Error("Invalid Email or Password, Please provide valid credentials"));
                return next();
            }
        }
        else {
            next(new Error("JWT_SECRET is not defined"));
        }
    }
    else {
        next(new Error("Authentication error, Please provide a token"));
    }
}));
const pg_1 = require("pg");
const dbClient = new pg_1.Client({
    connectionString: "postgresql://postgres:root@localhost:5432/rescueradar",
});
dbClient.connect();
const channelName = "ticket_issued_updates";
// Set up the listener
dbClient.query(`LISTEN ${channelName}`);
// const yourNamespace = io.of("/requestPatient");
// yourNamespace.setMaxListeners(20);
io.of("/requestPatient").on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.setMaxListeners(20);
    console.log("a user connected");
    dbClient.on("notification", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Received notification:", msg.payload);
        const response = yield (0, requestQueries_1.fetchTicketIssue)();
        const result = response.rows;
        socket.emit("updateHospital", result);
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    }));
}));
