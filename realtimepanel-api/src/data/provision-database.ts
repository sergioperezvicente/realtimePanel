import { Client } from 'pg';

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
    return str.replace(/'/g, "''"); // duplica comillas simples
  }

  try {
    await client.connect();

    // --------- Crear DB si no existe ----------
    const dbExists =
      ((
        await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
          targetDb,
        ])
      ).rowCount ?? 0) > 0;

    if (!dbExists) {
      await client.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Database "${targetDb}" creada.`);
    } else {
      console.log(`ℹ️ Database "${targetDb}" ya existe.`);
    }

    // --------- Crear usuario si no existe ----------
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
      console.log(`✅ Usuario "${targetUser}" creado.`);
    } else {
      await client.query(
        `ALTER USER "${targetUser}" WITH ENCRYPTED PASSWORD '${escapeLiteral(targetPass)}'`,
      );
      console.log(
        `ℹ️ Usuario "${targetUser}" ya existía — contraseña actualizada.`,
      );
    }

    // --------- Privilegios a nivel de base de datos ----------
    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE "${targetDb}" TO "${targetUser}"`,
    );
    console.log(
      `✅ Privilegios de "${targetUser}" sobre "${targetDb}" otorgados.`,
    );

    // ---------------------------------------------
    // AHORA: Conceder permisos en el esquema "public"
    // ---------------------------------------------

    // Abrimos una segunda conexión, esta vez a la base de datos de la app
    const appClient = new Client({
      host,
      port,
      user: rootUser,
      password: rootPass,
      database: targetDb, // importante para GRANT en el esquema
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

    console.log(
      `✅ Permisos completos sobre el esquema "public" otorgados a "${targetUser}".`,
    );

    await appClient.end();
  } finally {
    await client.end();
  }
}
