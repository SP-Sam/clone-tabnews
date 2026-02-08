import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitFowAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      const updatedAtFromResponse = responseBody.updated_at;
      const parsedUpdatedAt = new Date(updatedAtFromResponse).toISOString();

      const database = responseBody.dependencies.database;
      const maxConnections = database.max_connections;
      const openedConnections = database.opened_connections;
      const databaseVersion = database.version;

      expect(response.status).toBe(200);

      expect(updatedAtFromResponse).toBeDefined();
      expect(updatedAtFromResponse).toEqual(parsedUpdatedAt);

      expect(database).toBeDefined();

      expect(maxConnections).toBeDefined();
      expect(maxConnections).toBeGreaterThan(0);

      expect(openedConnections).toBeDefined();
      expect(openedConnections).toEqual(1);

      expect(databaseVersion).toBeDefined();
      expect(databaseVersion).toBe("16.11");
    });
  });
});
