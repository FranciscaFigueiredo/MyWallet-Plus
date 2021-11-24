import "../../src/setup.js";
import supertest from "supertest";
import faker from "faker";

import app from "../../src/app.js";

import { createToken } from "../factories/userFactory.js";
import { createFinancialEvent } from "../factories/financialEventFactory.js";
import { clearDatabase, closeConnection } from "../utils/database.js";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeConnection();
});

const agent = supertest(app);

describe("POST /financial-events", () => {
  function generateBody ({ user, value, type } = {}) {
    return {
      userId: user?.id || null,
      value: value || ((Math.random() * 1000000000) << 0),
      type: type || ['INCOME', 'OUTCOME'][((Math.random() * 2) << 0)]
    };
  }

  it("should answer with status 401 when no token is given", async () => {
    const body = {};

    const response = await agent.post("/financial-events").send(body);

    expect(response.status).toEqual(401);
  });

  it("should answer with status 401 when invalid token is given", async () => {
    const body = {};

    const response = await agent.post("/financial-events").send(body).set("Authorization", "Bearer invalid_token");

    expect(response.status).toEqual(401);
  });

  it("should answer with status 400 when body is invalid and token is valid", async () => {
    const { token } = await createToken();
    
    const body = {};

    const response = await agent.post("/financial-events").send(body).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(400);
  });

  it("should answer with status 400 when event is of invalid type", async () => {
    const { token } = await createToken();

    const body = generateBody({ type: 'invalid_type' });

    const response = await agent.post("/financial-events").send(body).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(400);
  });

  it("should answer with status 400 when value is negative", async () => {
    const { token } = await createToken();

    const body = generateBody({ value: -1 });

    const response = await agent.post("/financial-events").send(body).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(400);
  });

  it("should answer with status 201 when everything is valid", async () => {
    const { token } = await createToken();

    const body = generateBody();

    const response = await agent.post("/financial-events").send(body).set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(201);
  });
});

describe("GET /financial-events", () => {
  it("should answer with status 401 when no token is given", async () => {
    const response = await agent.get("/financial-events");

    expect(response.status).toEqual(401);
  });

  it("should answer with status 401 when invalid token is given", async () => {
    const response = await agent.get("/financial-events").set("Authorization", "Bearer invalid_token");

    expect(response.status).toEqual(401);
  });

  it("should answer with status 200 when everything is valid", async () => {
    const { token } = await createToken();

    const response = await agent.get("/financial-events").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
  });

  it("should answer with all financial events when everything is valid", async () => {
    const { user, token } = await createToken();
    const event = await createFinancialEvent(user);

    const response = await agent.get("/financial-events").set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual([event]);
  });
});

describe("GET /financial-events/sum", () => {
  it("should answer with status 401 when no token is given", async () => {
    const response = await agent.get("/financial-events/sum");

    expect(response.status).toEqual(401);
  });

  it("should answer with status 401 when invalid token is given", async () => {
    const response = await agent.get("/financial-events/sum").set("Authorization", "Bearer invalid_token");

    expect(response.status).toEqual(401);
  });

  it("should answer with status 200 when everything is valid", async () => {
    const { token } = await createToken();

    const response = await agent.get("/financial-events/sum").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
  });

  it("should answer with all financial events when everything is valid", async () => {
    const { user, token } = await createToken();
    await createFinancialEvent(user, { value: 10, type: "INCOME" });
    await createFinancialEvent(user, { value: 5, type: 'OUTCOME' });

    const response = await agent.get("/financial-events/sum").set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({ sum: 5 });
  });
});

