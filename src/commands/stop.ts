import net from "net";
import ora from "ora";

export async function stop() {
    const spinner = ora("Stopping server").start();

    const client = net.createConnection({ port: 25585 }, () => {
        client.write(`stop\n`);
    });

    client.on("error", () => {
        spinner.succeed("Server stopped");
        process.exit();
    });

    client.on("exit", () => {
        spinner.succeed("Server stopped");
        process.exit();
    });

    setTimeout(() => {
        spinner.fail("Could not stop server");
        process.exit();
    }, 15000);
}
