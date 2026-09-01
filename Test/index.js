import psql from "./Func/Main.js";

async function main() {

    console.log("Create a user:");
    console.log("Enter name: ");
    const name = await new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim());
        });
    }   
    );
    console.log("Enter age: ");
    const age = await new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim());
        });
    });

    console.log("Enter ID: ");
    const id = await new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim());
        });
    });

    await psql.Insert("users", {id, name, age });



    await psql.findOne("users", "id", id).then(user => console.log("User found:", user));
    await psql.findAll("users").then(users => console.log("All users:", users));
    await psql.kill();
}

main();
