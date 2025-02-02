import { readMigrationFiles } from '~/migrator.ts';
export function migrate(db, config) {
    const migrations = readMigrationFiles(config);
    db.dialect.migrate(migrations, db.session, config);
}
//# sourceMappingURL=migrator.js.map