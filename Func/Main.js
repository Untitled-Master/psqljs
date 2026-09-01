import { Query, kill } from "./Query.js";
import { testConnection } from "./Connection.js";

import { findAll, findOne, findMany } from "./Select.js";

import { Insert } from "./Insert.js";
import { Update } from "./Update.js";
import { Remove } from "./Delete.js";

import {
    CreateTable,
    DeleteTable,
    TableExists,
    GetTables,
    GetColumns
} from "./Table.js";


const psql = {
    Query,
    kill,
    testConnection,

    findAll,
    findOne,
    findMany,

    Insert,
    Update,
    Remove,

    CreateTable,
    DeleteTable,
    TableExists,
    GetTables,
    GetColumns
};

export default psql;