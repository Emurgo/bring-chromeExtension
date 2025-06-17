import storage from "../storage"

const CURRENT_MIGRATION_VERSION = 1;

const migrateObject = async (key: string, now: number) => {
    const obj = await storage.get(key);
    if (obj && typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'number' && value > now) {
                obj[key] = [now, value]; // Extend quiet domain to 30 days
            } else {
                delete obj[key]; // Remove expired quiet domains
            }
        }
        storage.set(key, obj);
    }
}

const runMigration = async () => {
    try {
        const now = Date.now();

        // OPT-OUT MIGRATION
        const optOut = await storage.get('optOut');
        if (optOut && typeof optOut === 'number' && optOut > now) {
            await storage.set('optOut', [now, optOut]); // Extend opt-out to 30 days
        } else {
            await storage.remove('optOut'); // Remove opt-out if it was expired
        }
        // OPT-OUT DOMAINS MIGRATION
        await migrateObject('optOutDomains', now);

        // QUIET DOMAINS MIGRATION
        await migrateObject('quietDomains', now);
        return true;
    } catch (error) {
        return false;
    }
}

export const checkAndRunMigration = async () => {
    const migrationVersion = await storage.get('migrationVersion') || 0;

    if (migrationVersion < CURRENT_MIGRATION_VERSION) {
        const isSucceed = await runMigration();
        if (isSucceed) await storage.set('migrationVersion', CURRENT_MIGRATION_VERSION);
    }
}