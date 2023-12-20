import postgres from "postgres";

const sql = postgres(process.env.DB_URI as string);

export default sql;
