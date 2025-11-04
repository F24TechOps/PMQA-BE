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

xdescribe("GET RUN - /api/qa/runs/:id", () => {
  test("200 - Returns data of specified run", async () => {
    const response = await request.get("/api/qa/runs/sNwBWLZIaXGAwfHGn3NT")
    expect(response.body)
  });
});

xdescribe("Run result", () => {
  test("Getting result from runs with run ID", async () => {
    const res = await request.get("/api/qa/runs/:id/result");
    expect(res.json);
  });
});

xdescribe("POST RUN - /api/qa/runs", () => {
  test("Creates a new run and returns id", async () => {
    const transactionContext = {
    accountId: "testing",
    cycleId: "testing-c368-46cc-9fd2-4cba6184c90d",
    transactionId: "testing-fa3e-4678-97dc-10811cfab126" 
    }
    const response = await request.post("/api/qa/runs").send(transactionContext)
    expect(response.text)
  });
});

describe("POST UPLOAD - /api/uploads", () => {
  test("Creates a new upload and returns id", async () => {
    const body = {expectedFields: ["test", "2te2st", "test 3 tokyo drift"]}
    const response = await request.post("/api/uploads").send(body)
    console.log(response.text)
    expect(response.text)
  });
});