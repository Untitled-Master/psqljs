import pool from "../db.js";

export async function Query(sql, values = []) {
    const result = await pool.query(sql, values);

    return result.rows;
}

export async function kill() {
    try {
        if (!pool.ending && !pool.ended) await pool.end();
    } catch {}
    try { process.stdin.pause(); } catch {}
    try { process.stdin.destroy(); } catch {}
}