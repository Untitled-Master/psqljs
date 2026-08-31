import pool from "../db.js";

export async function Insert(table, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const placeholders = values
        .map((_, index) => `$${index + 1}`)
        .join(", ");

    const result = await pool.query(
        `INSERT INTO ${table} (${columns.join(", ")})
         VALUES (${placeholders})
         RETURNING *`,
        values
    );

    return result.rows[0];
}