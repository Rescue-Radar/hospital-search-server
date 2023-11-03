import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { promisify } from "util";
//import { signupService } from "../service/auth.hospital";
import { NextFunction } from "express-serve-static-core";
import {
	fetchHospitals,
	isExistingPatient,
	fetchCase,
	setStatus,
	setAccepted,
	setRejected,
} from "../queries/requestQueries";
//import { isHospitalExistusingId } from "../queries/auth.hospital";
import { JwtPayload, user_request } from "../interfaces/requests.auth";
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
import { v4 as uuidv4 } from "uuid";

function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	// console.log("lat1->",lat1,"lon1->",lon1,"lat2->",lat2,"lon2->",lon2);
	const R = 6371; // Radius of the Earth in kilometers
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in kilometers

	return distance;
}

function deg2rad(deg: any) {
	return deg * (Math.PI / 180);
}

export class RequestService {
	public searchHospitals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { name, phoneNumber, latitude, longitude, userId }: user_request =
			req.body;
		const maxRadius = 50;
		let radius = 5; // Starting search radius in kilometers
		let filteredHospitals;

		if (!latitude || !longitude || !maxRadius) {
			return res.status(400).json({ error: "Missing required parameters" });
		}

		const findHospitals = async () => {
			const hospitals = await fetchHospitals();
			console.log(hospitals);
			//   filteredHospitals = hospitals.filter((hospital) => {
			//     const distance = calculateDistance(
			//       latitude,
			//       longitude,
			//       hospital.lat,
			//       hospital.lng
			//     );
			//     return distance <= radius;
			//   });

			//   if (filteredHospitals.length === 0 && radius < maxRadius) {
			//     // If no hospitals found and radius is less than max, increase radius
			//     radius += 10; // You can adjust the increment value as needed
			//     setTimeout(findHospitals, 30000); // Retry after a timeout
			//   } else {
			//     res.json({ hospitals: filteredHospitals });
			//   }
		};

		findHospitals();
	};
	public acceptUserCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || !req.body.hospitalId || !req.body.userId) {
			return res.status(400).json({
				error: '"UserId" and "HospitalId" are required!',
			});
		}

		try {
			const hospitalId = req.body.hospitalId;
			const userId = req.body.userId;

			// Call your function to fetch the case from the database
			const caseData = JSON.parse(
				JSON.stringify(await fetchCase(hospitalId, userId))
			);

			if (caseData) {
				if (caseData.status) {
					return res.status(404).json({
						error: "Case already accepted",
					});
				}
				await setStatus(userId);
				await setAccepted(hospitalId, userId);
				res.status(200).json({
					message: "case accepted",
					caseDetails: caseData,
				});
			} else {
				return res.status(404).json({ error: "Case not found" });
			}
		} catch (error) {
			console.error("Error accepting user case:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	};
	public rejectUserCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || !req.body.hospitalId || !req.body.userId) {
			return res.status(400).json({
				error: '"UserId" and "HospitalId" are required!',
			});
		}

		try {
			const hospitalId = req.body.hospitalId;
			const userId = req.body.userId;

			// Call your function to fetch the case from the database
			const caseData = JSON.parse(
				JSON.stringify(await fetchCase(hospitalId, userId))
			);

			if (caseData) {
				await setRejected(hospitalId, userId);
				res.status(200).json({
					message: "case rejected",
				});
			} else {
				return res.status(404).json({ error: "Case not found" });
			}
		} catch (error) {
			console.error("Error accepting user case:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	};
}
