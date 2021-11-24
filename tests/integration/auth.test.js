import "../../src/setup.js";
import supertest from "supertest";
import faker from "faker";

import app from "../../src/app.js";

import { createUser } from "../factories/userFactory.js";
import { clearDatabase, closeConnection } from "../utils/database.js";

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeConnection();
});

const agent = supertest(app);

describe("POST /sign-up", () => {
  function generateBody ({ name, email, password } = {}) {
    return {
      name: name || faker.name.findName(),
      email: email || faker.internet.email(),
      password: password || "123456"
    };
  }

  it("should answer with status 400 when body is invalid", async () => {
    const body = {};

    const response = await agent.post("/sign-up").send(body);

    expect(response.status).toEqual(400);
  });

  it("should answer with status 409 when there already is an user with given email", async () => {
    const email = "test@test.com";

    const body = generateBody({ email });
    
    await createUser({ email });

    const response = await agent.post("/sign-up").send(body);

    expect(response.status).toEqual(409);
  });

  it("should answer with status 201 when given valid data", async () => {
    const body = generateBody();

    const response = await agent.post("/sign-up").send(body);

    expect(response.status).toEqual(201);
  });
});

describe("POST /sign-in", () => {
  function generateBody ({ email, password } = {}) {
    return {
      email: email || faker.internet.email(),
      password: password || "123456"
    };
  }

  it("should answer with status 400 when body is invalid", async () => {
    const body = {};

    const response = await agent.post("/sign-in").send(body);

    expect(response.status).toEqual(400);
  });

  it("should answer with status 401 when user doesnt exist", async () => {
    const body = generateBody();

    const response = await agent.post("/sign-in").send(body);

    expect(response.status).toEqual(401);
  });

  it("should answer with status 401 when user exists but password is wrong", async () => {
    const body = generateBody();

    await createUser({ email: body.email, password: body.password.slice(1) });

    const response = await agent.post("/sign-in").send(body);

    expect(response.status).toEqual(401);
  });

  it("should answer with status 200 when user exists and password is correct", async () => {
    const body = generateBody();

    await createUser(body);

    const response = await agent.post("/sign-in").send(body);

    expect(response.status).toEqual(200);
  });
});
