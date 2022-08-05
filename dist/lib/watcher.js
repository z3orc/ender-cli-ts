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
exports.watcher = void 0;
const child_process_1 = require("child_process");
const conf_1 = __importDefault(require("conf"));
const net_1 = __importDefault(require("net"));
function watcher() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = new conf_1.default({ projectName: "ender-ts" });
        const ram = yield config.get("ram");
        var ls = (0, child_process_1.exec)("java -jar ../bin/server.jar nogui", { cwd: "./data" });
        var log = [];
        var server = net_1.default.createServer();
        server.on("connection", (socket) => {
            log.forEach((element) => {
                socket.write(element);
            });
            socket.on("data", (data) => {
                ls.stdin.write(data.toString() + "\n");
            });
            socket.on("error", () => {
                socket.end();
            });
            ls.stdout.on("data", (data) => {
                socket.write(data);
            });
            ls.stderr.on("data", (data) => {
                socket.write(data);
            });
            ls.on("close", (code) => {
                process.stdout.write(`child process exited with code ${code}`);
                socket.emit("close");
                process.exit();
            });
        });
        ls.stdout.on("data", (data) => {
            log.push(data.toString());
        });
        ls.stderr.on("data", (data) => {
            log.push(data.toString());
        });
        ls.on("exit", () => {
            process.exit();
        });
        process.on("exit", () => {
            ls.kill("SIGINT");
        });
        server.listen(9000, () => {
            // console.log("opened server on %j", server.address());
        });
    });
}
exports.watcher = watcher;
