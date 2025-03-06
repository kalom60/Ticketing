import request from "supertest";
import createTestServer from "../server";

const server = createTestServer();
const app = server.listen(8080, () =>
  console.log(`✅ Server running on port ${8080}`),
);

type ITicket = {
  _id: string;
  title: string;
  description: string;
  status: string;
};

let adminToken: string;
let userToken: string;
const tickets: ITicket[] = [];

describe("Ticket API", () => {
  beforeAll(async () => {
    const adminResponse = await request(app).post("/api/v1/auth/signup").send({
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const userResponse = await request(app).post("/api/v1/auth/signup").send({
      email: "user@example.com",
      password: "password123",
      role: "user",
    });

    adminToken = adminResponse.body.accessToken;
    userToken = userResponse.body.accessToken;
  });

  afterAll(() => {
    app.close();
  });

  it("should create a ticket as admin", async () => {
    const res = await request(app)
      .post("/api/v1/tickets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Bug Report",
        description: "There is a bug in the system",
        status: "Open",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Bug Report");
    tickets.push(res.body);
  });

  it("should create a ticket as user", async () => {
    const res = await request(app)
      .post("/api/v1/tickets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "JS Bug",
        description: "Javascript Bug",
        status: "Open",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "JS Bug");
    tickets.push(res.body);
  });

  it("should fetch all tickets as admin", async () => {
    const res = await request(app)
      .get("/api/v1/tickets")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should fetch all tickets as user", async () => {
    const res = await request(app)
      .get("/api/v1/tickets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should update a his/her ticket (admin only)", async () => {
    const res = await request(app)
      .put(`/api/v1/tickets/${tickets[0]._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Closed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Closed");
  });

  it("should update users ticket (admin only)", async () => {
    const res = await request(app)
      .put(`/api/v1/tickets/${tickets[1]._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Closed" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Closed");
  });

  it("should not update users ticket by user", async () => {
    const res = await request(app)
      .put(`/api/v1/tickets/${tickets[1]._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "Closed" });

    expect(res.status).toBe(403);
  });

  it("should return 403 for unauthorized update", async () => {
    const res = await request(app)
      .put(`/api/v1/tickets/${tickets[1]._id}`)
      .set("Authorization", `Bearer invalid-token`)
      .send({ status: "Closed" });

    expect(res.status).toBe(401);
  });
});
