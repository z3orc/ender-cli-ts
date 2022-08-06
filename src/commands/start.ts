import ora from "ora";
import { spawn } from "child_process";
import { spawnSync } from "child_process";
import { attach } from "./attach.js";
import tcp from "tcp-port-used";
import Conf from "conf";

export async function start_attached() {
    const config = new Conf({ projectName: "ender-ts" });
    const ram = await config.get("ram");
    const port = Number(await config.get("port"));
    const launch_params = `java -Xmx${ram} -Xms${ram}  -jar ../bin/server.jar --nogui`;

    var ls = spawn("java", ["-jar", "../bin/server.jar", "--nogui"], { cwd: "./data", stdio: ["pipe", "pipe", "pipe", "pipe"] });
    var log = [];
}

export async function start_detached() {
    const program = String(process.argv[0]);
    const watcher = spawn(program, [process.argv[1], "monitor"], { detached: true, shell: true });
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
