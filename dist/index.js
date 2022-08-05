#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const attach_js_1 = require("./commands/attach.js");
const setup_js_1 = require("./commands/setup.js");
const start_js_1 = require("./commands/start.js");
const stop_js_1 = require("./commands/stop.js");
const watcher_js_1 = require("./lib/watcher.js");
commander_1.program.name("ender-cli").description("A cli application to setup and manage a Minecraft-server").version("0.1.0");
commander_1.program
    .command("setup")
    .description("Sets up a new Minecraft-server")
    .action(() => {
    (0, setup_js_1.setup)();
});
commander_1.program
    .command("start")
    .description("Starts the Minecraft-server")
    .option("-a, --attached", "Starts the server attached to the console")
    .action(() => {
    console.log(commander_1.program.args[1]);
    if (commander_1.program.args[1] == "--attached" || commander_1.program.args[1] == "-a") {
        (0, start_js_1.start_attached)();
    }
    else {
        (0, start_js_1.start_detached)();
    }
});
commander_1.program
    .command("stop")
    .description("Sends a stop-command to the Minecraft-server")
    .option("-f, --force", "Force the server to stop, might cause data loss")
    .action(() => {
    (0, stop_js_1.stop)();
});
commander_1.program
    .command("attach")
    .description("Attaches to the server")
    .action(() => {
    (0, attach_js_1.attach)();
});
commander_1.program
    .command("watcher")
    .description("Starts the watcher-process")
    .action(() => {
    (0, watcher_js_1.watcher)();
});
commander_1.program.parse();
