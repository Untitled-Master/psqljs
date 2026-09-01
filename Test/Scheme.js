import psql from "../Func/Main.js";

await psql.CreateTable("users", {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(255)",
    age: "INT"
});

await psql.CreateTable("products", {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(255)",
    price: "DECIMAL"
});

await psql.CreateTable("orders", {
    id: "SERIAL PRIMARY KEY",
    user_id: "INT REFERENCES users(id)",
    product_id: "INT REFERENCES products(id)",
    quantity: "INT"
});

await psql.GetTables().then(tables => console.log("Tables:", tables));