"use strict";
// run with
// npx concurrently "npx tsc --watch qq-utils/redis.ts"  "node --watch qq-utils/redis.js"
// or
// npx tsc qq-utils/redis.ts && node qq-utils/redis.js
// Deps
// ioredis, dotenv
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var dotenv = require("dotenv");
var ioredis_1 = require("ioredis");
dotenv.config();
function QueryRedis() {
    var REDIS_CONNECT = process.env.REDIS_CONNECT;
    if (!REDIS_CONNECT)
        throw new Error('No Redis Connect String');
    var redisClient = new ioredis_1["default"](REDIS_CONNECT);
    redisClient.on('error', function (redisClientError) {
        console.error('REDIS ERROR:', redisClientError.message);
        process.exit(0);
    });
    logRedis(redisClient);
}
var interval;
try {
    QueryRedis();
    interval = setInterval(function () { return QueryRedis(); }, 10000);
}
catch (error) {
    if (error instanceof Error)
        console.error(error.message);
    process.exit(0);
}
function logRedis(redisClient) {
    return __awaiter(this, void 0, void 0, function () {
        var stream;
        return __generator(this, function (_a) {
            stream = redisClient.scanStream({ match: '*', count: 100 });
            stream.on('data', function (resultKeys) {
                var _this = this;
                resultKeys.forEach(function (key) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redisClient.get(key)];
                            case 1:
                                data = _a.sent();
                                console.log({ key: key, data: data });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            return [2 /*return*/];
        });
    });
}
process.on('SIGINT', function () {
    clearInterval(interval);
    console.log('bye, cleanup done.');
    process.exit();
});
