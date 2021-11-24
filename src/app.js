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

app.get("/financial-events/sum", auth, financeController.sumEvents);

export default app;
