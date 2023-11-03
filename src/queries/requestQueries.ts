import pool from "../configs/db.config";
export const isExistingPatient = async (userId: string) => {
	const checkUserIdQuery = "SELECT * FROM public.patient WHERE id = $1";

	const result = await pool.query(checkUserIdQuery, [userId]);
	return result;
};

export const fetchHospitals = async () => {
	const getHospitals = "SELECT latitude,longitude FROM public.hospitals";

	const result = await pool.query(getHospitals);
	return result;
};

export const fetchCase = async (hospitalId: string, userId: string) => {
	const getCaseQuery =
		"SELECT * FROM public.ticket_issued WHERE hospitalId = $1 AND patientId = $2";

	const result = await pool.query(getCaseQuery, [hospitalId, userId]);
	return result;
};

export const setStatus = async (patientId: string) => {
	const setStatusQuery =
		"UPDATE public.ticket_issued SET status=true WHERE patientId = $1";

	await pool.query(setStatusQuery, [patientId]);
};

export const setAccepted = async (hospitalId: string, userId: string) => {
	const acceptCaseQuery =
		"UPDATE public.ticket_issued SET acceptCase=true,rejectCase=false WHERE  hospitalId = $1 AND patientId = $2";

	const result = await pool.query(acceptCaseQuery, [hospitalId, userId]);
	return result;
};

export const setRejected = async (hospitalId: string, userId: string) => {
	const rejectCaseQuery =
		"UPDATE public.ticket_issued SET acceptCase=false,rejectCase=true WHERE  hospitalId = $1 AND patientId = $2";

	const result = await pool.query(rejectCaseQuery, [hospitalId, userId]);
	return result;
};
