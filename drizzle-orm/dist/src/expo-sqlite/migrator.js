import { useEffect, useReducer } from 'react';
async function readMigrationFiles({ journal, migrations }) {
    const migrationQueries = [];
    for await (const journalEntry of journal.entries) {
        const query = migrations[`m${journalEntry.idx.toString().padStart(4, '0')}`];
        if (!query) {
            throw new Error(`Missing migration: ${journalEntry.tag}`);
        }
        try {
            const result = query.split('--> statement-breakpoint').map((it) => {
                return it;
            });
            migrationQueries.push({
                sql: result,
                bps: journalEntry.breakpoints,
                folderMillis: journalEntry.when,
                hash: '',
            });
        }
        catch {
            throw new Error(`Failed to parse migration: ${journalEntry.tag}`);
        }
    }
    return migrationQueries;
}
export async function migrate(db, config) {
    const migrations = await readMigrationFiles(config);
    return db.dialect.migrate(migrations, db.session);
}
export const useMigrations = (db, migrations) => {
    const initialState = {
        success: false,
        error: undefined,
    };
    const fetchReducer = (state, action) => {
        switch (action.type) {
            case 'migrating': {
                return { ...initialState };
            }
            case 'migrated': {
                return { ...initialState, success: action.payload };
            }
            case 'error': {
                return { ...initialState, error: action.payload };
            }
            default: {
                return state;
            }
        }
    };
    const [state, dispatch] = useReducer(fetchReducer, initialState);
    useEffect(() => {
        dispatch({ type: 'migrating' });
        migrate(db, migrations).then(() => {
            dispatch({ type: 'migrated', payload: true });
        }).catch((error) => {
            dispatch({ type: 'error', payload: error });
        });
    }, []);
    return state;
};
//# sourceMappingURL=migrator.js.map