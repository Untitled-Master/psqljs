import pool from "./db.js";
import Main from "./Func/Main.js";

async function main() {
    try {
        const sql = "SELECT * FROM test";
        const result = await Main.Query(sql);
        console.log("Query result:", result);
    }
    catch (error) {
        console.error("Error executing query:", error);
    }
    finally {
        pool.end();
    }
}

main();
