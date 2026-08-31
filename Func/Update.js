import pool from "../db.js";

export async function Update(table, data, whereColumn, whereValue) {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const setClause = columns
        .map((column, index) => `${column} = $${index + 1}`)
        .join(", ");

    const result = await pool.query(
        `UPDATE ${table}
         SET ${setClause}
         WHERE ${whereColumn} = $${values.length + 1}
         RETURNING *`,
        [...values, whereValue]
    );

    return result.rows[0] ?? null;
}