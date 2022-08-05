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
exports.setup = void 0;
const conf_1 = __importDefault(require("conf"));
const enquirer_1 = __importDefault(require("enquirer"));
const fs_1 = __importDefault(require("fs"));
const download_js_1 = require("../lib/download.js");
const { prompt } = enquirer_1.default;
const config = new conf_1.default();
let spinner;
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("setup");
        const question = [
            {
                type: "input",
                name: "version",
                message: "Which minecraft version",
                initial: "1.19",
            },
            {
                type: "select",
                name: "flavour",
                message: "Choose a server-jar flavour",
                choices: ["Vanilla", "Paper", "Purpur"],
            },
            {
                type: "input",
                name: "ram",
                message: "How much ram should the server use (in MB)",
                initial: "2000MB",
            },
            {
                type: "input",
                name: "player_limit",
                message: "Enter the maximum player limit",
                initial: "12",
            },
            {
                type: "input",
                name: "world_seed",
                message: "Enter a world seed (optional)",
                initial: "",
            },
            {
                type: "select",
                name: "gamemode",
                message: "Choose default gamemode",
                choices: ["survival", "creative", "adventure"],
            },
            {
                type: "select",
                name: "difficulty",
                message: "Choose server difficulty",
                choices: ["peaceful", "easy", "normal", "hard"],
            },
            {
                type: "input",
                name: "port",
                message: "Which port the server should listen on",
                initial: "25565",
            },
            {
                type: "confirm",
                name: "whitelist",
                message: "Should the server be whitelisted?",
            },
        ];
        let answers = yield prompt(question);
        config.set(answers);
        if (!fs_1.default.existsSync("./data")) {
            fs_1.default.mkdirSync("./data");
        }
        if (!fs_1.default.existsSync("./bin")) {
            fs_1.default.mkdirSync("./bin");
        }
        const version = yield config.get("version");
        const flavour = yield config.get("flavour");
        yield (0, download_js_1.download)("https://dynamic.z3orc.com/" + flavour + "/" + version, "./bin/server.jar");
    });
}
exports.setup = setup;
