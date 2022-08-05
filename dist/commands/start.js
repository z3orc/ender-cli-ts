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
// import chalk from "chalk";
// import Conf from "conf";
const attach_js_1 = require("./attach.js");
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
        console.log(process.execPath);
        const server = (0, child_process_1.spawn)(program, [process.argv[1], "watcher"], { detached: true, shell: false });
        const spinner = (0, ora_1.default)("Starting server").start();
        setTimeout(() => {
            if (server.exitCode == null) {
                spinner.succeed("Server running");
            }
            else {
                spinner.fail("Could not boot server");
            }
            process.exit();
        }, 10000);
        console.log("hello");
    });
}
exports.start_detached = start_detached;
