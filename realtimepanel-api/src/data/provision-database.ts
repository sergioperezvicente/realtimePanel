import { Logger } from '@nestjs/common';
import { Client } from 'pg';

const db = new Logger('Database')

export async function provisionDatabase(): Promise<void> {
  const host = process.env.PG_HOST;
  const port = Number(process.env.PG_PORT);
  const rootUser = process.env.PG_ROOT_USER;
  const rootPass = process.env.PG_ROOT_PASSWORD;
  const targetDb = process.env.APP_DB_NAME;
  const targetUser = process.env.APP_DB_USER;
  const targetPass = process.env.APP_DB_PASSWORD ?? '';
  if (!targetPass) {
    throw new Error('APP_DB_PASSWORD environment variable is required');
  }

  const client = new Client({
    host,
    port,
    user: rootUser,
    password: rootPass,
    database: 'postgres',
  });

  function escapeLiteral(str: string): string {
    return str.replace(/'/g, "''");
  }

  try {
    await client.connect();

    const dbExists =
      ((
        await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
          targetDb,
        ])
      ).rowCount ?? 0) > 0;

    if (!dbExists) {
      await client.query(`CREATE DATABASE "${targetDb}"`);
      db.log(`Database "${targetDb}" created.`);
    } else {
      db.log(`Database "${targetDb}" exists.`);
    }

    const userExists =
      ((
        await client.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [
          targetUser,
        ])
      ).rowCount ?? 0) > 0;

    if (!userExists) {
      await client.query(
        `CREATE USER "${targetUser}" WITH ENCRYPTED PASSWORD '${escapeLiteral(targetPass)}'`,
      );
      db.log(`User "${targetUser}" created.`);
    } else {
      await client.query(
        `ALTER USER "${targetUser}" WITH ENCRYPTED PASSWORD '${escapeLiteral(targetPass)}'`,
      );
      db.warn(
        `User "${targetUser}" exists: password updated.`,
      );
    }

    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE "${targetDb}" TO "${targetUser}"`,
    );
    db.log(
      `Privileges granted to "${targetUser}" over "${targetDb}".`,
    );

    const appClient = new Client({
      host,
      port,
      user: rootUser,
      password: rootPass,
      database: targetDb,
    });

    await appClient.connect();

    await appClient.query(`GRANT USAGE ON SCHEMA public TO "${targetUser}"`);
    await appClient.query(`GRANT CREATE ON SCHEMA public TO "${targetUser}"`);
    await appClient.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${targetUser}"`,
    );
    await appClient.query(
      `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${targetUser}"`,
    );
    await appClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO "${targetUser}"`,
    );
    await appClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO "${targetUser}"`,
    );

    db.log(
      `All privileges on schema "public" granted to "${targetUser}".`,
    );

    await appClient.end();
  } finally {
    await client.end();
  }
}
