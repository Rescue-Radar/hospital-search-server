import express from "express";

//import requestController from "../controllers/requestController";
import { authenticateHospital, findAndAddUser, protect } from "../middlewares/requestMiddleware";
import requestController from "../controllers/requestController";
import hospitalController from "../controllers/hospitalController";
const requestUser = new requestController();
const hospitalUser = new hospitalController();
const router = express.Router();

router.post("/request", findAndAddUser, requestUser.searchHospitalsList);
router.post("/request/h/accept", authenticateHospital, hospitalUser.acceptUserCase);
router.post("/request/h/reject", authenticateHospital, hospitalUser.rejectUserCase);

export default router;
