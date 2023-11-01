import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { promisify } from "util";
//import { signupService } from "../service/auth.hospital";
import { NextFunction } from "express-serve-static-core";
import * as dotenv from "dotenv";
import { fetchHospitals, isExistingPatient } from "../queries/requestQueries";
//import { isHospitalExistusingId } from "../queries/auth.hospital";
import { JwtPayload, user_request } from "../interfaces/requests.auth";
dotenv.config({ path: `${__dirname}/.env` });

function calculateDistance(lat1, lon1, lat2, lon2) {
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

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

export class RequestService {
	public searchHospitals = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const { name, phoneNumber, latitude, longitude }: user_request = req.body;
		const maxRadius = 100;
		let radius = 5; // Starting search radius in kilometers
		let filteredHospitals;

		if (!latitude || !longitude || !maxRadius) {
			return res.status(400).json({ error: "Missing required parameters" });
		}

		const findHospitals = () => {
			const hospitals = fetchHospitals();

			filteredHospitals = hospitals.filter((hospital) => {
				const distance = calculateDistance(
					latitude,
					longitude,
					hospital.lat,
					hospital.lng
				);
				return distance <= radius;
			});

			if (filteredHospitals.length === 0 && radius < maxRadius) {
				// If no hospitals found and radius is less than max, increase radius
				radius += 10; // You can adjust the increment value as needed
				setTimeout(findHospitals, 30000); // Retry after a timeout
			} else {
				res.json({ hospitals: filteredHospitals });
			}
		};

		findHospitals();
	};
}