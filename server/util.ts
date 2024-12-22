import { createClient } from "redis";

export const getArg = (key: string, def: any) => {
    let value: any = def;
    const i = Bun.argv.findIndex((v) => v.includes(`--${key}`));
    const regex = new RegExp(`(--${key}=)(\d*)$`);
    if (i != -1) {
        if (Bun.argv.length > i + 1) {
            value = Bun.argv[i + 1];
            !value && (value = def);
        } else if (regex.test(Bun.argv[i])) {
            value = Bun.argv[i].split("=")[1];
            !value && (value = def);
        }
    }

    return value;
};

export const createRedisCache = async (database: number = 1) => {
    return await createClient({ database })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
};

const __STORE__ = new Set<string>();
/**
 * @param duration milliseconds
 */
export const delay = (
    id: string,
    fn: VoidFunction,
    duration: number = 1000,
) => {
    if (__STORE__.has(id)) return;
    __STORE__.add(id);
    setTimeout(() => {
        __STORE__.delete(id);
    }, duration);
    fn();
};
