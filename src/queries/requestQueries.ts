import pool from "../configs/db.config";
export const isExistingPatient = async (userId: string) => {
	const checkUserIdQuery = "SELECT * FROM public.patient WHERE id = $1";

	const result = await pool.query(checkUserIdQuery, [userId]);
	return result;
};
export const isExistingHospital = async (userId: string) => {
	const checkUserIdQuery = "SELECT * FROM public.hospital WHERE id = $1";

	const result = await pool.query(checkUserIdQuery, [userId]);
	return result;
};

export const fetchHospitals = async () => {
	const getHospitals = "SELECT id,name,latitude,longitude FROM public.hospital";

	const result = await pool.query(getHospitals);
	return result;
};


export const insertIntoTicketIssue = async (id:string ,name:string,phoneNumber:number, hospitalId: string ,userId: string, status:boolean,timeStampe:string,latitude:number,longitude:number,acceptCase:boolean,rejectCase:boolean) => {
	const insertIntoTicketIssueQuery = `INSERT INTO public.ticket_issued (id,name,"phoneNumber","hospitalId","patientId",status,"createdAt",latitude,longitude,"acceptCase","rejectCase") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) on conflict ("hospitalId","patientId") 
	do nothing RETURNING *;`;

	const result = await pool.query(insertIntoTicketIssueQuery, [id,name,phoneNumber, hospitalId,userId,status,timeStampe,latitude,longitude,acceptCase,rejectCase]);
	return result;
}


export const fetchTicketIssue = async () => {
	const getTicketIssueQuery = `SELECT * FROM public.ticket_issued WHERE status = false`;

	const result = await pool.query(getTicketIssueQuery);
	return result;
}