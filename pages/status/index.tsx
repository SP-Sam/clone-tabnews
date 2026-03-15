import useSWR from "swr";

const LOADING_TEXT = "Carregando...";

async function fetchAPI(key: string) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    fallbackData: LOADING_TEXT,
  });

  let updatedAtText = data;

  if (!isLoading && data !== LOADING_TEXT) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <p>Última atualização: {updatedAtText}</p>;
}

function DataBaseInfos() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    fallbackData: LOADING_TEXT,
  });

  let maxConnections = data;
  let openedConnections = data;
  let databaseVersion = data;

  if (!isLoading && data !== LOADING_TEXT) {
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
    databaseVersion = data.dependencies.database.version;
  }

  return (
    <div>
      <h2>Database</h2>
      <p>Máximo de conexões aceitas: {maxConnections}</p>
      <p>Conexões abertas: {openedConnections}</p>
      <p>Versão do banco: {databaseVersion}</p>
    </div>
  );
}

function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DataBaseInfos />
    </>
  );
}

export default StatusPage;
