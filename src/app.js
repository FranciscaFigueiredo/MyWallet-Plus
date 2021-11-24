import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connection from "./database.js";
import * as userController from "./controllers/userController.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", userController.signUp);

app.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await connection.query(
      `SELECT * FROM "users" WHERE "email"=$1`,
      [email]
    );

    if (!user.rows[0] || !bcrypt.compareSync(password, user.rows[0].password)) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({
      id: user.rows[0].id
    }, process.env.JWT_SECRET);

    res.send({
      token
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/financial-events", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.split('Bearer ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    let user;

    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.sendStatus(401);
    }

    const { value, type } = req.body;

    if (!value || !type) {
      return res.sendStatus(400);
    }

    if (!['INCOME', 'OUTCOME'].includes(type)) {
      return res.sendStatus(400);
    }

    if (value < 0) {
      return res.sendStatus(400);
    }

    await connection.query(
      `INSERT INTO "financialEvents" ("userId", "value", "type") VALUES ($1, $2, $3)`,
      [user.id, value, type]
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/financial-events", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.split('Bearer ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    let user;

    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.sendStatus(401);
    }

    const events = await connection.query(
      `SELECT * FROM "financialEvents" WHERE "userId"=$1 ORDER BY "id" DESC`,
      [user.id]
    );

    res.send(events.rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/financial-events/sum", async (req, res) => {
  try {
    const authorization = req.headers.authorization || "";
    const token = authorization.split('Bearer ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    let user;

    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.sendStatus(401);
    }

    const events = await connection.query(
      `SELECT * FROM "financialEvents" WHERE "userId"=$1 ORDER BY "id" DESC`,
      [user.id]
    );

    const sum = events.rows.reduce((total, event) => event.type === 'INCOME' ? total + event.value : total - event.value, 0);

    res.send({ sum });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default app;
