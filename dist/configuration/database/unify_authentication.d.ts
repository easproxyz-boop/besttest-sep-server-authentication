import mysql from "mysql2/promise";
export declare const poolAuthentication: mysql.Pool;
export declare function testDatabaseConnection(): Promise<void>;
export declare function closeDatabaseConnection(): Promise<void>;
export default poolAuthentication;
