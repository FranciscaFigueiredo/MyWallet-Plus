import connection from "../database.js";

async function findEmail({ email }) {
    const existingUserWithGivenEmail = await connection.query(
        `SELECT * FROM "users" WHERE "email"=$1;`,
        [email]
    );

    return existingUserWithGivenEmail.rows;
}

async function create({ name, email, password }) {
    try {
        await connection.query(
            `INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3);`,
            [name, email, password]
        );
    
        return true;
    } catch (error) {
        return false;
    }
}

export {
    findEmail,
    create,
}