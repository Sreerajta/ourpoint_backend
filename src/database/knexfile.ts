// knexfile.ts
import path from 'path';

const BASE_PATH = path.join(__dirname, 'db');

const development = {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(BASE_PATH, 'database.sqlite'),
  },
  migrations: {
    directory: path.join(BASE_PATH, 'migrations'),
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds'),
  },
  useNullAsDefault: true,
};

export = {
  development,
};