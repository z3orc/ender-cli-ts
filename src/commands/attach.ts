import readline from "readline";
import net from "net";
import chalk from "chalk";

export async function attach() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    const client = net.createConnection({ port: 25585 }, () => {
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

// function write_to_log(data: String) {
//     if (data.includes("INFO")) {
//         let time = chalk.blueBright(data.substring(0, 10));
//         let worker = data.substring(11, 31);
//         let message = data.substring(33);

//         if (worker.includes("INFO")) {
//             worker = chalk.green(worker);
//         } else {
//             worker = chalk.red(worker);
//         }

//         process.stdout.write(`${time} ${worker} ${message}\n`);
//     } else {
//         process.stdout.write(data.toString());
//     }
// }
