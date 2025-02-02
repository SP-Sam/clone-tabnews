const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(_error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");

      checkPostgres();

      return;
    }

    console.log("\nPostgres está pronto!\n");
  }
}

process.stdout.write("Postgres está sendo iniciado");

checkPostgres();
