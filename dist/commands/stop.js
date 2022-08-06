"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = void 0;
const net_1 = __importDefault(require("net"));
const ora_1 = __importDefault(require("ora"));
function stop() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = (0, ora_1.default)("Stopping server").start();
        const client = net_1.default.createConnection({ port: 9000 }, () => {
            client.write(`stop\n`);
        });
        client.on("error", () => {
            spinner.succeed("Server stopped");
            process.exit();
        });
        client.on("exit", () => {
            spinner.succeed("Server stopped");
            process.exit();
        });
        setTimeout(() => {
            spinner.fail("Could not stop server");
            process.exit();
        }, 15000);
    });
}
exports.stop = stop;
