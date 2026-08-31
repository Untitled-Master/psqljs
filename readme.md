# psqljs 🐘

A lightweight Node.js utility for working with PostgreSQL without the boilerplate.

**psqljs** wraps `pg` (`Pool`) with simple, reusable helpers for querying, CRUD, and table management — so you don't have to rewrite connection and query logic for every project.

> ⚠️ **Beta:** psqljs is currently under development. The API may change and is not yet recommended for production.

## Features

- 🔌 **Zero-config pool** via `dotenv` + `pg` (`db.js:7`)
- 💬 Raw SQL via `Query(sql, values)` with parameterized values
- 🔍 Select helpers: `findAll`, `findOne`, `findMany`
- ✏️ CRUD helpers: `Insert`, `Update`, `Remove` (with `RETURNING *`)
- 🗄️ Table helpers: `CreateTable`, `DeleteTable`, `TableExists`, `GetTables`, `GetColumns`
- 📦 ESM-first (`package.json:13` — `"type": "module"`)

## Installation

```bash
npm install psqljs
# not published yet — for local development:
git clone https://github.com/your-org/psqljs.git
cd psqljs
npm install
```

**Requirements:** Node.js >= 18, PostgreSQL, `pg@^8.23.0`, `dotenv@^17.4.2`.

## Configuration

`psqljs` reads connection info from environment variables via `dotenv` in `db.js:1-13`.

Create a `.env` in the project root:

```env
host=localhost
port=5432
database=mydb
user=postgres
password=your_password
```

These map directly to `new Pool({ host, port, database, user, password })` in `db.js:7-13`. `db.js:15-16` exports both named `pool` and default for advanced use.

> `.env` is gitignored (` .gitignore:2`).

## Quick Start

```js
import psql from "./Func/Main.js";

// 1. Test connection
if (await psql.testConnection()) {
  console.log("Connection successful");
}

// 2. Raw query
const rows = await psql.Query("SELECT * FROM users WHERE id = $1", [1]);

// 3. CRUD helpers
const user = await psql.Insert("users", { name: "Ada", email: "ada@example.com" });
const found = await psql.findOne("users", "email", "ada@example.com");
const updated = await psql.Update("users", { name: "Ada Lovelace" }, "id", user.id);
const removed = await psql.Remove("users", "id", user.id);
```

Or import helpers directly:

```js
import { Query } from "./Func/Query.js";
import { Insert } from "./Func/Insert.js";
import { CreateTable } from "./Func/Table.js";
```

## API Reference

All helpers are re-exported from `Func/Main.js:19-36`.

### Core

#### `Query(sql, values = [])` — `Func/Query.js:3`
Execute raw parameterized SQL. Returns `result.rows`.

```js
import { Query } from "./Func/Query.js";

await Query("SELECT * FROM users WHERE id = $1", [1]);
await Query("SELECT 1"); // -> [{ "?column?": 1 }]
```

#### `testConnection()` — `Func/Connection.js:4`
Runs `SELECT 1` via `Query`. Returns `true` if rows returned, `false` on error.

```js
import { testConnection } from "./Func/Connection.js";
await testConnection(); // true | false
```

> **Note:** `testConnection` calls `pool.end()` in `finally` (`Func/Connection.js:14`). After calling it, the pool is closed and subsequent queries will fail unless you recreate the pool. Avoid using it in long-lived servers — use it for CLI checks / `index.js:4`.

### Select Helpers — `Func/Select.js`

| Function | Signature | Description | Returns |
|---|---|---|---|
| `findAll` | `findAll(table)` | `SELECT * FROM table` | `rows[]` |
| `findOne` | `findOne(table, column, value)` | `SELECT ... WHERE column = $1 LIMIT 1` | `row \| null` |
| `findMany` | `findMany(table, column, value)` | `SELECT ... WHERE column = $1` | `rows[]` |

