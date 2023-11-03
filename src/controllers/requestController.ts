import { RequestService } from "../services/requestService";
import { Request, Response, NextFunction } from "express";

export default class requestController extends RequestService {
	public searchHospitalsList = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			await this.searchHospitals(req, res, next);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};
}
