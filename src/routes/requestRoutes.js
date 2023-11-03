"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import requestController from "../controllers/requestController";
const requestMiddleware_1 = require("../middlewares/requestMiddleware");
const requestController_1 = __importDefault(require("../controllers/requestController"));
const hospitalController_1 = __importDefault(require("../controllers/hospitalController"));
const requestUser = new requestController_1.default();
const hospitalUser = new hospitalController_1.default();
const router = express_1.default.Router();
router.post("/request", requestMiddleware_1.findAndAddUser, requestUser.searchHospitalsList);
router.post("/request/h/accept", requestMiddleware_1.authenticateHospital, hospitalUser.acceptUserCase);
router.post("/request/h/reject", requestMiddleware_1.authenticateHospital, hospitalUser.rejectUserCase);
exports.default = router;
