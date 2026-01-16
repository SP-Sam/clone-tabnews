test("GET to /api/v1/status should return status 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.message).toBe("O servidor está de pé!");
});
