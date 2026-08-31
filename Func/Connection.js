import { Query } from "./Query.js";
import pool from "../db.js";

export async function testConnection() {
    try {
        const result = await Query("SELECT 1");

        return result.length > 0; // bcz Query("SELECT 1") returns [{ "?column?": 1 }]

    } catch (error) {
        console.error("Error testing connection:", error);
        return false;
    } finally {
        await pool.end(); // Close the pool after testing the connection
    }
}