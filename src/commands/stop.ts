import net from "net";
import ora from "ora";
import tcp from "tcp-port-used";

export async function stop() {
    const spinner = ora("Stopping server").start();

    const client = net.createConnection({ port: 25585 }, () => {
        client.on("error", () => {
            spinner.succeed("Server stopped");
            process.exit();
        });

        client.on("exit", () => {
            spinner.succeed("Server stopped");
            process.exit();
        });

        client.on("close", () => {
            spinner.succeed("Server stopped");
            process.exit();
        });

        client.write(`stop\n`);
    });

    // setTimeout(() => {
    //     spinner.fail("Could not stop server");
    //     process.exit();
    // }, 60000);
}
