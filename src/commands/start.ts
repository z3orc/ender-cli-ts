import ora from "ora";
import { spawn } from "child_process";
import { Worker } from "worker_threads";
import { dirname } from "path";
// import chalk from "chalk";
// import Conf from "conf";
import { attach } from "./attach.js";

export async function start_attached() {
    const server = spawn("node", ["../lib/watcher.js"], { detached: true, shell: false, windowsHide: true });

    setTimeout(() => {
        attach();
    }, 1000);
}

export async function start_detached() {
    const program = String(process.argv[0]);
    console.log(process.execPath);
    const server = spawn(program, [process.argv[1], "watcher"], { detached: true, shell: false });

    const spinner = ora("Starting server").start();

    setTimeout(() => {
        if (server.exitCode == null) {
            spinner.succeed("Server running");
        } else {
            spinner.fail("Could not boot server");
        }
        process.exit();
    }, 10000);
    console.log("hello");
}
