import bcrypt from "bcrypt";
import faker from "faker";
import jwt from "jsonwebtoken";

import connection from "../../src/database.js";

export async function createUser ({ name, email, password } = {}) {
  const data = {
    name: name || faker.name.findName(),
    email: email || faker.internet.email(),
    password: password || "123456",
    hashedPassword: bcrypt.hashSync(password || "123456", 10)
  };

  const user = await connection.query(
    `INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3) RETURNING *`,
    [data.name, data.email, data.hashedPassword]
  );

  data.id = user.rows[0].id;

  return data;
}

export async function createToken ({ user } = {}) {
  user = user || await createUser();

  const token = jwt.sign({
    id: user.id
  }, process.env.JWT_SECRET);

  return {
    user,
    token
  };
}
