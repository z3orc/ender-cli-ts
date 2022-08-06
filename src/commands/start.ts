import ora from "ora";
import { spawn } from "child_process";
import { attach } from "./attach.js";
import tcp from "tcp-port-used";
import Conf from "conf";

export async function start_attached() {
    const server = spawn("node", ["../lib/watcher.js"], { detached: true, shell: false, windowsHide: true });

    setTimeout(() => {
        attach();
    }, 1000);
}

export async function start_detached() {
    const program = String(process.argv[0]);
    const watcher = spawn(program, [process.argv[1], "watcher"], { detached: true, shell: true });
    const spinner = ora("Starting server").start();

    const config = new Conf({});
    const port = Number(await config.get("port"));

    tcp.check(port).then((inUse) => {
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

    tcp.waitUntilUsed(port, 500, 60000).then(
        () => {
            spinner.succeed("Server started");
            process.exit();
        },
        (err) => {
            spinner.fail("Server timeout");
            process.exit();
        }
    );
}
