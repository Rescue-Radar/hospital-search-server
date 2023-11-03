import express from "express";

//import requestController from "../controllers/requestController";
import {  findAndAddUser } from "../middlewares/requestMiddleware";
import requestController from "../controllers/requestController";
 const requesUser = new requestController();
const router = express.Router();

router.post("/request",findAndAddUser,requesUser.searchHospitalsList);

export default router;
