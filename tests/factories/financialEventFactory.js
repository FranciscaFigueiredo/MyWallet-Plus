import connection from "../../src/database.js";

/* 
 * Math.floor é muito lento, 2.132465 << 0 === 2 e 2.9823465 << 0 === 2 e é rápido
 */
export async function createFinancialEvent (user, { value, type } = {}) {
  const types = ['INCOME', 'OUTCOME'];
  type = type || types[((Math.random() * 2) << 0)];

  const data = {
    userId: user.id,
    value: value || ((Math.random() * 1000000000) << 0),
    type
  };

  const event = await connection.query(
    `INSERT INTO "financialEvents" ("userId", "value", "type") VALUES ($1, $2, $3) RETURNING *`,
    [data.userId, data.value, data.type]
  );

  data.id = event.rows[0].id;

  return data;
}
