const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

test("GET /health devuelve 200 y OK", async (t) => {
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  t.after(() => {
    server.close();
  });

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/health`
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "OK");
});