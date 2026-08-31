# psqljs 🐘

A lightweight Node.js utility for working with PostgreSQL.

**psqljs** provides simple, reusable functions for connecting to and interacting with your PostgreSQL database, so you don't have to write the same boilerplate every time.

> ⚠️ **Beta:** psqljs is currently under development. The API may change.

## Installation

// not availble yet

## Example

```js
import psql from "psqljs";

const result = await psql.query("SELECT * FROM users");

console.log(result);
```

## Why psqljs?

The goal is to make PostgreSQL easier to use by providing **ready-to-use building blocks** for common database operations.

Instead of repeatedly writing connection and query boilerplate, you can use simple functions:

```js
await psql.query(...);
await psql.insert(...);
await psql.update(...);
await psql.delete(...);
```

More functionality will be added as the project develops.

## Status

🚧 **Beta / Early Development**

psqljs is experimental and not recommended for production use yet.

## License

MIT
