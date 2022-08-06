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
exports.start_detached = exports.start_attached = void 0;
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const attach_js_1 = require("./attach.js");
const tcp_port_used_1 = __importDefault(require("tcp-port-used"));
const conf_1 = __importDefault(require("conf"));
function start_attached() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = (0, child_process_1.spawn)("node", ["../lib/watcher.js"], { detached: true, shell: false, windowsHide: true });
        setTimeout(() => {
            (0, attach_js_1.attach)();
        }, 1000);
    });
}
exports.start_attached = start_attached;
function start_detached() {
    return __awaiter(this, void 0, void 0, function* () {
        const program = String(process.argv[0]);
        const watcher = (0, child_process_1.spawn)(program, [process.argv[1], "watcher"], { detached: true, shell: true });
        const spinner = (0, ora_1.default)("Starting server").start();
        const config = new conf_1.default({});
        const port = Number(yield config.get("port"));
        tcp_port_used_1.default.check(port).then((inUse) => {
            if (inUse) {
                spinner.fail("Port is already in use");
                process.exit();
            }
        });
        watcher.on("exit", (e) => {
            spinner.fail("Could not boot server");
            process.exit();
        });
        watcher.on("error", (e) => {
            spinner.fail("Could not boot server");
            process.exit();
        });
        tcp_port_used_1.default.waitUntilUsed(port, 500, 60000).then(() => {
            spinner.succeed("Server started");
            process.exit();
        }, (err) => {
            spinner.fail("Server timeout");
            process.exit();
        });
    });
}
exports.start_detached = start_detached;
