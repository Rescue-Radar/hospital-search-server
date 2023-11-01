"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import requestController from "../controllers/requestController";
const requestMiddleware_1 = require("../middlewares/requestMiddleware");
const router = express_1.default.Router();
router.post("/", requestMiddleware_1.findAndAddUser);
router.get("/", requestMiddleware_1.findAndAddUser);
exports.default = router;
