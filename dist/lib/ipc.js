// import ipc from "node-ipc";
// import readline from "readline";
// var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false,
// });
// ipc.config.id = "ender-minecraft-controller";
// ipc.config.retry = 1500;
// ipc.config.silent = true;
// ipc.connectTo("ender-minecraft-server", () => {
//     ipc.of["ender-minecraft-server"].on("ender-minecraft-server-stdout", (data) => {
//         process.stdout.write(`${data.toString()}`);
//     });
// });
// rl.on("line", function (line) {
//     ipc.of["ender-minecraft-server"].emit("ender-minecraft-server-stdin", String(line));
// });
