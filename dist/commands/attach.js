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
exports.attach = void 0;
const readline_1 = __importDefault(require("readline"));
const net_1 = __importDefault(require("net"));
function attach() {
    return __awaiter(this, void 0, void 0, function* () {
        var rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        });
        const client = net_1.default.createConnection({ port: 9000 }, () => {
            process.stdout.write("Connected to server.\n");
        });
        client.on("data", (data) => {
            process.stdout.write(data.toString());
        });
        client.on("close", () => {
            console.log("CLIENT: I disconnected from the server.");
            process.exit();
        });
        client.on("error", () => {
            console.log("Could not attach to server, is it running?");
            process.exit();
        });
        rl.on("line", (input) => {
            client.write(`${input}`);
        });
        rl.on("SIGTSTP", () => {
            process.exit();
        });
    });
}
exports.attach = attach;
// function write_to_log(data: String) {
//     if (data.includes("INFO")) {
//         let time = chalk.blueBright(data.substring(0, 10));
//         let worker = data.substring(11, 31);
//         let message = data.substring(33);
//         if (worker.includes("INFO")) {
//             worker = chalk.green(worker);
//         } else {
//             worker = chalk.red(worker);
//         }
//         process.stdout.write(`${time} ${worker} ${message}\n`);
//     } else {
//         process.stdout.write(data.toString());
//     }
// }
