import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import connection from "./database.js";
import * as userController from "./controllers/userController.js";
import * as financeController from "./controllers/financeController.js";
import { auth } from "./middlewares/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-up", userController.signUp);

app.post("/sign-in", userController.signIn);

app.post("/financial-events", auth, financeController.postEvents);

app.get("/financial-events", auth, financeController.getEvents);

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
