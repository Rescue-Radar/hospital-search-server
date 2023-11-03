import express from "express";

//import requestController from "../controllers/requestController";
import { findAndAddUser, protect } from "../middlewares/requestMiddleware";
import requestController from "../controllers/requestController";
const requestUser = new requestController();
const router = express.Router();

router.post("/request", findAndAddUser, requestUser.searchHospitalsList);
router.post("/request/h/accept", protect, requestUser.acceptUserCase);
router.post("/request/h/reject", protect, requestUser.rejectUserCase);

export default router;
