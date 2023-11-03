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
  insertIntoTicketIssue,
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
    const { name, phoneNumber, latitude, longitude,userId }: user_request = req.body;
    const maxRadius = 50;
    let radius = 5; // Starting search radius in kilometers
    let filteredHospitals;

    if (!latitude || !longitude || !maxRadius) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const findHospitals = async () => {
      const hospitalResponse = await fetchHospitals();
	  const hospitals = hospitalResponse.rows;
	//   console.log("hospitals->",hospitals);
      filteredHospitals = hospitals.filter((hospital) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          hospital.latitude,
          hospital.longitude
        );
        return distance <= radius;
      });


	//   insert into ticket_issue table 
	  filteredHospitals.forEach(async(element) => {
		const id = uuidv4();
		const timeStampe = new Date().toLocaleString();
    const acceptCase = false;
    const rejectCase = false;
		const response = await insertIntoTicketIssue(id,name,phoneNumber,element.id,userId,false,timeStampe,latitude,longitude,acceptCase,rejectCase);
	  });

	  



	//   console.log(filteredHospitals.length,"filtered->",filteredHospitals);

	  if (filteredHospitals.length === 0 && radius >= maxRadius) {
		// If no hospitals found and radius is greater than max, return error
		res.status(400).json({ error: "No hospitals found" });
	  } else if ( radius < maxRadius) {
		// If no hospitals found and radius is less than max, increase radius
		radius += 10; // You can adjust the increment value as needed
		setTimeout(findHospitals, 30000); // Retry after a timeout
	  } else {
		res.json({ hospitals: filteredHospitals });
	  }
	



    };

	
    findHospitals();
  };
	public acceptUserCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || !req.body.hospitalId || !req.body.patientId) {
			return res.status(400).json({
				error: '"UserId" and "HospitalId" are required!',
			});
		}

	
			const hospitalId = req.body.hospitalId;
			const patientId = req.body.patientId;

			// Call your function to fetch the case from the database
			const caseData = JSON.parse(
				JSON.stringify(await fetchCase(hospitalId, patientId))
			);

			if (caseData) {
				if (caseData.status) {
					return res.status(404).json({
						error: "Case already accepted",
					});
				}
				await setStatus(patientId);
				await setAccepted(hospitalId, patientId);
				res.status(200).json({
					message: "case accepted",
					caseDetails: caseData.rows[0],
				});
			} else {
				return res.status(404).json({ error: "Case not found" });
			}
	
	};
	public rejectUserCase = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body || !req.body.hospitalId || !req.body.patientId) {
			return res.status(400).json({
				error: '"UserId" and "HospitalId" are required!',
			});
		}

		
			const hospitalId = req.body.hospitalId;
			const patientId = req.body.patientId;

			// Call your function to fetch the case from the database
			const caseData = JSON.parse(
				JSON.stringify(await fetchCase(hospitalId, patientId))
			);

			if (caseData) {
				await setRejected(hospitalId, patientId);
				res.status(200).json({
					message: "case rejected",
				});
			} else {
				return res.status(404).json({ error: "Case not found" });
			}
		
	};
}
