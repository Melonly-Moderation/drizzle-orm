import { readMigrationFiles } from '~/migrator.ts';
export async function migrate(db, config) {
    const migrations = readMigrationFiles(config);
    await db.dialect.migrate(migrations, db.session, config);
}
//# sourceMappingURL=migrator.js.map