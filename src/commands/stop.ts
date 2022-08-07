import Conf from "conf";
import net from "net";
import ora from "ora";
import tcp from "tcp-port-used";

export async function stop() {
    const config = new Conf({ cwd: "./config/ender.json" });
    const port = Number(await config.get("port"));
    const spinner = ora("Stopping server");

    const client = net.createConnection({ port: 25585 }, () => {
        spinner.start();
    });

    client.on("data", (data) => {});

    client.on("close", () => {
        tcp.check(port).then((res) => {
            if (!res) {
                spinner.succeed("Server stopped");
                process.exit();
            } else {
                spinner.fail("Server did not stop successfully");
                process.exit();
            }
        });
    });

    client.on("error", () => {
        console.log("Server stopped");
        process.exit();
    });

    setTimeout(() => {
        client.write("stop\n");
    }, 2000);
}
