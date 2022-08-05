import readline from "readline";
import net from "net";

export async function attach() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    const client = net.createConnection({ port: 9000 }, () => {
        process.stdout.write("Connected to server.\n");
    });

    client.on("data", (data) => {
        process.stdout.write(data.toString());
    });

    client.on("close", () => {
        console.log("CLIENT: I disconnected from the server.");
        process.exit();
    });

    client.on("error", () => {
        console.log("Could not attach to server, is it running?");
        process.exit();
    });

    rl.on("line", (input) => {
        client.write(`${input}`);
    });

    rl.on("SIGTSTP", () => {
        process.exit();
    });
}
