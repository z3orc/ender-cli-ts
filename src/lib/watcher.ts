import { exec } from "child_process";
import Conf from "conf";
import net from "net";

export async function watcher() {
    const config = new Conf({ projectName: "ender-ts" });
    const ram = await config.get("ram");
    var ls = exec("java -jar ../bin/server.jar nogui", { cwd: "./data" });
    var log = [];

    var server = net.createServer();
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
}
