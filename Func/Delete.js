import pool from "../db.js";

export async function Remove(table, column, value) {
    const result = await pool.query(
        `DELETE FROM ${table}
         WHERE ${column} = $1
         RETURNING *`,
        [value]
    );

    return result.rows[0] ?? null;
}