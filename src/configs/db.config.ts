 
import { Pool } from 'pg';
 

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // Your PostgreSQL host
    database: 'rescueradar',
    password: 'root',
    port: 5432, // Your PostgreSQL port
  //   ssl: {
	// 	rejectUnauthorized: true,
	// },
  });
  pool
  .connect()
  .then(() => {
    console.log('Database connection successful');
    // You can perform further database operations here
  })
  .catch((error:any) => {
    console.error('Database connection error:', error.message);
  });
  export default pool;