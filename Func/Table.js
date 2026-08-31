import { Query } from "./Query.js";

export async function CreateTable(table, columns) {
    const columnDefinitions = Object.entries(columns)
        .map(([name, definition]) => `"${name}" ${definition}`)
        .join(", ");

    return await Query(`
        CREATE TABLE "${table}" (
            ${columnDefinitions}
        )
    `);
}

export async function DeleteTable(table) {
    return await Query(`DROP TABLE "${table}"`);
}

export async function TableExists(table) {
    const result = await Query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = $1
        )
    `, [table]);

    return result[0].exists;
}

export async function GetTables() {
    return await Query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    `);
}

export async function GetColumns(table) {
    return await Query(`
        SELECT
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        ORDER BY ordinal_position
    `, [table]);
}