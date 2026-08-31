import pool from "../db.js";

export async function findAll(table) {
    const result = await pool.query(`SELECT * FROM ${table}`);

    return result.rows;
}

export async function findOne(table, column, value) {
    const result = await pool.query(
        `SELECT * FROM ${table} WHERE ${column} = $1 LIMIT 1`,
        [value]
    );

    return result.rows[0] ?? null;
}

export async function findMany(table, column, value) {
    const result = await pool.query(
        `SELECT * FROM ${table} WHERE ${column} = $1`,
        [value]
    );

    return result.rows;
}