```js
await findAll("users");
await findOne("users", "id", 42);        // null if not found
await findMany("users", "role", "admin");
```

> Table/column names are interpolated (`Func/Select.js:4,11,20`). Pass trusted values only — they are not parameterized.

### Write Helpers

#### `Insert(table, data)` — `Func/Insert.js:3`
Inserts one row. `data` is an object `{ column: value }`. Builds `$1, $2...` placeholders and returns `RETURNING *`.

```js
await Insert("users", { name: "Grace", email: "grace@example.com" });
// -> { id: 1, name: "Grace", email: "grace@example.com", ... }
```

#### `Update(table, data, whereColumn, whereValue)` — `Func/Update.js:3`
Updates rows matching `whereColumn = whereValue`. `data` is the `SET` object. Returns first updated row or `null`.

```js
await Update("users", { name: "Grace Hopper", role: "admin" }, "id", 1);
```

#### `Remove(table, column, value)` — `Func/Delete.js:3`
Deletes rows matching `column = $1`. Returns deleted row or `null`.

```js
await Remove("users", "id", 1);
```

### Table Helpers — `Func/Table.js`

| Function | Signature | Description |
|---|---|---|
| `CreateTable` | `CreateTable(table, columns)` | `CREATE TABLE "table" (...)` — `columns` is `{ name: "TEXT NOT NULL", age: "INT" }` (`Func/Table.js:3`) |
| `DeleteTable` | `DeleteTable(table)` | `DROP TABLE "table"` (`Func/Table.js:15`) |
| `TableExists` | `TableExists(table)` | Checks `information_schema.tables` (`Func/Table.js:19`), returns `boolean` |
| `GetTables` | `GetTables()` | Lists `BASE TABLE`s in `public` schema (`Func/Table.js:31`) |
| `GetColumns` | `GetColumns(table)` | Lists `column_name, data_type, is_nullable, column_default` for table (`Func/Table.js:41`) |

```js
await CreateTable("users", {
  id: "SERIAL PRIMARY KEY",
  name: "TEXT NOT NULL",
  email: "TEXT UNIQUE NOT NULL",
  created_at: "TIMESTAMP DEFAULT NOW()"
});

await TableExists("users"); // true
await GetTables();          // [{ table_name: "users" }, ...]
await GetColumns("users");  // [{ column_name: "id", data_type: "integer", ... }]
await DeleteTable("users");
```

## Project Structure

```
psqljs/
├── db.js              # pg Pool setup from .env
├── index.js           # Demo: testConnection()
├── Func/
│   ├── Main.js        # Default export aggregating all helpers
│   ├── Connection.js  # testConnection()
│   ├── Query.js       # Query()
│   ├── Select.js      # findAll / findOne / findMany
│   ├── Insert.js      # Insert()
│   ├── Update.js      # Update()
│   ├── Delete.js      # Remove()
│   └── Table.js       # CreateTable / DeleteTable / TableExists / GetTables / GetColumns
├── package.json       # ESM, pg, dotenv
└── .env               # host, port, database, user, password (gitignored)
```

## How It Works

1. `db.js` creates a singleton `Pool` from env vars.
2. Every helper imports `pool` and calls `pool.query(...)`.
3. `Query` is the primitive — all other helpers build on top of it or `pool` directly.
4. See `index.js:1-11` for a minimal connection check.

## Status & Roadmap

🚧 **Beta / Early Development** — API is stabilizing.

- [x] Raw query + select helpers
- [x] Insert / Update / Delete
- [x] Table management
- [ ] Transactions / `BEGIN`/`COMMIT` helper
- [ ] Input validation & safer identifier escaping
- [ ] Connection retry / pool config exposure
- [ ] Tests & CI
- [ ] npm publish

## License

MIT — see `package.json:11` (currently `ISC`, will be aligned to MIT).

## Contributing

PRs welcome. Please keep helpers parameterized where possible and add JSDoc for new functions.
