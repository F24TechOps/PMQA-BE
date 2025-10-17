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
})

describe("Run result", () => {
  test("Getting result from runs with run ID", async () => {
    const res = await request.get("/api/qa/runs/:runId/result");
    console.log(res.body)
    expect(res.json);
  });
}


);
