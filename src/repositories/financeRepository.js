import connection from "../database.js";

async function create({ userId, value, type }) {
    try {
        await connection.query(
            `INSERT INTO "financialEvents" ("userId", "value", "type") VALUES ($1, $2, $3)`,
            [userId, value, type]
        );
    
        return true;
    } catch (error) {
        return false;
    }
}

export {
    create,
}