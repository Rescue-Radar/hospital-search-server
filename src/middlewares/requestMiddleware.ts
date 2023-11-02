import { Request, Response ,NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import { isExistingPatient } from "../queries/requestQueries";
import { JwtPayload } from "../interfaces/requests.auth";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
export async function findAndAddUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const authorizationHeader = req.headers.authorization;
		if (authorizationHeader) {
			const token = authorizationHeader.split(" ")[1];
					const secret = process.env.JWT_SECRET || "";
			if (!secret) {
				throw new Error("JWT_SECRET is not defined");
			}else{
				const payload =  jwt.verify(token, secret) as JwtPayload ;

				console.log(payload);
				if(payload){

					const id = payload.userId;
					const result = await isExistingPatient(id);

				const user = result.rows[0];
				if (user) {
					req.body.userId = id;
					next();
				} else {
					res.status(401).json("user Does not Exist");
				}
				   
				}else{
					res.status(401).json("unauthorized");
				}
			}

		} else {
			res.status(401).json({ error: "LogIn to access" });
		}
	} catch (error) {
		// Handle the error and return a response
		res.status(401).json({ error: "Internal server Error" });
	}
}
