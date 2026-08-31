import pool from "../db.js";

export async function Query(sql, values = []) {
    const result = await pool.query(sql, values);

    return result.rows;
}

export async function Kill() {
    await pool.end();
}