import { readMigrationFiles } from '~/migrator.ts';
import { sql } from '~/sql/sql.ts';
export async function migrate(db, callback, config) {
    const migrations = readMigrationFiles(config);
    const migrationsTable = config.migrationsTable ?? '__drizzle_migrations';
    const migrationTableCreate = sql `
		create table if not exists ${sql.identifier(migrationsTable)} (
			id serial primary key,
			hash text not null,
			created_at bigint
		)
	`;
    await db.execute(migrationTableCreate);
    const dbMigrations = await db.select({
        id: sql.raw('id'),
        hash: sql.raw('hash'),
        created_at: sql.raw('created_at'),
    }).from(sql.identifier(migrationsTable).getSQL()).orderBy(sql.raw('created_at desc')).limit(1);
    const lastDbMigration = dbMigrations[0];
    const queriesToRun = [];
    for (const migration of migrations) {
        if (!lastDbMigration
            || Number(lastDbMigration.created_at) < migration.folderMillis) {
            queriesToRun.push(...migration.sql, `insert into ${sql.identifier(migrationsTable).value} (\`hash\`, \`created_at\`) values('${migration.hash}', '${migration.folderMillis}')`);
        }
    }
    await callback(queriesToRun);
}
//# sourceMappingURL=migrator.js.map