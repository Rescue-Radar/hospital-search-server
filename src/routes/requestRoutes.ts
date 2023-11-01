import express from "express";

//import requestController from "../controllers/requestController";
import { findAndAddUser } from "../middlewares/requestMiddleware";

const router = express.Router();

router.post("/request", findAndAddUser);
router.get("/request", findAndAddUser);
router.get("/hospital");

export default router;
