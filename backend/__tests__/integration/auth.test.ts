import request from "supertest";
import User from "../../src/models/User";
import createTestServer from "../server";

const server = createTestServer();
const app = server.listen(8080, () =>
  console.log(`✅ Server running on port ${8080}`),
);

describe("Auth API", () => {
  const userData = {
    email: "user@example.com",
    password: "password123",
    role: "user",
  };

  const adminData = {
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(() => {
    app.close();
  });

  it("should signup a new user with user role", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.role).toBe("user");
  });

  it("should signup a new user with admin role", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(adminData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.role).toBe("admin");
  });

  it("should allow without role and save it as a user role", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.role).toBe("user");
  });

  it("should not allow duplicate email", async () => {
    await request(app).post("/api/v1/auth/signup").send(userData);
    const res = await request(app).post("/api/v1/auth/signup").send(userData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should not allow with role other than user and admin", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      email: "test@example.com",
      password: "password123",
      role: "role",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors.role[0]).toBe(
      "Invalid enum value. Expected 'user' | 'admin', received 'role'",
    );
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/v1/auth/signup").send(userData);
    const res = await request(app).post("/api/v1/auth/login").send(userData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should not login with wrong password", async () => {
    await request(app).post("/api/v1/auth/signup").send(userData);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: userData.email, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
