import { Pool } from "pg";

const pool = new Pool({
	user: "ankitkumar",
	host: "rescueradar.cjon0daiisn3.ap-south-1.rds.amazonaws.com", // Your PostgreSQL host
	database: "rescueradar",
	password: "rescueradar",
	port: 5432, // Your PostgreSQL port
	ssl: {
		rejectUnauthorized: true,
	},
});
pool
	.connect()
	.then(() => {
		console.log("Database connection successful");
		// You can perform further database operations here
	})
	.catch((error) => {
		console.error("Database connection error:", error.message);
	});
export default pool;
