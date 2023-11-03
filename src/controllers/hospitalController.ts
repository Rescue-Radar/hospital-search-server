import { RequestService } from "../services/requestService";
import { Request, Response, NextFunction } from "express";

export default class hospitalController extends RequestService {
	public acceptCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			await this.acceptUserCase(req, res, next);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};

	public rejectCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			await this.rejectUserCase(req, res, next);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	};
}
