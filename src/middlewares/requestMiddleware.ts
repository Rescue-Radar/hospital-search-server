import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { promisify } from "util";
import { NextFunction } from "express-serve-static-core";
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
			} else {
				try {
					const payload = jwt.verify(token, secret) as JwtPayload;
					if (payload) {
						const id = payload.userId;
						const result = await isExistingPatient(id);

						const user = result.rows[0];
						if (user) {
							req.body.userId = id;
							next();
						} else {
							res.status(401).json("unauthorized");
						}
					}
				} catch (error: any) {
					console.log(error);
					if (error.name === "TokenExpiredError") {
						// Handle the expired JWT error
						res.status(401).json({ error: "JWT token has expired" });
					} else {
						// Handle other JWT verification errors
						res.status(401).json({ error: "JWT verification failed" });
					}
				}
			}
		} else {
			res.status(401).json({ error: "LogIn to access" });
		}
	} catch (error) {
		// Handle other errors
		res.status(401).json({ error: "Internal server Error" });
	}
}

export async function protect(req: Request, res: Response, next: NextFunction) {
	try {
		const authorizationHeader = req.headers.authorization;
		if (authorizationHeader) {
			const token = authorizationHeader.split(" ")[1];
			const secret = process.env.JWT_SECRET || "";
			if (!secret) {
				throw new Error("JWT_SECRET is not defined");
			} else {
				try {
					const payload = jwt.verify(token, secret) as JwtPayload;
					if (payload) {
						next();
					}
				} catch (error: any) {
					console.log(error);
					if (error.name === "TokenExpiredError") {
						// Handle the expired JWT error
						res.status(401).json({ error: "JWT token has expired" });
					} else {
						// Handle other JWT verification errors
						res.status(401).json({ error: "JWT verification failed" });
					}
				}
			}
		} else {
			res.status(401).json({ error: "LogIn to access" });
		}
	} catch (error) {
		// Handle other errors
		res.status(401).json({ error: "Internal server Error" });
	}
}
