import fs from "fs";
import archiver from "archiver";
// import unzipper from "unzipper";
// import rimraf from "rimraf";
import ora from "ora";
// import path from "path";

export function backup() {
    const date = Date.now();
    const spinner = ora(`Creating backup (${date}.zip)`).start();

    if (!fs.existsSync("./backups")) {
        fs.mkdirSync("./backups");
    }

    if (!fs.existsSync("./backups/backups.json")) {
        fs.writeFileSync(
            "./backups/backups.json",
            JSON.stringify({
                backups: [],
            })
        );
    }
    const backup = fs.createWriteStream(`./backups/${date}.zip`);
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
    });

    backup.on("close", () => {
        spinner.succeed(`Backup created (${date}.zip)`);
    });

    archive.on("error", (err) => {
        spinner.fail(`Could not create backup (${date}.zip)`);
    });

    archive.pipe(backup);
    archive.directory("./data", false);
    archive.finalize();

    clean_backup_list();
    register_backup(String(backup.path), date);
}

// export function restore() {
//     const directory = "./data";

//     if (fs.existsSync("./data")) {
//         fs.rmSync(directory, { recursive: true });
//     }

//     fs.mkdirSync("./data");

//     let output = fs.readFileSync("./backups/backups.json");
//     let file = JSON.parse(output.toString());
//     let latest_backup_path = file["backups"][file["backups"].length - 1]["path"];

//     console.log(latest_backup_path);

//     // fs.createReadStream(latest_backup_path).pipe(
//     //     unzipper.Extract({ path: "./data" }).on("close", () => {
//     //         process.exit();
//     //     })
//     // );
// }

function register_backup(path: String, date: Number) {
    let output = fs.readFileSync("./backups/backups.json");
    let file = JSON.parse(output.toString());

    const new_backup_info = new Backup(path, date);

    file["backups"].push(new_backup_info);

    fs.writeFileSync("./backups/backups.json", JSON.stringify(file));
}

function clean_backup_list() {
    let output = fs.readFileSync("./backups/backups.json");
    let file = JSON.parse(output.toString());

    for (let i = file["backups"].length - 1; i >= 0; i--) {
        if (!fs.existsSync(file["backups"][i]["path"])) {
            file["backups"].splice(i, 1);
        }
    }

    fs.writeFileSync("./backups/backups.json", JSON.stringify(file));
}

class Backup {
    path;
    date;
    constructor(path, date) {
        this.path = path;
        this.date = date;
    }
}
