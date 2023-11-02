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
