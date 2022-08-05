"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = void 0;
const net_1 = __importDefault(require("net"));
const ora_1 = __importDefault(require("ora"));
function stop() {
    const spinner = (0, ora_1.default)("Stopping server").start();
    const client = net_1.default.createConnection({ port: 9000 }, () => {
        client.write(`stop\n`);
    });
    client.on("error", () => {
        spinner.succeed("Server stopped");
        process.exit();
    });
}
exports.stop = stop;
