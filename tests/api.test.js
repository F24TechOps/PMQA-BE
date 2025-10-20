import supertest from "supertest";
import server from "../index.js";

const request = supertest(server);

afterAll(async () => {
  await server.close();
});

xdescribe("queueing process", () => {
  test("adding a task to the queue", async () => {
    const res = await request.get("/api/qa/runs/abc/queue");
    expect(res.json);
  });
});

describe("/api/qa/runs/:id/state", () => {
  test("200 - Returns state of specified run", async () => {
    const response = await request.get("/api/qa/runs/sNwBWLZIaXGAwfHGn3NT/state")
    expect(response.body)
  });
});


describe("Run result", () => {
  test("Getting result from runs with run ID", async () => {
    const res = await request.get("/api/qa/runs/:id/result");
    console.log(res.body)
    expect(res.json);
  });
}


);
