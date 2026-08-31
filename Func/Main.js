import pool from "../db.js";

async function Query(sql) {
    const result = await pool.query(sql);
    return result.rows;
}

async function testConnection() {
    try {
        const result = await Query("SELECT 1");
        if(result.length > 0) {
            console.log("Database connection successful.");
        }
    } catch (error) {
        console.error("Error testing connection:", error);
    }
}

export default { Query, testConnection };