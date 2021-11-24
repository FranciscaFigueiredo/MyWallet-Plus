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

async function findFinancialEvents({ userId }) {
    try {
        const events = await connection.query(
            `SELECT * FROM "financialEvents" WHERE "userId"=$1 ORDER BY "id" DESC`,
            [userId]
        );
    
        return events.rows;
    } catch (error) {
        return false;
    }
}

export {
    create,
    findFinancialEvents,
}