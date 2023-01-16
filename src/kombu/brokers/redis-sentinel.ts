import { default as Redis } from "ioredis";
import { parseSentinelUrl } from "../../util/sentinel";
import RedisBroker from './redis';


export default class RedisSentinelBroker extends RedisBroker {
    /**
     * Redis sentinel broker class
     * @constructor RedisSentinelBroker
     * @param {string} url the connection string of redis
     * @param {object} opts the options object for redis connect of ioredis
     */

    constructor(url: string, opts) {
        super(undefined, undefined);
        this.redis = new Redis(parseSentinelUrl(url));
    }
}
