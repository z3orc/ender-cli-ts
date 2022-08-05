import net from "net";
import ora from "ora";

export function stop() {
    const spinner = ora("Stopping server").start();

    const client = net.createConnection({ port: 9000 }, () => {
        client.write(`stop\n`);
    });

    client.on("error", () => {
        spinner.succeed("Server stopped");
        process.exit();
    });
}
