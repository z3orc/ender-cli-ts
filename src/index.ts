import { program } from "commander";
import { attach } from "./commands/attach.js";
import { setup } from "./commands/setup.js";
import { start_attached, start_detached } from "./commands/start.js";
import { stop } from "./commands/stop.js";
import { monitor } from "./commands/monitor.js";
import { upgrade } from "./commands/upgrade.js";
import { backup} from "./commands/backup.js";

program.name("ender-cli").description("A cli application to setup and manage a Minecraft-server").version("0.1.0");

program
    .command("setup")
    .description("Sets up a new Minecraft-server")
    .action(() => {
        setup();
    });

program
    .command("start")
    .description("Starts the Minecraft-server")
    .option("-a, --attached", "Starts the server attached to the console")
    .action(() => {
        if (program.args[1] == "--attached" || program.args[1] == "-a") {
            start_attached();
        } else {
            start_detached();
        }
    });

program
    .command("stop")
    .description("Sends a stop-command to the Minecraft-server")
    .option("-f, --force", "Force the server to stop, might cause data loss")
    .action(() => {
        stop();
    });

program
    .command("attach")
    .description("Attaches to the server")
    .action(() => {
        attach();
    });

program
    .command("backup")
    .description("Backups the server to a zip-file")
    .action(() => {
        backup();
    });

program
    .command("upgrade")
    .description("Upgrades the Minecraft-server to a newer version")
    .action(() => {
        upgrade();
    });

program
    .command("monitor")
    .description("Starts the watcher-process")
    .action(() => {
        monitor();
    });

program.parse();
