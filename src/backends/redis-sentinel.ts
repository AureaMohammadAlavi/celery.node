import { default as Redis } from "ioredis";
import { parseSentinelUrl } from "../util/sentinel";
import RedisBackend from "./redis";

/**
 * @exports
 */
export default class RedisSentinelBackend extends RedisBackend {
    /**
     * Redis Sentinel backend class
     * @constructor RedisSentinelBackend
     * @param {string} url the connection string of redis
     * @param {object} opts the options object for redis connect of ioredis
     */
    constructor(url: string, opts) {
        super(undefined, undefined);
        this.redis = new Redis(parseSentinelUrl(url));
    }
}
