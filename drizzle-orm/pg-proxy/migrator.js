import { readMigrationFiles } from '~/migrator.ts';
import { sql } from '~/sql/sql.ts';
export async function migrate(db, callback, config) {
    const migrations = readMigrationFiles(config);
    const migrationTableCreate = sql `
		CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
    await db.execute(sql `CREATE SCHEMA IF NOT EXISTS "drizzle"`);
    await db.execute(migrationTableCreate);
    const dbMigrations = await db.execute(sql `SELECT id, hash, created_at FROM "drizzle"."__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`);
    const lastDbMigration = dbMigrations[0] ?? undefined;
    const queriesToRun = [];
    for (const migration of migrations) {
        if (!lastDbMigration
            || Number(lastDbMigration.created_at) < migration.folderMillis) {
            queriesToRun.push(...migration.sql, `INSERT INTO "drizzle"."__drizzle_migrations" ("hash", "created_at") VALUES('${migration.hash}', '${migration.folderMillis}')`);
        }
    }
    await callback(queriesToRun);
}
//# sourceMappingURL=migrator.js.map