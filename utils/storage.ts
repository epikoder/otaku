interface Schema<T> {
    id: string;
    value: {
        data: T;
        timestamp: Date;
    };
}

export abstract class DataStore<T> {
    constructor(db: string) {
        this._db = db;
    }

    private _db: string;
    async get(id: string): Promise<T | undefined> {
        return;
    }
    async set(id: string, value: T): Promise<void> {}
    async update(id: string, value: T): Promise<void> {}
    async delete(id: string): Promise<T | undefined> {
        return;
    }
    async entries(search?: {}): Promise<T[]> {
        return [];
    }
    private async sync() {}
}
