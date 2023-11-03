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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.node_server = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `${__dirname}/.env` });
const port = process.env.PORT || 5000;
//handle uncaught err
// process.on("uncaughtException", function (err) {
//   console.log(`uncaughterror-> ${err}`);
// });
const requestRoutes_1 = __importDefault(require("./src/routes/requestRoutes"));
const app = (0, express_1.default)();
exports.node_server = http_1.default.createServer(app);
require("./src/services/updateHospital");
// Allow requests from http://localhost:5173
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true, // You might need this if you are using cookies for authentication
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// parse application/json
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use("/api", requestRoutes_1.default);
app.get("/", (req, res) => {
    const CurrentDateTime = new Date().toLocaleString();
    res.status(200).json({
        HTTPCode: "200",
        Status: "OK",
        message: "Welcome to Home",
        EntryTime: CurrentDateTime,
    });
});
app.get("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
exports.node_server.listen(port, () => {
    console.log(`server is running at port ${port} `);
});
