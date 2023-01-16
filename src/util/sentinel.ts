import { RedisOptions } from "ioredis";

export function parseSentinelUrl(url: string): RedisOptions {
    //redis-sentinel://[password@]host[:port][,host2[:port2]][/databaseNumber]#sentinelMasterId
    if (!url.startsWith("redis-sentinel://")) {
        throw new Error("invalid sentinel url");
    }

    const urlNoProtocol = url.substring("redis-sentinel://".length);
    const masterIndexOf = urlNoProtocol.indexOf("#");
    if (masterIndexOf === -1) {
        throw new Error("invalid redis sentinel url (no master name specied)");
    }
    const sentinelMasterId = urlNoProtocol.substring(masterIndexOf + 1);
    if (sentinelMasterId === "") {
        throw new Error("invalid redis sentinel url (no master name specied)");
    }
    const dbIndexOf = urlNoProtocol.indexOf("/");
    let db = 0;
    if (dbIndexOf > -1) {
        if (dbIndexOf > masterIndexOf) {
            throw new Error("invalid redis sentinel url (db# should be specified before master name)");
        }
        db = parseInt(urlNoProtocol.substring(dbIndexOf + 1, masterIndexOf));
        if (isNaN(db)) {
            throw new Error("invalid redis sentinel url (invalid db#)");
        }
    }
    let username: string, password: string;
    const authIndexOf = urlNoProtocol.indexOf("@");
    if (authIndexOf > -1) {
        const auth = urlNoProtocol.substring(0, authIndexOf);
        if (auth.indexOf(":") > -1) {
            username = auth.split(":")[0];
            if (username === "") {
                username = undefined;
            }
            password = auth.split(":")[1];
        } else {
            password = auth;
        }
    }
    const hosts = urlNoProtocol.substring(authIndexOf + 1, dbIndexOf === -1 ? masterIndexOf : dbIndexOf);
    return {
        sentinels: hosts.split(",").map((h) => ({ host: h.split(":")[0], port: parseInt(h.split(":")[1]) })),
        name: sentinelMasterId,
        db,
        ...(username && { username, sentinelUsername: username }),
        ...(password && { password, sentinelPassword: password }),
    };
}
