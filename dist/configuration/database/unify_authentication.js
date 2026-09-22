import mysql from "mysql2/promise";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const DB_USER = process.env.DB_USER ?? "root";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
const DB_NAME = process.env.DB_NAME ?? "unify_authentication";
export const poolAuthentication = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 25,
    queueLimit: 0,
});
export async function testDatabaseConnection() {
    try {
        const conn = await poolAuthentication.getConnection();
        console.log("✅ MySQL Connected");
        console.log(`Host: ${DB_HOST}:${DB_PORT}`);
        console.log(`Database: ${DB_NAME}`);
        console.log(`User: ${DB_USER}`);
        conn.release();
    }
    catch (err) {
        console.error("❌ MySQL Connection Failed");
        console.error(`Attempted: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        console.error("Message:", err.message);
        if (err.code) {
            console.error("Error Code:", err.code);
        }
        if (err.errno) {
            console.error("Errno:", err.errno);
        }
        throw err;
    }
}
export async function closeDatabaseConnection() {
    await poolAuthentication.end();
}
export default poolAuthentication;
//# sourceMappingURL=unify_authentication.js.map