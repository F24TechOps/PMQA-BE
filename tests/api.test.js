import supertest from "supertest";
import server from "../index.js";

const request = supertest(server);

afterAll(async () => {
  await server.close();
});

describe("queueing process", () => {
  test("adding a task to the queue", async () => {
    const res = await request.get("/api/qa/runs/abc/queue");
    expect(res.json);
  });
});
